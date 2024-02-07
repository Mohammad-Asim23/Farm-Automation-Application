import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import db from "../Database/DataBase";

const EditApplianceDetails = ({ appliance, onSave, onCancel }) => {
  const [editedAppliance, setEditedAppliance] = useState(appliance);

  const updateApplianceInDB = (appliance) => {
    db.transaction((tx) => {
      const { id, name, type, protocol, url } = appliance;
      tx.executeSql(
        "UPDATE appliances SET name = ?, type = ?, protocol = ?, url = ? WHERE id = ?",
        [name, type, protocol, url, id],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            console.log("Appliance updated successfully");
          } else {
            console.error("Error updating appliance");
          }
        },
        (_, error) => {
          console.error("Error updating appliance:", error);
        }
      );
    });
  };

  const handleSave = () => {
    onSave(editedAppliance);
    updateApplianceInDB(editedAppliance);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>Name:</Text>
      <TextInput
        value={editedAppliance.name}
        onChangeText={(text) =>
          setEditedAppliance({ ...editedAppliance, name: text })
        }
        style={styles.input}
      />
      <Text style={styles.textStyle}>Type:</Text>
      <TextInput
        value={editedAppliance.type}
        onChangeText={(text) =>
          setEditedAppliance({ ...editedAppliance, type: text })
        }
        style={styles.input}
      />
      <Text style={styles.textStyle}>Protocol:</Text>
      <TextInput
        value={editedAppliance.protocol}
        onChangeText={(text) =>
          setEditedAppliance({ ...editedAppliance, protocol: text })
        }
        style={styles.input}
      />
      <Text style={styles.textStyle}>URL:</Text>
      <TextInput
        value={editedAppliance.url}
        onChangeText={(text) =>
          setEditedAppliance({ ...editedAppliance, url: text })
        }
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.button, { backgroundColor: "#5e0acc" }]}
        >
          <Text style={{ color: "white" }}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onCancel}
          style={[styles.button, { backgroundColor: "#f31282" }]}
        >
          <Text style={{ color: "white" }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: {
    marginVertical: 10,
    margin: 10,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#B1A7A7",
    borderColor: "#BBB2B2",
    padding: 10,
    marginBottom: 10,
    color: "white",
  },
  textStyle: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    height: 40,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    margin: 5,
  },
};

export default EditApplianceDetails;
