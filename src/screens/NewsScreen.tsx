import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function TrafficNewsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Traffic & News</Text>
        <Text style={styles.subtitle}>
          Live road updates, alerts & announcements
        </Text>
      </View>

      {/* LIVE TRAFFIC */}
      <Section title="🚦 Live Traffic">

        <NewsItem icon="traffic-light" title="Heavy Traffic on N1 North" />
        <NewsItem icon="car" title="Congestion on R21 Highway" />
        <NewsItem icon="map-marker-alert" title="High Traffic Areas Identified" />

      </Section>

      {/* INCIDENTS */}
      <Section title="⚠️ Incidents">

        <NewsItem icon="car-crash" title="Accident on Mabopane Road" />
        <NewsItem icon="road-variant" title="Construction Zone: Lynnwood Road" />
        <NewsItem icon="alert" title="Road Closure: Church Street" />

      </Section>

      {/* ROUTES */}
      <Section title="🛣️ Suggested Routes">

        <NewsItem icon="route" title="Alternative Route via N4 Recommended" />
        <NewsItem icon="map-search" title="Avoid CBD Congestion Area" />
        <NewsItem icon="clock-fast" title="Travel Time Increased by 25 min" />

      </Section>

      {/* WEATHER ALERTS */}
      <Section title="🌦️ Weather Alerts">

        <NewsItem icon="weather-rainy" title="Rain Warning in Pretoria" />
        <NewsItem icon="weather-fog" title="Fog Expected Early Morning" />
        <NewsItem icon="weather-partly-cloudy" title="Cold Front Incoming" />

      </Section>

      {/* ANNOUNCEMENTS */}
      <Section title="📢 Department Announcements">

        <NewsItem icon="bullhorn" title="New Traffic Regulations Released" />
        <NewsItem icon="cog" title="System Maintenance Tonight (22:00–02:00)" />
        <NewsItem icon="information" title="Public Transport Updates Available" />

      </Section>

    </ScrollView>
  );
}

/* ================= SECTION ================= */
function Section({ title, children }: any) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

/* ================= NEWS ITEM ================= */
function NewsItem({
  icon,
  title,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
}) {
  return (
    <TouchableOpacity style={styles.item}>
      <MaterialCommunityIcons name={icon} size={22} color="#003366" />

      <Text style={styles.itemText}>{title}</Text>

      <Ionicons name="chevron-forward" size={18} color="#999" />
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
    elevation: 1,
  },

  itemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },
});