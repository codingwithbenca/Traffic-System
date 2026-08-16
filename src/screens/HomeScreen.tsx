import React, { ReactNode } from "react";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import DriverLicenseCard from "../components/DriverLicenseCard";

import { seedCitizenIdentityData } from "../components/seedCitizenIdentityData";
import { seedCitizenExtras } from "../components/seedCitizenExtras";
import NextAppointmentCard from "./HOME/NextAppointmentCard";

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
   TYPES
========================================================= */

type SectionHeaderProps = {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

type StatusCardProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  status?: string;
  statusColor?: string;
  hideChevron?: boolean;
  onPress?: () => void;
};

type QuickActionProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  onPress?: () => void;
};

/* =========================================================
   SCREEN
========================================================= */

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons
                name="business-outline"
                size={24}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.headerInformation}>
              <Text style={styles.eyebrow}>
                 Department of Transport Services
                E-TRANSPORT PORTAL
              </Text>

              

              
            </View>

            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.iconButton}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate("Notifications")
                }
              >
                <Ionicons
                  name="notifications-outline"
                  size={21}
                  color={COLORS.primary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate("Profile")
                }
              >
                <Ionicons
                  name="person-circle-outline"
                  size={25}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* =================================================
              LICENCE & VEHICLE STATUS
          ================================================= */}

          <SectionHeader
            title="Licence & Vehicle Status"
            description="Current status of your registered transport services."
            icon="document-text-outline"
          />

          <DriverLicenseCard />

          


       <NextAppointmentCard
  onPress={() =>
    navigation.navigate(
      "Appointments" as never
    )
  }
/>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <SectionHeader
            title="Quick Actions"
            description="Frequently used transport services."
            icon="flash-outline"
          />

          <View style={styles.quickActionsGrid}>
           <QuickAction
  icon="payment"
  title="Pay Fine"
  onPress={() => navigation.navigate("OutstandingPenalties")}
/>

<QuickAction
  icon="sync"
  title="Renew Disk"
  onPress={() => navigation.navigate("RenewDriverLicense")}
/>

<QuickAction
  icon="calendar-month"
  title="Appointment"
  onPress={() => navigation.navigate("Appointments")}
/>

<QuickAction
  icon="badge"
  title="Digital License"
  onPress={() => navigation.navigate("NFCVerification")}
