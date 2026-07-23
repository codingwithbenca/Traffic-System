import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function LicenseDiskPaymentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>License Disk Payments</Text>

      <Text style={styles.subtitle}>
        Renew and pay for your vehicle license disk.
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