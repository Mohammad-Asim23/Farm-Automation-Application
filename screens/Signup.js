import {
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import FloatingLabelInput from "../components/FloatingLabelInput";
import  db  from "../Database/DataBase";


const Signup = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const handleEmailExists = (email) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM users WHERE email = ?',
          [email],
          (_, { rows }) => {
            const existingUser = rows._array[0];
            if (existingUser) {
              // Email already exists
              resolve(true);
            } else {
              // Email doesn't exist
              resolve(false);
            }
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };


  const handleSignup = async () => {
    if (username === "") {
      setUsernameError("Username is required");
      return;
    } else {
      setUsernameError("");
    }
  
    if (!email.includes("@gmail.com")) {
      setEmailError("Invalid email format");
      return;
    } else {
      setEmailError("");
    }
  
    if (password.length < 5) {
      setPasswordError("Password must be at least 5 characters");
      return;
    } else {
      setPasswordError("");
    }
  
    // Check if the email already exists
    const emailExists = await handleEmailExists(email);
  
    if (emailExists) {
      setEmailError("Email already exists");
      return;
    } else {
      setEmailError("");
    }
  
    // If email and password are valid, you can proceed with signup logic
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            // User data inserted successfully
            console.log('User data inserted successfully');
          } else {
            // Error occurred
            console.error('Error inserting user data');
          }
        },
        (_, error) => {
          // Handle error
          console.error('Error inserting user data', error);
        }
      );
    });
  
    // If signup is successful, navigate to the dashboard
    navigation.navigate("DashBoard");
  };

  return (
    <LinearGradient
      style={{ flex: 1, height: 240 }}
      colors={["#C463DA", "#7E51D1"]}
    >
       <KeyboardAwareScrollView
      style={{ flex: 1 }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollEnabled={true}
    >
      <TouchableOpacity
        className="mx-4 my-6 w-12 h-12 items-center justify-center rounded-lg opacity-100"
        style={{ backgroundColor: "#B85CCC" }}
        onPress={() => navigation.navigate("startScreen")}
      >
        <AntDesign name="left" size={24} color={"white"} />
      </TouchableOpacity>
      <View className="flex justify-center items-center">
        <Image
          source={require("../assets/login-pic.png")}
          style={{ height: 270, width: 300 }}
        />
      </View>
      
          <View
            className="h-full rounded-t-lg items-center"
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 35,
              borderTopRightRadius: 35,
            }}
          >
            <Text className="text-2xl font-bold my-2">Signup</Text>
            <FloatingLabelInput
              label={"Username"}
              iconName={"user"}
              isPassword={false}
              value={username}
              onChangeText={(text) => setUsername(text)}
            />
            {usernameError !== "" && (
              <Text style={styles.errorText}>{usernameError}</Text>
            )}
            <FloatingLabelInput
              label={"Email"}
              iconName={"email"}
              isPassword={false}
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            {emailError !== "" && (
              <Text style={styles.errorText}>{emailError}</Text>
            )}
            <FloatingLabelInput
              label={"Password"}
              iconName={"lock"}
              isPassword={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            {passwordError !== "" && (
              <Text style={styles.errorText}>{passwordError}</Text>
            )}

            <TouchableOpacity
              className="bg-[#50DA8E] w-80 my-6 rounded-lg p-3 items-center shadow-lg shadow-[#61319F]"
              onPress={handleSignup}
            >
              <Text className="text-[#fff] font-bold text-base">Signup</Text>
            </TouchableOpacity>

            <View className="flex-row ">
              <Text>Already have an account?</Text>
              <TouchableOpacity
                className="mx-1"
                onPress={() => navigation.navigate("Login")}
              >
                <Text className="text-[#50DA8E]">Login</Text>
              </TouchableOpacity>
            </View>
          </View>

      </KeyboardAwareScrollView>

    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-end", // Adjust as needed
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: -5,
  },
});

export default Signup;
