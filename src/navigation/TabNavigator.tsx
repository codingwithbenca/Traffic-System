import React from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import LicensesScreen from "../screens/LicensesScreen";
import ServicesScreen from "../screens/ServicesScreen";
import PaymentsScreen from "../screens/PaymentsScreen";
import NewsScreen from "../screens/NewsScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,

        tabBarActiveTintColor: "#3F51B5",
        tabBarInactiveTintColor: "#999",

        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 0,
          fontWeight: "600",
        },

        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          height: 82, //increased height to accommodate the larger center button
          borderRadius: 25,
          backgroundColor: "#fff",
          paddingTop: 6,//added paddingTop to make the icons vertically centered
          paddingBottom: 8,
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 10,
          borderTopWidth: 0,
        },
      }}
    >
      {/* HOME */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              size={24}
              color={focused ? "#3F51B5" : "#999"}
            />
          ),
        }}
      />

      {/* LICENSES */}
      <Tab.Screen
        name="Licenses"
        component={LicensesScreen}
        options={{
          tabBarLabel: "Licenses",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="card"
              size={24}
              color={focused ? "#3F51B5" : "#999"}
            />
          ),
        }}
      />

      {/* SERVICES */}
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          tabBarLabel: "Services",

          tabBarIcon: () => (
            <View style={styles.centerButton}>
              <Ionicons
                name="apps"
                size={30}
                color="#fff"
              />
            </View>
          ),
        }}
      />

      {/* PAYMENTS */}
      <Tab.Screen
        name="Payments"
        component={PaymentsScreen}
        options={{
          tabBarLabel: "Payments",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="wallet"
              size={24}
              color={focused ? "#3F51B5" : "#999"}
            />
          ),
        }}
      />

      {/* UPDATES */}
      <Tab.Screen
        name="Updates"
        component={NewsScreen}
        options={{
          tabBarLabel: "Updates",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="newspaper"
              size={24}
              color={focused ? "#3F51B5" : "#999"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  centerButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#3F51B5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,

    shadowColor: "#3F51B5",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
