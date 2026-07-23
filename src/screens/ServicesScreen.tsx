import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ServicesScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Services</Text>
        <Text style={styles.subtitle}>
          All traffic department services in one place
        </Text>
      </View>

      {/* APPOINTMENTS */}
      <Section title="Appointments">
        <ServiceItem
          icon="calendar-month"
          title="Appointment Booking"
          screen="Appointments"
        />

        <ServiceItem
          icon="schedule"
          title="Available Slots"
          screen="AvailableSlots"
        />

        <ServiceItem
          icon="access-time"
          title="Available Times"
          screen="AvailableTimes"
        />

        <ServiceItem
          icon="location-on"
          title="Available Branches"
          screen="AvailableBranches"
        />

        <ServiceItem
          icon="map"
          title="Branch Locations"
          screen="BranchLocations"
        />
      </Section>

      {/* LICENSE SERVICES */}
      <Section title="License Services">
        <ServiceItem
          icon="badge"
          title="Driver's License Renewal"
          screen="RenewDriverLicense"
        />

        <ServiceItem
          icon="school"
          title="Learner's License Test"
          screen="LearnersTest"
        />

        <ServiceItem
          icon="drive-eta"
          title="Driver's Test"
          screen="DriversTest"
        />

        <ServiceItem
          icon="add-card"
          title="New License Application"
          screen="NewLicenseApplication"
        />
      </Section>

      {/* VEHICLE SERVICES */}
      <Section title="Vehicle Services">
        <ServiceItem
          icon="directions-car"
          title="Vehicle Registration"
          screen="VehicleRegistration"
        />

        <ServiceItem
          icon="swap-horiz"
          title="Change of Ownership"
          screen="ChangeOwnership"
        />

        <ServiceItem
          icon="transfer-within-a-station"
          title="Ownership Transfer"
          screen="OwnershipTransfer"
        />
      </Section>

      {/* DOCUMENT UPLOADS */}
      <Section title="Document Uploads">
        <ServiceItem
          icon="upload-file"
          title="Upload ID"
          screen="UploadID"
        />

        <ServiceItem
          icon="upload"
          title="Upload Proof of Address"
          screen="UploadProofAddress"
        />

        <ServiceItem
          icon="description"
          title="Upload Supporting Documents"
          screen="UploadDocuments"
        />
      </Section>

      {/* APPLICATIONS */}
      <Section title="Applications">
        <ServiceItem
          icon="assignment"
          title="Applications Dashboard"
          screen="ApplicationsDashboard"
        />

        <ServiceItem
          icon="card-membership"
          title="New License Application"
          screen="NewLicenseApplication"
        />

        <ServiceItem
          icon="directions-car"
          title="Vehicle Registration"
          screen="VehicleRegistration"
        />

        <ServiceItem
          icon="swap-horiz"
          title="Ownership Transfer"
          screen="OwnershipTransfer"
        />
      </Section>
    </ScrollView>
  );
}

/* ================= SECTION ================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

/* ================= SERVICE ITEM ================= */

function ServiceItem({
  icon,
  title,
  screen,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  screen: string;
}) {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate(screen)}
    >
      <MaterialIcons
        name={icon}
        size={24}
        color="#003366"
      />

      <Text style={styles.itemText}>{title}</Text>

      <Ionicons
        name="chevron-forward"
        size={18}
        color="#999"
      />
    </TouchableOpacity>
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

  item: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  itemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },
});