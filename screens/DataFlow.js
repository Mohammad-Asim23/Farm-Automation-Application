import { View, Text, TouchableOpacity, Dimensions,  } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import db from "../Database/DataBase";
import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";

import React from "react";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const DataFlow = ({ route, navigation }) => {
  const appliance = route.params.appliance;
  const [data, setData] = useState([]);
  const [selectedInterval, setSelectedInterval] = useState("daily");

  const fetchData = (interval) => {
    let query;

    switch (interval) {
      case "daily":
        query = `SELECT status, strftime('%H', timestamp) AS hour FROM appliance_records WHERE appliance_id = ? GROUP BY hour ORDER BY timestamp DESC LIMIT 24`;
        break;
      case "weekly":
        query = `SELECT status, strftime('%w', timestamp) AS dayOfWeek FROM appliance_records WHERE appliance_id = ? GROUP BY dayOfWeek ORDER BY timestamp DESC LIMIT 7`;
        break;
      case "monthly":
        query = `SELECT status, strftime('%m', timestamp) AS month FROM appliance_records WHERE appliance_id = ? GROUP BY month ORDER BY timestamp DESC LIMIT 12`;
        break;
      default:
        query = `SELECT status, timestamp FROM appliance_records WHERE appliance_id = ? ORDER BY timestamp DESC LIMIT 6`;
    }

    db.transaction((tx) => {
      tx.executeSql(
        query,
        [appliance.id],
        (_, { rows }) => {
        let chartData = rows._array.map((row) => {
          const rawTimestamp = row.timestamp;

          return {
            label: isValidDate(new Date(rawTimestamp))
              ? new Date(rawTimestamp).toLocaleString("en-US", {
                  hour12: false,
                  hour: "numeric",
                  minute: "numeric",
                  month: "numeric",
                  day: "numeric",
                  year: "numeric",
                })
              : "Invalid Date",
            value: row.status === "on" ? 1 : 0,
          };
        });
          setData(chartData);
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
    });
  };

  const isValidDate = (date) => {
    return !isNaN(date.getTime());
  };

  useEffect(() => {
    fetchData(selectedInterval);
  }, [selectedInterval]);

  const generateLabels = () => {
    let labels = [];
    if (selectedInterval === "daily") {
      for (let i = 0; i < 24; i+=4) {
        labels.push(`${i}:00`); 
      }
    } else if (selectedInterval === "weekly") {
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      labels = daysOfWeek;
    } else if (selectedInterval === "monthly") {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      labels = months;
    }
    return labels;
  };
  

  const isChartDataValid = (data) => {
    return (
      data &&
      data.length > 0 &&
      data.every((d) => d.label && (d.value === 0 || d.value === 1))
            );
  };

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#C463DA", "#7E51D1"]}>
      <View className="flex-row mt-3">
        <TouchableOpacity
          className="mx-1 my-4 w-12 h-12 items-center justify-center rounded-lg opacity-100"
          style={{ backgroundColor: "#B85CCC" }}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="left" size={24} color={"white"} />
        </TouchableOpacity>
        <View className="mt-5">
          <Text className="text-2xl }" style={{ color: "#fff" }}>
            {" "}
            DataFlow
          </Text>
        </View>
      </View>
      <View style={{flexDirection:"row",  alignItems: "center", justifyContent:"space-between" }}>
        <Text style={{ color: "#fff", fontSize: 25, fontWeight: "bold" }}>
          {" "}
          {appliance.name}
        </Text>
        <View style={{backgroundColor: "#943AE7", borderRadius:5, marginHorizontal:8}}>
          <Picker
            selectedValue={selectedInterval}
            style={{ width: 150, color: "white", alignSelf: "center" }}
            onValueChange={(itemValue) => {
              setSelectedInterval(itemValue);
            }}
          >
            <Picker.Item label="Daily" value="daily" />
            <Picker.Item label="Weekly" value="weekly" />
            <Picker.Item label="Monthly" value="monthly" />
          </Picker>
        </View>
      </View>

      {isChartDataValid(data) && (
        console.log(data),
        <LineChart
          data={{
            labels: generateLabels(),
            datasets: [{ data: data.map((d) => d.value) }],
            }}
          width={screenWidth * 1.5}
          height={screenHeight / 2.2}
          yAxisLabel=""
          yAxisSuffix=""
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
           
          }}
          
          style={{
            margin: 30,
            borderRadius: 16,
            transform: [{ rotate: "90deg" }], 
          }}
         
        
        />
      )}
    </LinearGradient>
  );
};

export default DataFlow;
