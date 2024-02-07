import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

const AddApplianceForm = ({ onAdd, onCancel }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [protocol, setProtocol] = useState("");
  const [url, setUrl] = useState("");

  const handleAdd = () => {
    // Input field validation
    // if (!name || !type || !protocol || !url) {
    //   console.error("Please fill in all required fields");
    //   return;
    // }

    // Create new appliance object with only necessary fields
    const newAppliance = {
      name,
      type,
      protocol,
      url,
    };

    // Pass the new appliance data to the onAdd function
    onAdd(newAppliance);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
        placeholderTextColor="#9D9D9D"
      />
      <TextInput
        style={styles.input}
        value={type}
        onChangeText={setType}
        placeholder="Type"
        placeholderTextColor="#9D9D9D"
      />
      <TextInput
        style={styles.input}
        value={protocol}
        onChangeText={setProtocol}
        placeholder="Protocol"
        placeholderTextColor="#9D9D9D"
      />
      <TextInput
        style={styles.input}
        value={url}
        onChangeText={setUrl}
        placeholder="URL"
        placeholderTextColor="#9D9D9D"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#5e0acc" }]}
          onPress={handleAdd}
        >
          <Text style={{ color: "white" }}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#f31282" }]}
          onPress={onCancel}
        >
          <Text style={{ color: "white" }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    margin: 10,
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#786E70",
    borderColor: "#aaa",
    padding: 10,
    marginBottom: 10,
    color: "white",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    height: 40,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    margin: 5,
  },
});

export default AddApplianceForm;
