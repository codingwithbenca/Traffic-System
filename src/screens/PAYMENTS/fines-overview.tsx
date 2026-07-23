import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function FinesOverviewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fines Overview</Text>

      <Text style={styles.subtitle}>
        Review all your traffic fines and payment status.
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