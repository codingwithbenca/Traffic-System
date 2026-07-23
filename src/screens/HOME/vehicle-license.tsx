import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VehicleLicenseScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>Traffic Connect System</Text>
        <Text style={styles.subtitle}>Vehicle Licence Screen Assignment</Text>

        <Text style={styles.heading}>Objective</Text>

        <Text style={styles.paragraph}>
          Your task is to design and build the Vehicle Licence screen for the
          Traffic Connect System mobile application.
        </Text>

        <Text style={styles.paragraph}>
          This task is UI ONLY.
        </Text>

        <Text style={styles.paragraph}>
          Do NOT implement Firebase, APIs, Authentication, or backend logic.
        </Text>

        <Text style={styles.paragraph}>
          Use mock/demo data only.
        </Text>

        <Text style={styles.heading}>Screen Purpose</Text>

        <Text style={styles.paragraph}>
          The Vehicle Licence screen should display a user's licensed vehicle
          information in a clean, modern government-style interface.
        </Text>

        <Text style={styles.paragraph}>
          This is NOT a driver's licence. It should represent the information
          found on a South African vehicle licence.
        </Text>

        <Text style={styles.heading}>Header</Text>

        <Text style={styles.list}>• Back Button</Text>
        <Text style={styles.list}>• Title: Vehicle Licence</Text>

        <Text style={styles.heading}>Vehicle Licence Card</Text>

        <Text style={styles.paragraph}>
          Design a large vehicle information card displaying:
        </Text>

        <Text style={styles.list}>• Vehicle Image or Car Icon</Text>
        <Text style={styles.list}>• Registration Number</Text>
        <Text style={styles.list}>• Vehicle Make</Text>
        <Text style={styles.list}>• Vehicle Model</Text>
        <Text style={styles.list}>• Vehicle Year</Text>
        <Text style={styles.list}>• Vehicle Colour</Text>
        <Text style={styles.list}>• Licence Status (Valid / Expired)</Text>

        <Text style={styles.heading}>Vehicle Information</Text>

        <Text style={styles.list}>• Owner Name</Text>
        <Text style={styles.list}>• VIN Number</Text>
        <Text style={styles.list}>• Engine Number</Text>
        <Text style={styles.list}>• Licence Disc Number</Text>
        <Text style={styles.list}>• Expiry Date</Text>
        <Text style={styles.list}>• Roadworthy Status</Text>

        <Text style={styles.heading}>QR Code Section</Text>

        <Text style={styles.paragraph}>
          Add a placeholder card for a future QR Code.
        </Text>

        <Text style={styles.paragraph}>
          Include a short description explaining that the QR Code will later be
          used for vehicle licence verification.
        </Text>

        <Text style={styles.heading}>Action Buttons</Text>

        <Text style={styles.list}>• Download Vehicle Licence</Text>
        <Text style={styles.list}>• Renew Vehicle Licence</Text>
        <Text style={styles.list}>• Share Vehicle Details</Text>

        <Text style={styles.paragraph}>
          Buttons do not need to work yet.
        </Text>

        <Text style={styles.heading}>Navigation</Text>

        <Text style={styles.paragraph}>
          Pressing "Renew Vehicle Licence" should navigate to the Appointments
          screen using placeholder navigation.
        </Text>

        <Text style={styles.heading}>Loading State</Text>

        <Text style={styles.paragraph}>
          Include a loading screen using an ActivityIndicator or Skeleton
          Loader.
        </Text>

        <Text style={styles.heading}>Empty State</Text>

        <Text style={styles.paragraph}>
          If no vehicle is registered, display:
        </Text>

        <Text style={styles.list}>• Vehicle illustration or icon</Text>
        <Text style={styles.list}>• "No Vehicle Licence Found"</Text>
        <Text style={styles.list}>
          • "Your vehicle information will appear here once available."
        </Text>

        <Text style={styles.heading}>Mock Data</Text>

        <Text style={styles.paragraph}>
          Build the UI using local demo data such as:
        </Text>

        <Text style={styles.list}>Registration: ABC123GP</Text>
        <Text style={styles.list}>Make: Toyota</Text>
        <Text style={styles.list}>Model: Corolla</Text>
        <Text style={styles.list}>Year: 2022</Text>
        <Text style={styles.list}>Colour: White</Text>
        <Text style={styles.list}>Owner: John Smith</Text>
        <Text style={styles.list}>VIN: AHTBE22G500123456</Text>
        <Text style={styles.list}>Engine: 1ZR1234567</Text>
        <Text style={styles.list}>Status: Valid</Text>

        <Text style={styles.heading}>Firebase</Text>

        <Text style={styles.paragraph}>
          Do NOT connect Firebase.
        </Text>

        <Text style={styles.paragraph}>
          Leave placeholder comments where Firebase functionality will later be
          added.
        </Text>

        <Text style={styles.code}>
{`// TODO: Fetch vehicle licence from Firebase

// TODO: Fetch vehicle information

// TODO: Generate QR Code

// TODO: Download vehicle licence

// TODO: Renew vehicle licence

// TODO: Share vehicle information`}
        </Text>

        <Text style={styles.heading}>Expected Result</Text>

        <Text style={styles.paragraph}>
          Build a clean, professional, government-style Vehicle Licence screen
          using modern cards, proper spacing, reusable components, mock data,
          loading state, empty state, placeholder navigation, and clear Firebase
          TODO comments.
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