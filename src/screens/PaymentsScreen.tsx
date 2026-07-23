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

export default function PaymentsScreen() {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Payments</Text>
        <Text style={styles.subtitle}>
          Manage all traffic-related payments
        </Text>
      </View>

      {/* FINES */}
      <Section title="Fines & Penalties">
        <PaymentItem
          icon="speed"
          title="Speed Camera Tickets"
          screen="SpeedCameraTickets"
        />

        <PaymentItem
          icon="warning"
          title="Outstanding Penalties"
          screen="OutstandingPenalties"
        />

        <PaymentItem
          icon="receipt-long"
          title="Fines Overview"
          screen="FinesOverview"
        />
      </Section>

      {/* VEHICLE PAYMENTS */}
      <Section title="Vehicle Payments">
        <PaymentItem
          icon="directions-car"
          title="Vehicle Payments"
          screen="VehiclePayments"
        />

        <PaymentItem
          icon="credit-card"
          title="Vehicle Registration Fees"
          screen="VehicleRegistrationFees"
        />

        <PaymentItem
          icon="confirmation-number"
          title="License Disk Payments"
          screen="LicenseDiskPayments"
        />
      </Section>

      {/* PAYMENT METHODS */}
      <Section title="Payment Methods">
        <PaymentItem
          icon="credit-card"
          title="Card Payments"
          screen="CardPayments"
        />

        <PaymentItem
          icon="account-balance"
          title="Instant EFT"
          screen="InstantEFT"
        />

        <PaymentItem
          icon="smartphone"
          title="Mobile Payments"
          screen="MobilePayments"
        />
      </Section>

      {/* HISTORY */}
      <Section title="Payment History">
        <PaymentItem
          icon="history"
          title="Payment History"
          screen="PaymentHistory"
        />

        <PaymentItem
          icon="download"
          title="Download Receipts"
          screen="DownloadReceipts"
        />

        <PaymentItem
          icon="email"
          title="Email Receipts"
          screen="EmailReceipts"
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

/* ================= PAYMENT ITEM ================= */

function PaymentItem({
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

      <Text style={styles.itemText}>
        {title}
      </Text>

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