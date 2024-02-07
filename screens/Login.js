import { View, Text, Image, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import FloatingLabelInput from "../components/FloatingLabelInput";
import db from "../Database/DataBase";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = () => {
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

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        [email, password],
        (_, { rows }) => {
          const user = rows._array[0];
          if (user) {
            navigation.navigate("DashBoard");
          } else {
            setEmailError("Invalid email or password");
          }
        },
        (_, error) => {
          console.error("Error checking user data", error);
        }
      );
    });
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
            style={{ height: 290, width: 310 }}
          />
        </View>

        <View
          className="h-full my-11 rounded-t-lg items-center"
          style={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}
        >
          <Text className="text-2xl font-bold my-4">Sign in</Text>
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
            className="bg-[#50DA8E] w-80 my-8 rounded-lg p-3 items-center shadow-lg shadow-[#61319F]"
            onPress={handleLogin}
          >
            <Text className="text-[#fff] font-bold text-base">Login</Text>
          </TouchableOpacity>

          <View className="flex-row ">
            <Text>Don't have an account?</Text>
            <TouchableOpacity
              className="mx-1"
              onPress={() => navigation.navigate("Signup")}
            >
              <Text className="text-[#50DA8E]">Sign up</Text>
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
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: -5,
  },
});
export default Login;
