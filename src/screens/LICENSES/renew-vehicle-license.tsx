import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function RenewVehicleLicenseScreen() {
  const { user } = useAuth();

  if (!user) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const vehicles = user.vehicles ?? [];

  async function submitRenewal(vehicle: any) {
    try {
      await setDoc(
        doc(db, "vehicleRenewalRequests", vehicle.vehicleId),
        {
          citizenId: user.idNumber,
          fullName: user.fullName,

          vehicleId: vehicle.vehicleId,
          registrationNumber: vehicle.registrationNumber,
          make: vehicle.make,
          model: vehicle.model,

          licenceDisk: vehicle.licenceDisk,

          submittedAt: new Date().toISOString(),
          status: "Pending",
        }
      );

      Alert.alert(
        "Success",
        "Vehicle licence renewal request submitted."
      );
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        "Unable to submit renewal request."
      );
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.title}>
        Renew Vehicle Licence
      </Text>

      <Text style={styles.subtitle}>
        Select a vehicle to renew its licence disk.
      </Text>

      {vehicles.length === 0 ? (
        <View style={styles.empty}>
          <MaterialIcons
            name="directions-car"
            size={60}
            color="#999"
          />

          <Text style={styles.emptyText}>
            No registered vehicles found.
          </Text>
        </View>
      ) : (
        vehicles.map((vehicle, index) => {
          const expired =
            vehicle.licenceDisk?.expiryDate &&
            new Date(vehicle.licenceDisk.expiryDate) <=
              new Date();

          return (
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
                  <Text style={styles.vehicle}>
                    {vehicle.make} {vehicle.model}
                  </Text>

                  <Text style={styles.registration}>
                    {vehicle.registrationNumber}
                  </Text>
                </View>
              </View>

              <Row
                label="Licence Disk"
                value={vehicle.licenceDisk?.number}
              />

              <Row
                label="Expiry Date"
                value={vehicle.licenceDisk?.expiryDate}
              />

              <Row
                label="Status"
                value={vehicle.licenceDisk?.status}
              />

              <View
                style={[
                  styles.status,
                  {
                    backgroundColor: expired
                      ? "#FDECEA"
                      : "#E8F5E9",
                  },
                ]}
              >
                <MaterialIcons
                  name={
                    expired ? "warning" : "verified"
                  }
                  size={24}
                  color={
                    expired ? "#D32F2F" : "#2E7D32"
                  }
                />

                <Text
                  style={{
                    color: expired
                      ? "#D32F2F"
                      : "#2E7D32",
                    marginLeft: 10,
                    fontWeight: "700",
                  }}
                >
                  {expired
                    ? "Licence Disk Expired"
                    : "Licence Disk Valid"}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  submitRenewal(vehicle)
                }
              >
                <MaterialIcons
                  name="refresh"
                  size={22}
                  color="#fff"
                />

                <Text style={styles.buttonText}>
                  Renew Licence Disk
                </Text>
              </TouchableOpacity>
            </View>
          );
        })
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
      <Text style={styles.label}>{label}</Text>

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

  empty: {
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 15,
    alignItems: "center",
  },

  emptyText: {
    marginTop: 15,
    color: "#666",
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  vehicle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003366",
  },

  registration: {
    color: "#666",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },

  label: {
    color: "#666",
    fontWeight: "600",
  },

  value: {
    fontWeight: "700",
  },

  status: {
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#003366",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },
});