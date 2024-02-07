import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import db from "../Database/DataBase";
import { useFocusEffect } from "@react-navigation/native";

import { Client } from "react-native-paho-mqtt";
import AsyncStorage from "@react-native-async-storage/async-storage";

const myStorage = {
  setItem: (key, item) => AsyncStorage.setItem(key, item),
  getItem: (key) => AsyncStorage.getItem(key),
  removeItem: (key) => AsyncStorage.removeItem(key),
  clear: () => AsyncStorage.clear(),
};

const client = new Client({
  uri: "ws://broker.emqx.io:8083/mqtt",
  clientId: "your-unique-client-id",
  storage: myStorage,
});

const Dashboard = ({ navigation }) => {
  const [appliances, setAppliances] = useState([]);
  const [applianceStatus, setApplianceStatus] = useState({
    switch1: "OFF",
    switch2: "OFF",
    switch3: "OFF",
    switch4: "OFF",
  });

  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
  });

  const fetchAppliances = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT a.*, (SELECT status FROM appliance_records WHERE appliance_id = a.id ORDER BY timestamp DESC LIMIT 1) as status FROM appliances a",
        [],
        (_, { rows }) => {
          const applianceData = rows._array;
          setAppliances(applianceData);
        },
        (_, error) => {
          console.error("Error fetching appliances:", error);
        }
      );
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchAppliances();
    }, [])
  );

  useEffect(() => {
    const onConnect = () => {
      console.log("Connected to MQTT Broker!");
      // Subscribe to the MQTT topic for appliance and sensor data
      client.subscribe("testlocation1/data");
    };

    const onFailure = (error) => {
      console.error("Connection error:", error);
    };

    client.connect().then(onConnect).catch(onFailure);

    fetchAppliances();

    client.on("messageReceived", (message) => {
      const data = JSON.parse(message.payloadString);

      if (data.command === "setStatus") {
        setApplianceStatus(data);
      } else {
        setSensorData(data);
      }
    });

    return () => {
      if (client.isConnected()) {
        client.disconnect();
      }
    };
  }, []);

  const publishMessage = (applianceId, status) => {
    // Find the index of the appliance with the given ID
    const applianceIndex = appliances.findIndex(
      (item) => item.id === applianceId
    );
    if (applianceIndex === -1) {
      console.error("Appliance not found with ID:", applianceId);
      return;
    }

    // Extract switch number from the appliance
    const switchNumber = appliances[applianceIndex].switchnumber;

    // Check if the switch number is within the valid range (switch1 to switch4)
    if (
      !switchNumber.startsWith("switch") ||
      isNaN(parseInt(switchNumber.slice(6)))
    ) {
      console.error("Invalid switch number:", switchNumber);
      return;
    }

    // Prepare the message with updated status for the specific switch
    const updatedStatuses = { ...applianceStatus };

    // Update the status for the specific switch based on its index
    updatedStatuses[`switch${applianceIndex + 1}`] = status;

    // Send the message to the MQTT broker
    const message = {
      command: "setStatus",
      ...updatedStatuses,
    };

    client.send("testlocation1/data", JSON.stringify(message));
  };

  const deleteApplianceRecords = (applianceId) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM appliance_records WHERE appliance_id = ?",
          [applianceId],
          (_, { rowsAffected }) => {
            console.log(
              `Deleted ${rowsAffected} records from appliance_records for appliance with ID ${applianceId}`
            );
            resolve();
          },
          (_, error) => {
            console.error(
              "Error deleting appliance records from the database:",
              error
            );
            reject(error);
          }
        );
      });
    });
  };

  const deleteAppliance = (applianceId) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM appliances WHERE id = ?",
          [applianceId],
          (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
              console.log("Appliance deleted successfully from the database");
              resolve();
            } else {
              console.error("No rows deleted. Appliance not found.");
              reject();
            }
          },
          (_, error) => {
            console.error("Error deleting appliance from the database:", error);
            reject(error);
          }
        );
      });
    });
  };

  const handleDeleteAppliance = (index) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this appliance?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            // Get the ID of the appliance to be deleted
            const applianceId = appliances[index].id;

            try {
              // Delete the appliance from the "appliances" table
              await deleteAppliance(applianceId);

              // Delete the corresponding records from the "appliance_records" table
              await deleteApplianceRecords(applianceId);

              // Copy the appliances array and remove the selected appliance
              const updatedAppliances = [...appliances];
              updatedAppliances.splice(index, 1);

              // Update the state to reflect the changes
              setAppliances(updatedAppliances);

              // Check if there are no appliances left and set the state to an empty array
              if (updatedAppliances.length === 0) {
                setAppliances([]);
              }
            } catch (error) {
              console.error("Error deleting appliance:", error);
            }
          },
          style: "destructive", // This makes the text color red (iOS only)
        },
      ],
      { cancelable: false }
    );
  };

  const handleApplianceToggle = (applianceId, currentStatus) => {
    const newStatus = currentStatus === "ON" ? "OFF" : "ON";
    const updateStatus = newStatus.toUpperCase();
    publishMessage(applianceId, updateStatus);

    db.transaction(
      (tx) => {
        tx.executeSql(
          "INSERT INTO appliance_records (appliance_id, status, timestamp) VALUES (?, ?, ?)",
          [applianceId, newStatus, new Date().toISOString()],
          () => {
            console.log(`Appliance status updated in DB.`);
            // Update the appliances state with the new status
            setAppliances((prevAppliances) =>
              prevAppliances.map((appliance) =>
                appliance.id === applianceId
                  ? { ...appliance, status: newStatus }
                  : appliance
              )
            );
            fetchAppliances(); // Refresh the list with the latest status
          },
          (error) => {
            console.error("Error updating appliance status:", error);
          }
        );
      },
      (error) => {
        console.error("Transaction error:", error);
      },
      () => {
        console.log("Transaction completed successfully");
      }
    );
  };

  return (
    <LinearGradient
      style={{ flex: 1, paddingHorizontal: 10, paddingTop: 18 }}
      colors={["#C463DA", "#7E51D1"]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sensorContainer}>
          <Text style={styles.sensorTitle}>Sensor Data</Text>
          <Text style={styles.sensorValue}>
            Temperature: {sensorData.temperature}°C
          </Text>
          <Text style={styles.sensorValue}>
            Humidity: {sensorData.humidity}%
          </Text>
        </View>

        {appliances.map((appliance, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              navigation.navigate("Details", { appliance });
            }}
            style={styles.applianceContainer}
          >
            <Text style={styles.applianceName}>{appliance.name}</Text>
            <TouchableOpacity
              onPress={() => handleDeleteAppliance(index)}
              style={styles.deleteIcon}
            >
              <AntDesign name="delete" size={24} color={"#FF0000"} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                handleApplianceToggle(appliance.id, appliance.status)
              }
              style={[
                styles.toggleButton,
                appliance.status === "ON" ? styles.buttonOn : styles.buttonOff,
              ]}
            >
              <Text style={styles.toggleButtonText}>
                {appliance.status === "ON" ? "OFF" : "ON"}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },

  sensorContainer: {
    backgroundColor: "#6439A4",
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  sensorTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 5,
  },
  sensorValue: {
    color: "white",
    fontSize: 16,
  },

  applianceContainer: {
    backgroundColor: "#6439A4",
    marginBottom: 10,
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
  formHeading: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  scrollContent: {
    flexGrow: 1,
    // justifyContent: 'flex-end', // Adjust as needed
  },
  applianceContainer: {
    backgroundColor: "#6439A4",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  applianceName: {
    color: "white",
    fontSize: 16,
  },
  deleteIcon: {
    padding: 5,
    borderRadius: 50,
  },

  toggleButton: {
    padding: 10,
    borderRadius: 5,
  },
  buttonOn: {
    backgroundColor: "#FF5722",
  },
  buttonOff: {
    backgroundColor: "#4CAF50",
  },
  toggleButtonText: {
    color: "white",
  },
});

export default Dashboard;
