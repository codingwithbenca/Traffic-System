import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FinesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>Traffic Connect System</Text>
        <Text style={styles.subtitle}>Traffic Fines Screen Assignment</Text>

        <Text style={styles.heading}>Objective</Text>

        <Text style={styles.paragraph}>
          Your task is to build the Traffic Fines screen UI for the Traffic
          Connect System mobile application.
        </Text>

        <Text style={styles.paragraph}>
          This task is UI ONLY.
        </Text>

        <Text style={styles.paragraph}>
          Do NOT implement Firebase, payment gateways, APIs, or backend logic.
        </Text>

        <Text style={styles.paragraph}>
          Use mock/demo data only.
        </Text>

        <Text style={styles.heading}>Screen Purpose</Text>

        <Text style={styles.paragraph}>
          This screen allows users to view all of their traffic fines, check
          their outstanding balance, see payment status, and prepare for future
          online fine payments.
        </Text>

        <Text style={styles.heading}>Summary Card</Text>

        <Text style={styles.paragraph}>
          At the top of the screen, create a large summary card displaying:
        </Text>

        <Text style={styles.list}>• Outstanding Balance</Text>
        <Text style={styles.list}>• Total Amount (Example: R750)</Text>
        <Text style={styles.list}>• Number of Unpaid Fines (Example: 2)</Text>
        <Text style={styles.list}>• "Pay Now" Button (UI only)</Text>

        <Text style={styles.heading}>Filter Options</Text>

        <Text style={styles.paragraph}>
          Add filter chips or tabs such as:
        </Text>

        <Text style={styles.list}>• All</Text>
        <Text style={styles.list}>• Outstanding</Text>
        <Text style={styles.list}>• Paid</Text>
        <Text style={styles.list}>• Disputed (Optional)</Text>

        <Text style={styles.heading}>Fine Cards</Text>

        <Text style={styles.paragraph}>
          Display every traffic fine inside a modern card.
        </Text>

        <Text style={styles.paragraph}>
          Each card should contain:
        </Text>

        <Text style={styles.list}>• Fine Type (e.g. Speeding)</Text>
        <Text style={styles.list}>• Fine Reference Number</Text>
        <Text style={styles.list}>• Date Issued</Text>
        <Text style={styles.list}>• Location</Text>
        <Text style={styles.list}>• Fine Amount</Text>
        <Text style={styles.list}>• Status (Paid / Unpaid)</Text>
        <Text style={styles.list}>• "View Details" Button</Text>

        <Text style={styles.heading}>Fine Details Screen</Text>

        <Text style={styles.paragraph}>
          When a user taps a fine, navigate to a placeholder Fine Details screen.
        </Text>

        <Text style={styles.paragraph}>
          The Fine Details page should eventually display:
        </Text>

        <Text style={styles.list}>• Fine Reference Number</Text>
        <Text style={styles.list}>• Violation Type</Text>
        <Text style={styles.list}>• Speed Recorded (if applicable)</Text>
        <Text style={styles.list}>• Speed Limit</Text>
        <Text style={styles.list}>• Officer Name</Text>
        <Text style={styles.list}>• Date & Time</Text>
        <Text style={styles.list}>• Location</Text>
        <Text style={styles.list}>• Amount</Text>
        <Text style={styles.list}>• Status</Text>

        <Text style={styles.heading}>Action Buttons</Text>

        <Text style={styles.list}>• Pay Fine</Text>
        <Text style={styles.list}>• Download Fine Notice</Text>
        <Text style={styles.list}>• Dispute Fine (Optional)</Text>

        <Text style={styles.paragraph}>
          These buttons are UI only and should not perform any actions yet.
        </Text>

        <Text style={styles.heading}>Loading State</Text>

        <Text style={styles.paragraph}>
          Include an ActivityIndicator or Skeleton Loader while data is loading.
        </Text>

        <Text style={styles.heading}>Empty State</Text>

        <Text style={styles.paragraph}>
          If the user has no fines, display:
        </Text>

        <Text style={styles.list}>• Traffic Fine Illustration</Text>
        <Text style={styles.list}>• "No Traffic Fines"</Text>
        <Text style={styles.list}>
          • "You currently have no outstanding traffic fines."
        </Text>

        <Text style={styles.heading}>Mock Data</Text>

        <Text style={styles.paragraph}>
          Build the UI using local demo data such as:
        </Text>

        <Text style={styles.list}>Outstanding Balance: R750</Text>
        <Text style={styles.list}>Outstanding Fines: 2</Text>
        <Text style={styles.list}>Reference: TF20260001</Text>
        <Text style={styles.list}>Violation: Speeding</Text>
        <Text style={styles.list}>Location: Pretoria CBD</Text>
        <Text style={styles.list}>Amount: R500</Text>
        <Text style={styles.list}>Status: Unpaid</Text>

        <Text style={styles.heading}>Firebase</Text>

        <Text style={styles.paragraph}>
          Do NOT connect Firebase.
        </Text>

        <Text style={styles.paragraph}>
          Leave placeholder comments where Firebase functionality will later be
          implemented.
        </Text>

        <Text style={styles.code}>
{`// TODO: Fetch traffic fines from Firebase

// TODO: Fetch outstanding balance

// TODO: Pay fine

// TODO: Download fine notice

// TODO: Dispute fine

// TODO: Listen for real-time updates`}
        </Text>

        <Text style={styles.heading}>Expected Result</Text>

        <Text style={styles.paragraph}>
          Build a clean, professional government-style Traffic Fines screen
          featuring an Outstanding Balance summary card, filter options,
          reusable fine cards, loading state, empty state, mock data,
          placeholder navigation, and clearly marked Firebase TODO comments.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#003366",
    marginTop: 20,
    marginHorizontal: 20,
  },

  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 5,
    marginBottom: 25,
    marginHorizontal: 20,
    color: "#444",
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003366",
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
  },

  paragraph: {
    fontSize: 16,
    lineHeight: 26,
    color: "#555",
    marginHorizontal: 20,
    marginBottom: 10,
  },

  list: {
    fontSize: 16,
    color: "#555",
    marginLeft: 35,
    marginBottom: 6,
  },

  code: {
    margin: 20,
    backgroundColor: "#EAEAEA",
    padding: 15,
    borderRadius: 10,
    fontFamily: "monospace",
    fontSize: 14,
    color: "#333",
    marginBottom: 30,
  },
});