/>
          </View>

          {/* =================================================
              TRAFFIC UPDATES
          ================================================= */}

          <SectionHeader
            title="Traffic Updates"
            description="Current traffic conditions affecting your journey."
            icon="car-outline"
          />

          <TouchableOpacity
            style={styles.mapCard}
            activeOpacity={0.85}
          >
            <View style={styles.fakeMap}>
              <View style={styles.mapRoadHorizontal} />
              <View style={styles.mapRoadVertical} />

              <View style={styles.mapRoadDiagonal} />

              <View
                style={[
                  styles.mapMarker,
                  styles.trafficMarker,
                  { top: "39%", left: "52%" },
                ]}
              >
                <MaterialCommunityIcons
                  name="traffic-light"
                  size={18}
                  color="#FFFFFF"
                />
              </View>

              <View style={styles.mapLabel}>
                <Text style={styles.mapLabelTitle}>
                  Heavy Traffic
                </Text>

                <Text style={styles.mapLabelText}>
                  N1 North
                </Text>
              </View>

              <View style={styles.mapBottom}>
                <View style={styles.mapBottomIcon}>
                  <MaterialCommunityIcons
                    name="traffic-light"
                    size={17}
                    color={COLORS.warning}
                  />
                </View>

                <View style={styles.mapBottomInformation}>
                  <Text style={styles.mapBottomTitle}>
                    Traffic Alert
                  </Text>

                  <Text style={styles.mapBottomDescription}>
                    Heavy traffic reported on N1 North.
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={COLORS.textLight}
                />
              </View>
            </View>
          </TouchableOpacity>

          {/* =================================================
              ROAD CLOSURES
          ================================================= */}

          <SectionHeader
            title="Road Closures"
            description="Important road closure information in your area."
            icon="warning-outline"
          />

          <TouchableOpacity
            style={styles.mapCard}
            activeOpacity={0.85}
          >
            <View style={styles.fakeMap}>
              <View style={styles.mapRoadHorizontal} />
              <View style={styles.mapRoadVertical} />

              <View style={styles.mapRoadSecondary} />

              <View
                style={[
                  styles.mapMarker,
                  styles.closureMarker,
                  { top: "35%", left: "38%" },
                ]}
              >
                <MaterialIcons
                  name="warning"
                  size={18}
                  color="#FFFFFF"
                />
              </View>

              <View style={styles.mapLabel}>
                <Text style={styles.mapLabelTitle}>
                  Road Closed
                </Text>

                <Text style={styles.mapLabelText}>
                  Mabopane Road
                </Text>
              </View>

              <View style={styles.mapBottom}>
                <View style={styles.mapBottomIconWarning}>
                  <MaterialIcons
                    name="warning-amber"
                    size={17}
                    color={COLORS.warning}
                  />
                </View>

                <View style={styles.mapBottomInformation}>
                  <Text style={styles.mapBottomTitle}>
                    Road Closure
                  </Text>

                  <Text style={styles.mapBottomDescription}>
                    Mabopane Road is currently closed.
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={COLORS.textLight}
                />
              </View>
            </View>
          </TouchableOpacity>

          {/* =================================================
              WEATHER
          ================================================= */}

          <SectionHeader
            title="Weather"
            description="Current weather conditions for your area."
            icon="partly-sunny-outline"
          />

          <TouchableOpacity
            style={styles.mapCard}
            activeOpacity={0.85}
          >
            <View style={styles.fakeMap}>
              <View style={styles.mapRoadHorizontal} />
              <View style={styles.mapRoadVertical} />

              <View style={styles.weatherCircle}>
                <Ionicons
                  name="partly-sunny"
                  size={28}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.weatherTemperature}>
                <Text style={styles.weatherTemperatureText}>
                  24°
                </Text>

                <Text style={styles.weatherCondition}>
                  Clear
                </Text>
              </View>

              <View style={styles.mapBottom}>
                <View style={styles.mapBottomIcon}>
                  <Ionicons
                    name="location-outline"
                    size={17}
                    color={COLORS.primary}
                  />
                </View>

                <View style={styles.mapBottomInformation}>
                  <Text style={styles.mapBottomTitle}>
                    Pretoria
                  </Text>

                  <Text style={styles.mapBottomDescription}>
                    24°C • Clear conditions
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={COLORS.textLight}
                />
              </View>
            </View>
          </TouchableOpacity>

          {/* =================================================
              RECENT NOTIFICATIONS
          ================================================= */}

          <SectionHeader
            title="Recent Notifications"
            description="Recent updates and information from the department."
            icon="notifications-outline"
          />

          <TouchableOpacity
            style={styles.notificationCard}
            activeOpacity={0.8}
          >
            <View style={styles.notificationIcon}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.notificationInformation}>
              <Text style={styles.notificationTitle}>
                Driver's license ready for collection
              </Text>

              <Text style={styles.notificationDescription}>
                Your physical driver's licence is ready
                for collection.
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.textLight}
            />
          </TouchableOpacity>

          {/* =================================================
              ACCOUNT NOTICE
          ================================================= */}

          <View style={styles.notice}>
            <Ionicons
              name="information-circle-outline"
              size={19}
              color={COLORS.primary}
            />

            <Text style={styles.noticeText}>
              Transport information shown here is based
              on the records and services associated with
              your citizen account.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  title,
  description,
  icon,
}: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderIcon}>
        <Ionicons
          name={icon ?? "information-circle-outline"}
          size={19}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.sectionHeaderInformation}>
        <Text style={styles.sectionTitle}>
          {title}
        </Text>

        {description && (
          <Text style={styles.sectionDescription}>
            {description}
          </Text>
        )}
      </View>
    </View>
  );
}

/* =========================================================
   STATUS CARD
========================================================= */

