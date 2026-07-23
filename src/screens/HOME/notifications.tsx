import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>
          Traffic Connect System
        </Text>

        <Text style={styles.subtitle}>
          Notifications Screen Assignment
        </Text>

        <Text style={styles.heading}>Objective</Text>

        <Text style={styles.paragraph}>
          Your task is to build the Notifications Screen UI for the Traffic
          Connect System mobile application.
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
          The Notifications screen should display important updates received by
          the user.
        </Text>

        <Text style={styles.paragraph}>
          Examples include:
        </Text>

        <Text style={styles.list}>• Appointment Confirmed</Text>
        <Text style={styles.list}>• Appointment Cancelled</Text>
        <Text style={styles.list}>• Driver Licence Reminder</Text>
        <Text style={styles.list}>• Vehicle Licence Reminder</Text>
        <Text style={styles.list}>• Traffic Fine Issued</Text>
        <Text style={styles.list}>• Fine Payment Successful</Text>
        <Text style={styles.list}>• Licence Renewal Approved</Text>
        <Text style={styles.list}>• General System Announcement</Text>

        <Text style={styles.heading}>Header</Text>

        <Text style={styles.list}>• Back Button</Text>
        <Text style={styles.list}>• Title: Notifications</Text>
        <Text style={styles.list}>• Bell icon or More Options icon</Text>

        <Text style={styles.heading}>Notification Cards</Text>

        <Text style={styles.paragraph}>
          Every notification should appear inside a rounded card.
        </Text>

        <Text style={styles.paragraph}>
          Each card must contain:
        </Text>

        <Text style={styles.list}>• Notification Icon</Text>
        <Text style={styles.list}>• Title</Text>
        <Text style={styles.list}>• Description</Text>
        <Text style={styles.list}>• Time</Text>
        <Text style={styles.list}>• Read / Unread Indicator</Text>

        <Text style={styles.heading}>Notification Icons</Text>

        <Text style={styles.list}>Appointment → Calendar</Text>
        <Text style={styles.list}>Traffic Fine → Warning</Text>
        <Text style={styles.list}>Driver Licence → Card</Text>
        <Text style={styles.list}>Vehicle Licence → Car</Text>
        <Text style={styles.list}>Payment → Wallet</Text>
        <Text style={styles.list}>Announcement → Megaphone</Text>

        <Text style={styles.heading}>Read & Unread Design</Text>

        <Text style={styles.list}>
          Unread notifications should have:
        </Text>

        <Text style={styles.list}>• Light blue background</Text>
        <Text style={styles.list}>• Blue indicator dot</Text>
        <Text style={styles.list}>• Bold title</Text>

        <Text style={styles.paragraph}>
          Read notifications should have:
        </Text>

        <Text style={styles.list}>• White background</Text>
        <Text style={styles.list}>• No blue dot</Text>
        <Text style={styles.list}>• Normal title</Text>

        <Text style={styles.heading}>Demo Data</Text>

        <Text style={styles.paragraph}>
          Create at least ten sample notifications using local mock data.
        </Text>

        <Text style={styles.heading}>Buttons</Text>

        <Text style={styles.list}>• Mark All as Read</Text>
        <Text style={styles.list}>• Optional: Clear All</Text>
        <Text style={styles.list}>• Optional: Delete Notification</Text>

        <Text style={styles.heading}>Loading State</Text>

        <Text style={styles.paragraph}>
          Show an ActivityIndicator or Skeleton Loader while notifications are
          loading.
        </Text>

        <Text style={styles.heading}>Empty State</Text>

        <Text style={styles.paragraph}>
          If there are no notifications, display:
        </Text>

        <Text style={styles.list}>• Bell Illustration</Text>
        <Text style={styles.list}>• "No Notifications Yet"</Text>
        <Text style={styles.list}>
          • "You'll receive important updates here."
        </Text>

        <Text style={styles.heading}>Navigation</Text>

        <Text style={styles.paragraph}>
          Pressing a notification should navigate to the related screen.
        </Text>

        <Text style={styles.list}>
          Appointment → Appointments Screen
        </Text>

        <Text style={styles.list}>
          Traffic Fine → Traffic Fines Screen
        </Text>

        <Text style={styles.list}>
          Driver Licence → Driver Licence Screen
        </Text>

        <Text style={styles.list}>
          Vehicle Licence → Vehicle Licence Screen
        </Text>

        <Text style={styles.heading}>Firebase</Text>

        <Text style={styles.paragraph}>
          Do NOT connect Firebase.
        </Text>

        <Text style={styles.paragraph}>
          Leave placeholder comments where Firebase will later be integrated.
        </Text>

        <Text style={styles.code}>
{`// TODO: Fetch notifications from Firebase

// TODO: Listen for real-time updates

// TODO: Mark notification as read

// TODO: Delete notification

// TODO: Save notification status`}
        </Text>

        <Text style={styles.heading}>Expected Result</Text>

        <Text style={styles.paragraph}>
          Build a modern, professional, government-style Notifications screen
          with clean spacing, rounded cards, scrollable content, proper icons,
          loading state, empty state, mock data, and reusable components.
        </Text>

        <Text style={styles.paragraph}>
          The code should be clean, reusable, well-organized, and ready for
          future Firebase integration.
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