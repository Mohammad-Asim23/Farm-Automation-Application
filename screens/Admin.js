import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AddApplianceForm from "../components/AddApplianceForm";
import db from "../Database/DataBase";

const Admin = () => {
  const [showForm, setShowForm] = useState(false);
  const [appliances, setAppliances] = useState([]);

  const getFormattedTimestamp = () => {
    const date = new Date();
    const isoString = date.toISOString();
    return isoString;
  };

  const addAppliance = (appliance) => {
    db.transaction((tx) => {
      // Check if there are already 4 appliances
      if (appliances.length >= 4) {
        console.error("Cannot add more than 4 appliances");
        return;
      }

      // Check if there are any available switches
      let availableSwitch = null;
      for (let i = 1; i <= 4; i++) {
        const switchNumber = `switch${i}`;
        if (!appliances.find((a) => a.switchnumber === switchNumber)) {
          availableSwitch = switchNumber;
          break;
        }
      }

      // If no available switch, do not add the appliance
      if (!availableSwitch) {
        console.error("No available switches to assign");
        return;
      }

      tx.executeSql(
        "INSERT INTO appliances (name, type, protocol, url, switchnumber) VALUES (?, ?, ?, ?, ?)",
        [
          appliance.name,
          appliance.type,
          appliance.protocol,
          appliance.url,
          availableSwitch,
        ],
        (_, { insertId }) => {
          const applianceId = insertId;
          addApplianceRecord(applianceId, "off");
          console.log("Appliance data inserted successfully");
        },
        (_, error) => {
          console.error("Error inserting appliance data:", error);
        }
      );
    });
  };

  const addApplianceRecord = (applianceId, status) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT type FROM appliances WHERE id = ?",
        [applianceId],
        (_, { rows }) => {
          const applianceType = rows._array[0]?.type.toUpperCase();
          const tableName =
            applianceType === "APPLIANCE"
              ? "appliance_records"
              : "sensor_records";

          tx.executeSql(
            `INSERT INTO ${tableName} (appliance_id, status, timestamp) VALUES (?, ?, ?)`,
            [applianceId, status, getFormattedTimestamp()],
            (_, { rowsAffected }) => {
              if (rowsAffected > 0) {
                console.log(`${applianceType} record inserted successfully`);
              } else {
                console.error(`Error inserting ${applianceType} record`);
              }
            },
            (_, error) => {
              console.error(`Error inserting ${applianceType} record:`, error);
            }
          );
        },
        (_, error) => {
          console.error("Error checking appliance type:", error);
        }
      );
    });
  };

  const getLastInsertedApplianceId = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT last_insert_rowid() as id",
          [],
          (_, { rows }) => {
            const { id } = rows.item(0);
            resolve(id);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const handleAddAppliance = async (newAppliance) => {
    addAppliance(newAppliance);

    try {
      const applianceId = await getLastInsertedApplianceId();
      setAppliances((prevAppliances) => [...prevAppliances, newAppliance]);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding appliance record:", error);
    }
  };

  return (
    <LinearGradient
      style={{ flex: 1, paddingHorizontal: 10, paddingTop: 18 }}
      colors={["#C463DA", "#7E51D1"]}
    >
      <View className="mx-3">
        <TouchableOpacity
          className="p-2  w-full h-10 justify-center items-center "
          style={{ backgroundColor: "#9C3CBF", borderRadius: 6 }}
          onPress={handleShowForm}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Add Appliance
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={showForm}
        animationType="slide"
        transparent={false}
        onRequestClose={handleCancelForm}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View className="" style={styles.formContainer}>
              <Text style={styles.formHeading}>Add Appliance</Text>
              <AddApplianceForm
                onAdd={handleAddAppliance}
                onCancel={handleCancelForm}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  formHeading: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#4B1D76",
  },
  formContainer: {
    backgroundColor: "#4B1D76",
    marginTop: 40,
    color: "white",
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
  },
  scrollContent: {
    flexGrow: 1,
    // justifyContent: 'flex-end', // Adjust as needed
  },
});

export default Admin;