function StatusCard({
  icon,
  title,
  subtitle,
  status,
  statusColor,
  hideChevron,
  onPress,
}: StatusCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.cardRow}>
        {icon}

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            {title}
          </Text>

          <Text style={styles.cardSubtitle}>
            {subtitle}
          </Text>
        </View>

        {status && (
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  statusColor === COLORS.success
                    ? COLORS.softGreen
                    : statusColor === COLORS.warning
                    ? COLORS.softYellow
                    : COLORS.softBlue,
              },
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                {
                  color:
                    statusColor ??
                    COLORS.primary,
                },
              ]}
            >
              {status}
            </Text>
          </View>
        )}

        {!hideChevron && (
          <Ionicons
            name="chevron-forward"
            size={18}
            color={COLORS.textLight}
            style={styles.cardChevron}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon,
  title,
  onPress,
}: QuickActionProps) {
  return (
    <TouchableOpacity
      style={styles.quickAction}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.quickActionIcon}>
        <MaterialIcons
          name={icon}
          size={25}
          color={COLORS.primary}
        />
      </View>

      <Text style={styles.quickActionTitle}>
        {title}
      </Text>

      <Text style={styles.quickActionDescription}>
        Access service
      </Text>

      <View style={styles.quickActionArrow}>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={COLORS.textLight}
        />
      </View>
    </TouchableOpacity>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  wrapper: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 30,
    paddingBottom: 60,
  },

  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 17,
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
    paddingRight: 5,
    marginTop: 10,
   
  },

  eyebrow: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
    color: COLORS.primary,
  },

  title: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    lineHeight: 25,
  },

  subtitle: {
    marginTop: 4,
    color: COLORS.textLight,
    fontSize: 11,
    lineHeight: 17,
  },

  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 7,
  },

  /* =======================================================
     SECTION
  ======================================================= */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
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
     STATUS CARDS
  ======================================================= */

  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 9,
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusIcon: {
    width: 43,
    height: 43,
    borderRadius: 9,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },

  statusIconWarning: {
    width: 43,
    height: 43,
    borderRadius: 9,
    backgroundColor: COLORS.softYellow,
    alignItems: "center",
    justifyContent: "center",
  },

  cardContent: {
    flex: 1,
    marginLeft: 10,
    marginRight: 7,
  },

  cardTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.text,
  },

  cardSubtitle: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 15,
    color: COLORS.textLight,
  },

  cardChevron: {
    marginLeft: 5,
  },

  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 5,
  },

  statusBadgeText: {
    fontSize: 9,
    fontWeight: "800",
  },

  /* =======================================================
     QUICK ACTION GRID
  ======================================================= */

  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 5,
  },

  quickAction: {
    width: "48.5%",
    minHeight: 126,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    position: "relative",
  },

  quickActionIcon: {
    width: 43,
    height: 43,
    borderRadius: 9,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  quickActionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.text,
  },

  quickActionDescription: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 15,
    color: COLORS.textLight,
  },

  quickActionArrow: {
    position: "absolute",
    right: 12,
    top: 14,
  },

  /* =======================================================
     MAP CARDS
  ======================================================= */

  mapCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },

  fakeMap: {
    height: 190,
    backgroundColor: "#E8EEF2",
    position: "relative",
    overflow: "hidden",
  },

  mapRoadHorizontal: {
    position: "absolute",
    height: 22,
    width: "115%",
    left: "-8%",
    top: "45%",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#CDD6DC",
    transform: [
      {
        rotate: "-4deg",
      },
    ],
  },

  mapRoadVertical: {
    position: "absolute",
    width: 18,
    height: "120%",
    left: "60%",
    top: "-10%",
    backgroundColor: "#FFFFFF",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#CDD6DC",
    transform: [
      {
        rotate: "12deg",
      },
    ],
  },

  mapRoadDiagonal: {
    position: "absolute",
    height: 12,
    width: "90%",
    left: "-10%",
    top: "28%",
    backgroundColor: "#F9FBFC",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#D4DDE2",
    transform: [
      {
        rotate: "22deg",
      },
    ],
  },

  mapRoadSecondary: {
    position: "absolute",
    height: 14,
    width: "100%",
    left: "0%",
    top: "68%",
    backgroundColor: "#F9FBFC",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#D4DDE2",
    transform: [
      {
        rotate: "-17deg",
      },
    ],
  },

  mapMarker: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    position: "absolute",
  },

  trafficMarker: {
    backgroundColor: COLORS.warning,
  },

  closureMarker: {
    backgroundColor: COLORS.danger,
  },

  mapLabel: {
    position: "absolute",
    top: 15,
    left: 15,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  mapLabelTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.text,
  },

  mapLabelText: {
    marginTop: 2,
    fontSize: 9,
    color: COLORS.textLight,
  },

  mapBottom: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    padding: 9,
  },

  mapBottomIcon: {
    width: 32,
    height: 32,
    borderRadius: 7,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },

  mapBottomIconWarning: {
    width: 32,
    height: 32,
    borderRadius: 7,
    backgroundColor: COLORS.softYellow,
    alignItems: "center",
    justifyContent: "center",
  },

  mapBottomInformation: {
    flex: 1,
    marginLeft: 8,
    marginRight: 5,
  },

  mapBottomTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.text,
  },

  mapBottomDescription: {
    marginTop: 2,
    fontSize: 9,
    lineHeight: 13,
    color: COLORS.textLight,
  },

  /* =======================================================
     WEATHER
  ======================================================= */

  weatherCircle: {
    position: "absolute",
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
    top: "28%",
    left: "28%",
    borderWidth: 2,
    borderColor: COLORS.card,
  },

  weatherTemperature: {
    position: "absolute",
    top: "30%",
    left: "48%",
  },

  weatherTemperatureText: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.primary,
  },

  weatherCondition: {
    marginTop: -3,
    fontSize: 10,
    color: COLORS.textLight,
  },

  /* =======================================================
     NOTIFICATIONS
  ======================================================= */

  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 9,
  },

  notificationIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },

  notificationInformation: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },

  notificationTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.text,
  },

  notificationDescription: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 15,
    color: COLORS.textLight,
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
    marginTop: 8,
  },

  noticeText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 10,
    lineHeight: 16,
    color: COLORS.text,
  },
});