import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import LiveTraffic from "./Updates/LiveTraffic";
import TrafficIncidents from "./Updates/TrafficIncidents";
import SuggestedRoutes from "./Updates/SuggestedRoutes";
import WeatherAlerts from "./Updates/WeatherAlerts";
import DepartmentAnnouncements from "./Updates/DepartmentAnnouncements";
/* =========================================================
   COLOURS
========================================================= */

const COLORS = {
  primary: "#0B4F8A",
  primaryDark: "#083B68",

  background: "#F3F5F7",
  card: "#FFFFFF",

  text: "#17212B",
  textLight: "#66737F",

  border: "#D9E0E6",

  success: "#18794E",
  warning: "#A16207",
  danger: "#B42318",

  softBlue: "#EAF3FA",
  softGreen: "#ECFDF3",
  softYellow: "#FFF8E6",
  softRed: "#FEF3F2",
};

/* =========================================================
   SCREEN
========================================================= */

export default function TrafficNewsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons
              name="car-outline"
              size={24}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.headerInformation}>
            <Text style={styles.eyebrow}>
              CITIZEN SERVICES
            </Text>

            <Text style={styles.title}>
              Traffic & News
            </Text>

            <Text style={styles.subtitle}>
              Live road conditions, incidents, alerts and
              official traffic announcements.
            </Text>
          </View>
        </View>

        {/* =================================================
            LIVE SERVICE STATUS
        ================================================= */}

        <View style={styles.liveStatus}>
          <View style={styles.liveStatusLeft}>
            <View style={styles.liveDot} />

            <View>
              

              <Text style={styles.liveSubtitle}>
                Placeholder data · Updated moments ago
              </Text>
            </View>
          </View>

          <Ionicons
            name="radio-outline"
            size={19}
            color={COLORS.primary}
          />
        </View>

    

<Section>
  <LiveTraffic />
</Section>

        {/* =================================================
            INCIDENTS
        ================================================= */}

      <Section title="Incidents" description="Live accidents, construction zones and road closures." icon="warning-outline" > <TrafficIncidents /> </Section>

        {/* =================================================
            SUGGESTED ROUTES
        ================================================= */}

        <Section
  title="Suggested Routes"
  description="Alternative routes based on current traffic conditions."
  icon="map-marker-path"
>
  <SuggestedRoutes />
</Section>

        {/* =================================================
            WEATHER ALERTS
        ================================================= */}

       <Section
  title="Weather Alerts"
  description="Weather conditions that may affect driving."
  icon="weather-partly-cloudy"
>
  <WeatherAlerts />
</Section>

        {/* =================================================
            DEPARTMENT ANNOUNCEMENTS
        ================================================= */}

       <Section
  title="Department Announcements"
  description="Official traffic and transport announcements."
  icon="megaphone-outline"
>
  <DepartmentAnnouncements />
</Section>

        {/* =================================================
            INFORMATION NOTICE
        ================================================= */}

        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={19}
            color={COLORS.primary}
          />

          <Text style={styles.noticeText}>
            Traffic information shown here is currently
            placeholder data. Live traffic, incident,
            weather and announcement information can be
            connected to your traffic services backend later.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================
   SECTION
========================================================= */

function Section({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderIcon}>
          <MaterialCommunityIcons
            name={icon}
            size={19}
            color={COLORS.primary}
          />
        </View>

        <View style={styles.sectionHeaderInformation}>
          <Text style={styles.sectionTitle}>
            {title}
          </Text>

          <Text style={styles.sectionDescription}>
            {description}
          </Text>
        </View>
      </View>

      {children}
    </View>
  );
}

/* =========================================================
   LIVE TRAFFIC ITEM
========================================================= */

function TrafficItem({
  icon,
  status,
  statusType,
  title,
  description,
  meta,
  updated,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  status: string;
  statusType: "success" | "warning" | "danger";
  title: string;
  description: string;
  meta: string;
  updated: string;
}) {
  const statusStyles = {
    success: {
      backgroundColor: COLORS.softGreen,
      color: COLORS.success,
    },
    warning: {
      backgroundColor: COLORS.softYellow,
      color: COLORS.warning,
    },
    danger: {
      backgroundColor: COLORS.softRed,
      color: COLORS.danger,
    },
  };

  const current = statusStyles[statusType];

  return (
    <TouchableOpacity
      style={styles.item}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={icon}
          size={21}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.textContainer}>
        <View style={styles.itemTopRow}>
          <Text style={styles.itemText}>
            {title}
          </Text>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: current.backgroundColor,
              },
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                { color: current.color },
              ]}
            >
              {status}
            </Text>
          </View>
        </View>

        <Text style={styles.itemDescription}>
          {description}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {meta}
          </Text>

          <Text style={styles.updatedText}>
            {updated}
          </Text>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={COLORS.textLight}
      />
    </TouchableOpacity>
  );
}

/* =========================================================
   INCIDENT ITEM
========================================================= */

