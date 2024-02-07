import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

const SideMenu = (props) => {


  return (

    <View style={{flex:1}}>
      <DrawerContentScrollView {...props} >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  menuItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "lightgray",
    borderRadius: 5,
  },
});

export default SideMenu;
