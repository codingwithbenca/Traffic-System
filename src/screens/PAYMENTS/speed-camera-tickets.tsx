import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SpeedCameraTicketsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Speed Camera Tickets</Text>
      <Text style={styles.subtitle}>
        View and pay your speed camera fines.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F4F6F8",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});