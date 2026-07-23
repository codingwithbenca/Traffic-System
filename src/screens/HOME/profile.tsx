import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>Traffic Connect System</Text>
        <Text style={styles.subtitle}>Profile Screen Assignment</Text>

        <Text style={styles.heading}>Objective</Text>

        <Text style={styles.paragraph}>
          Your task is to build the Profile Screen UI for the Traffic Connect
          System mobile application.
        </Text>

        <Text style={styles.paragraph}>
          This task is UI ONLY.
        </Text>

        <Text style={styles.paragraph}>
          Do NOT implement Firebase, APIs, Authentication, or Backend logic.
        </Text>

        <Text style={styles.paragraph}>
          Use mock/demo data only.
        </Text>

        <Text style={styles.heading}>Screen Purpose</Text>

        <Text style={styles.paragraph}>
          The Profile screen allows users to view their personal information,
          account details, and access important account-related options.
        </Text>

        <Text style={styles.heading}>Header</Text>

        <Text style={styles.list}>• Back Button</Text>
        <Text style={styles.list}>• Title: Profile</Text>
        <Text style={styles.list}>• Optional Edit Profile icon</Text>

        <Text style={styles.heading}>Profile Section</Text>

        <Text style={styles.paragraph}>
          Display a profile card containing:
        </Text>

        <Text style={styles.list}>• Profile Picture</Text>
        <Text style={styles.list}>• Full Name</Text>
        <Text style={styles.list}>• South African ID Number</Text>
        <Text style={styles.list}>• Email Address</Text>
        <Text style={styles.list}>• Phone Number</Text>

        <Text style={styles.heading}>Information Cards</Text>

        <Text style={styles.paragraph}>
          Create modern cards or list items for:
        </Text>

        <Text style={styles.list}>• Personal Information</Text>
        <Text style={styles.list}>• Driver Licence Information</Text>
        <Text style={styles.list}>• Vehicle Information</Text>
        <Text style={styles.list}>• Saved Addresses</Text>
        <Text style={styles.list}>• Notification Settings</Text>
        <Text style={styles.list}>• Privacy & Security</Text>
        <Text style={styles.list}>• Help & Support</Text>
        <Text style={styles.list}>• About the App</Text>
        <Text style={styles.list}>• Logout</Text>

        <Text style={styles.heading}>Buttons</Text>

        <Text style={styles.list}>• Edit Profile</Text>
        <Text style={styles.list}>• Change Password (UI only)</Text>
        <Text style={styles.list}>• Logout</Text>

        <Text style={styles.heading}>Loading State</Text>

        <Text style={styles.paragraph}>
          Show an ActivityIndicator or Skeleton Loader while profile data is
          loading.
        </Text>

        <Text style={styles.heading}>Navigation</Text>

        <Text style={styles.paragraph}>
          Each menu item should navigate to its related screen using placeholder
          navigation.
        </Text>

        <Text style={styles.list}>
          Personal Information → Personal Details Screen
        </Text>

        <Text style={styles.list}>
          Driver Licence → Driver Licence Screen
        </Text>

        <Text style={styles.list}>
          Vehicle Information → Vehicle Licence Screen
        </Text>

        <Text style={styles.list}>
          Notification Settings → Notifications Screen
        </Text>

        <Text style={styles.list}>
          Help & Support → Help Screen
        </Text>

        <Text style={styles.heading}>Demo Data</Text>

        <Text style={styles.paragraph}>
          Use local mock data for the user profile.
        </Text>

        <Text style={styles.list}>• Full Name</Text>
        <Text style={styles.list}>• ID Number</Text>
        <Text style={styles.list}>• Email</Text>
        <Text style={styles.list}>• Phone Number</Text>
        <Text style={styles.list}>• Profile Picture</Text>

        <Text style={styles.heading}>Firebase</Text>

        <Text style={styles.paragraph}>
          Do NOT connect Firebase.
        </Text>

        <Text style={styles.paragraph}>
          Leave placeholder comments where Firebase will later be integrated.
        </Text>

        <Text style={styles.code}>
{`// TODO: Fetch user profile from Firebase

// TODO: Update profile information

// TODO: Upload profile picture

// TODO: Save edited profile

// TODO: Logout user`}
        </Text>

        <Text style={styles.heading}>Expected Result</Text>

        <Text style={styles.paragraph}>
          Build a clean, modern, government-style Profile screen with a profile
          card, account information, settings options, reusable components,
          placeholder navigation, loading state, and Firebase TODO comments.
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
  },
});