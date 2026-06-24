import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function MyLicensesScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>My Licenses</Text>
        <Text style={styles.subtitle}>
          Everything related to your driving & vehicle licenses
        </Text>
      </View>

      {/* DRIVER LICENSE */}
      <Section title="Driver's License">

        <Card label="License Number" value="DL-784-992-PTA" />
        <Card label="Expiry Date" value="12 Mar 2030" />
        <Card label="Status" value="Valid" status="good" />

        <ActionButton title="Digital Driver's License" icon="card" />
        <ActionButton title="QR Code" icon="qr-code" />
        <ActionButton title="NFC Verification" icon="radio" />

        <ActionButton title="Renew Driver's License" icon="refresh" />
      </Section>

      {/* VEHICLE LICENSES */}
      <Section title="Vehicle Licenses">

        <Card label="Vehicle List" value="2 Vehicles Registered" />
        <Card label="License Disk Expiry" value="Expires in 30 days" />
        <Card label="Ownership" value="Verified Owner" status="good" />

        <ActionButton title="View Vehicle Information" icon="car" />
        <ActionButton title="Renew Vehicle License" icon="refresh" />
      </Section>

      {/* COLLECTION STATUS */}
      <Section title="Collection Status">

        <StatusItem title="Card Production Status" value="In Production" />
        <StatusItem title="Ready for Collection" value="Not Ready" />
        <StatusItem title="Collection Location" value="Pretoria DLTC" />
      </Section>

    </ScrollView>
  );
}

/* ================= SECTION WRAPPER ================= */
function Section({ title, children }: any) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

/* ================= SIMPLE INFO CARD ================= */
function Card({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status?: "good" | "warning" | "bad";
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text
        style={[
          styles.cardValue,
          status === "good" && { color: "green" },
          status === "warning" && { color: "#E65100" },
          status === "bad" && { color: "red" },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

/* ================= ACTION BUTTON ================= */
function ActionButton({
  title,
  icon,
}: {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}) {
  return (
    <TouchableOpacity style={styles.action}>
      <MaterialIcons name={icon} size={24} color="#003366" />
      <Text style={styles.actionText}>{title}</Text>
      <Ionicons name="chevron-forward" size={18} color="#999" />
    </TouchableOpacity>
  );
}

/* ================= STATUS ITEM ================= */
function StatusItem({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <View style={styles.statusItem}>
      <Text style={styles.statusTitle}>{title}</Text>
      <Text style={styles.statusValue}>{value}</Text>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    padding: 16,
  },

  header: {
    marginTop: 20,
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#003366",
  },

  subtitle: {
    color: "#666",
    marginTop: 4,
  },

  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },

  cardLabel: {
    color: "#666",
    fontSize: 13,
  },

  cardValue: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },

  action: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  actionText: {
    flex: 1,
    marginLeft: 10,
    fontWeight: "600",
    color: "#222",
  },

  statusItem: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },

  statusTitle: {
    color: "#666",
    fontSize: 13,
  },

  statusValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#003366",
    marginTop: 4,
  },
});