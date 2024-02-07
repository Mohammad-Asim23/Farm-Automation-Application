import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import EditApplianceDetails from "../components/EditApplianceDetails";
import ApplianceDetails from "../components/ApplianceDetails";

const Details = ({ route, navigation }) => {
  const { appliance } = route.params;

  const [isEditable, setIsEditable] = useState(false);
  const [editedAppliance, setEditedAppliance] = useState(appliance);

  console.log("Appliance:", appliance.status, appliance.timestamp);

  const handleEditPress = () => {
    setIsEditable(true);
  };

  const handleCancelPress = () => {
    setIsEditable(false);
  };

  const handleSave = (editedData) => {
    // Save the edited appliance data here
    setEditedAppliance(editedData);

    setIsEditable(false);
  };

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#C463DA", "#7E51D1"]}>
      <View className="flex-row mt-4 items-center ">
        <TouchableOpacity
          className="mx-1 my-2 w-12 h-12 items-center justify-center rounded-lg opacity-100"
          style={{ backgroundColor: "#B85CCC" }}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="left" size={24} color={"white"} />
        </TouchableOpacity>
        <Text className="text-2xl " style={{ color: "#fff" }}>
          {" "}
          Details{" "}
        </Text>
      </View>
      {!isEditable && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 30,
            right: 10,
            zIndex: 1,
            backgroundColor: "#9609F3",
            borderRadius: 5,
            padding: 10,
            width: 60,
            justifyContent:"center",
            alignItems:"center",
          }}
          onPress={handleEditPress}
        >
          <Text style={{ color: "white", fontSize:16 }}>Edit</Text>
        </TouchableOpacity>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isEditable ? (
          <EditApplianceDetails
            appliance={editedAppliance}
            onSave={handleSave}
            onCancel={handleCancelPress}

          />
        ) : (
          <View>
            <ApplianceDetails
              appliance={editedAppliance}
              isEditable={isEditable}
              onEditPress={handleEditPress}
            />
            <TouchableOpacity
              className="mx-4 w-32 p-2 justify-center items-center left-28"
              style={{ backgroundColor: "#E14894", borderRadius: 6 }}
              onPress={() => navigation.navigate("DataFlow", { appliance: editedAppliance })}
              >
              <Text className="p-2 " style={{ color: "white", fontSize: 16 }}>
                Show Record
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    margin: 10,
  },
  scrollContent: {
    flexGrow: 1,
    // justifyContent: 'flex-end', // Adjust as needed
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

export default Details;