function IncidentItem({
  icon,
  severity,
  title,
  location,
  description,
  status,
  time,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  severity: string;
  title: string;
  location: string;
  description: string;
  status: string;
  time: string;
}) {
  return (
    <TouchableOpacity
      style={styles.item}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={icon}
          size={21}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.textContainer}>
        <View style={styles.itemTopRow}>
          <Text style={styles.itemText}>
            {title}
          </Text>

          <View style={styles.smallAlertBadge}>
            <Text style={styles.smallAlertBadgeText}>
              {severity}
            </Text>
          </View>
        </View>

        <Text style={styles.locationText}>
          {location}
        </Text>

        <Text style={styles.itemDescription}>
          {description}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {status}
          </Text>

          <Text style={styles.updatedText}>
            {time}
          </Text>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={COLORS.textLight}
      />
    </TouchableOpacity>
  );
}

/* =========================================================
   ROUTE ITEM
========================================================= */

function RouteItem({
  icon,
  title,
  description,
  route,
  impact,
  impactType,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
  route: string;
  impact: string;
  impactType: "success" | "danger";
}) {
  return (
    <TouchableOpacity
      style={styles.item}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={icon}
          size={21}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.itemText}>
          {title}
        </Text>

        <Text style={styles.routeText}>
          {route}
        </Text>

        <Text style={styles.itemDescription}>
          {description}
        </Text>

        <Text
          style={[
            styles.routeImpact,
            {
              color:
                impactType === "success"
                  ? COLORS.success
                  : COLORS.danger,
            },
          ]}
        >
          {impact}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={COLORS.textLight}
      />
    </TouchableOpacity>
  );
}

/* =========================================================
   WEATHER / ALERT ITEM
========================================================= */

function AlertItem({
  icon,
  type,
  title,
  location,
  description,
  time,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  type: string;
  title: string;
  location: string;
  description: string;
  time: string;
}) {
  return (
    <TouchableOpacity
      style={styles.item}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={icon}
          size={21}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.itemText}>
          {title}
        </Text>

        <Text style={styles.locationText}>
          {type} · {location}
        </Text>

        <Text style={styles.itemDescription}>
          {description}
        </Text>

        <Text style={styles.updatedText}>
          {time}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={COLORS.textLight}
      />
    </TouchableOpacity>
  );
}

/* =========================================================
   ANNOUNCEMENT ITEM
========================================================= */

function AnnouncementItem({
  icon,
  title,
  description,
  source,
  date,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
  source: string;
  date: string;
}) {
  return (
    <TouchableOpacity
      style={styles.item}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={icon}
          size={21}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.itemText}>
          {title}
        </Text>

        <Text style={styles.itemDescription}>
          {description}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.sourceText}>
            {source}
          </Text>

          <Text style={styles.updatedText}>
            {date}
          </Text>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={COLORS.textLight}
      />
    </TouchableOpacity>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  /* =======================================================
     SAFE AREA
  ======================================================= */

  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  contentContainer: {
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 60,
  },

  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  headerIcon: {
    width: 43,
    height: 43,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  headerInformation: {
    flex: 1,
  },

  eyebrow: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
    color: COLORS.primary,
  },

  title: {
    marginTop: 2,
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 4,
    color: COLORS.textLight,
    fontSize: 12,
    lineHeight: 18,
  },

  /* =======================================================
     LIVE STATUS
  ======================================================= */

  liveStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.softGreen,
    borderWidth: 1,
    borderColor: "#C8E9D8",
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 10,
    marginBottom: 24,
  },

  liveStatusLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 9,
  },

  liveTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.success,
  },

  liveSubtitle: {
    marginTop: 2,
    fontSize: 9,
    color: COLORS.textLight,
  },

  /* =======================================================
     SECTION
  ======================================================= */

  section: {
    marginBottom: 22,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  sectionHeaderIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  sectionHeaderInformation: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },

  sectionDescription: {
    marginTop: 2,
    color: COLORS.textLight,
    fontSize: 11,
    lineHeight: 16,
  },

  /* =======================================================
     ITEM
  ======================================================= */

  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 9,
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },

  textContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },

  itemTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  itemText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.text,
    marginRight: 7,
  },

  itemDescription: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 15,
    color: COLORS.textLight,
  },

  /* =======================================================
     STATUS BADGE
  ======================================================= */

  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
  },

  statusBadgeText: {
    fontSize: 8,
    fontWeight: "800",
  },

  /* =======================================================
     META
  ======================================================= */

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },

  metaText: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.text,
  },

  updatedText: {
    fontSize: 8,
    color: COLORS.textLight,
  },

  /* =======================================================
     INCIDENT
  ======================================================= */

  smallAlertBadge: {
    backgroundColor: COLORS.softRed,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
  },

  smallAlertBadgeText: {
    fontSize: 8,
    fontWeight: "800",
    color: COLORS.danger,
  },

  locationText: {
    marginTop: 3,
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.primary,
  },

  /* =======================================================
     ROUTES
  ======================================================= */

  routeText: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.primary,
  },

  routeImpact: {
    marginTop: 5,
    fontSize: 9,
    fontWeight: "800",
  },

  /* =======================================================
     ANNOUNCEMENTS
  ======================================================= */

  sourceText: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.primary,
  },

  /* =======================================================
     NOTICE
  ======================================================= */

  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.softBlue,
    borderWidth: 1,
    borderColor: "#C7DDED",
    borderRadius: 9,
    padding: 11,
    marginTop: 2,
  },

  noticeText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 10,
    lineHeight: 16,
    color: COLORS.text,
  },
});