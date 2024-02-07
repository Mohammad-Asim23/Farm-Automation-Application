import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const ApplianceDetails = ({ appliance, isEditable, onEditPress }) => {
  return (
    <View  className="m-4 ">
      <Text style={styles.text}>Name: {appliance.name}</Text>
      <Text style={styles.text}>Type: {appliance.type}</Text>
      <Text style={styles.text}>Icon: {appliance.icon}</Text>
      <Text style={styles.text}>Description: {appliance.description}</Text>
      <Text style={styles.text}>Protocol: {appliance.protocol}</Text>
      <Text style={styles.text}>URL: {appliance.url}</Text>
      <Text style={styles.text}>Detail: {appliance.detail}</Text>
      <Text style={styles.text}>Flow: {appliance.flow}</Text>
      {isEditable && (
        <TouchableOpacity onPress={onEditPress}>
            <Text>Edit</Text>
          <AntDesign name="edit" size={24} color={"black"} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color:"#fff",
    padding: 5,
  },

});

export default ApplianceDetails;
