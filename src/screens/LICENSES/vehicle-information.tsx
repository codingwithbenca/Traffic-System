import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";

export default function VehicleInformationScreen() {
  const { user } = useAuth();

  if (!user) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const vehicles = user.vehicles ?? [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.title}>
        Vehicle Information
      </Text>

      <Text style={styles.subtitle}>
        View all vehicles registered under your profile.
      </Text>

      {vehicles.length === 0 ? (
        <View style={styles.emptyCard}>
          <MaterialIcons
            name="directions-car"
            size={60}
            color="#999"
          />

          <Text style={styles.emptyText}>
            No vehicles found.
          </Text>
        </View>
      ) : (
        vehicles.map((vehicle, index) => (
          <View
            key={vehicle.vehicleId || index}
            style={styles.card}
          >
            <View style={styles.header}>
              <MaterialIcons
                name="directions-car"
                size={35}
                color="#003366"
              />

              <View style={{ marginLeft: 12 }}>
                <Text style={styles.vehicleName}>
                  {vehicle.make} {vehicle.model}
                </Text>

                <Text style={styles.reg}>
                  {vehicle.registrationNumber}
                </Text>
              </View>
            </View>

            <Row
              label="Vehicle ID"
              value={vehicle.vehicleId}
            />

            <Row
              label="Year"
              value={String(vehicle.year)}
            />

            <Row
              label="Colour"
              value={vehicle.colour}
            />

            <Row
              label="VIN"
              value={vehicle.vin}
            />

            <Row
              label="Engine Number"
              value={vehicle.engineNumber}
            />

            <Row
              label="Licence Disk"
              value={vehicle.licenceDisk?.number}
            />

            <Row
              label="Disk Expiry"
              value={vehicle.licenceDisk?.expiryDate}
            />

            <Row
              label="Disk Status"
              value={vehicle.licenceDisk?.status}
            />

            <Row
              label="Roadworthy"
              value={
                vehicle.roadworthy
                  ? "Yes"
                  : "No"
              }
            />

            <Row
              label="Owner"
              value={
                vehicle.ownership?.owner
                  ? "Yes"
                  : "No"
              }
            />

            <Row
              label="Financed"
              value={
                vehicle.ownership?.financed
                  ? "Yes"
                  : "No"
              }
            />

            <Row
              label="Reported Stolen"
              value={
                vehicle.stolen
                  ? "Yes"
                  : "No"
              }
            />
          </View>
        ))
      )}
    </ScrollView>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value || "-"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#003366",
  },

  subtitle: {
    color: "#666",
    marginTop: 5,
    marginBottom: 20,
  },

  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 40,
    alignItems: "center",
  },

  emptyText: {
    marginTop: 15,
    color: "#666",
    fontSize: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 18,
    marginBottom: 20,
    elevation: 3,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  vehicleName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003366",
  },

  reg: {
    color: "#666",
    marginTop: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  label: {
    color: "#666",
    fontWeight: "600",
  },

  value: {
    fontWeight: "700",
    color: "#111",
  },
});