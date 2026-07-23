import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function VehicleRegistrationFeesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vehicle Registration Fees</Text>

      <Text style={styles.subtitle}>
        Pay registration fees for your registered vehicles.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F6F8",
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 10,
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
  },
});