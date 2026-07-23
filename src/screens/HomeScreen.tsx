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
  Button
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import DriverLicenseCard from "../components/DriverLicenseCard";
/* TYPES */
type SectionHeaderProps = {
  title: string;
  onPress?: () => void;
};

type StatusCardProps = {
  icon: React.ReactNode;
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

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>e-Transport Portal</Text>
              <Text style={styles.title}>
                Department of Transport Services
              </Text>
            </View>

            <View style={styles.headerIcons}>
              <TouchableOpacity
  style={styles.iconButton}
  onPress={() => navigation.navigate("Notifications")}
>
  <Ionicons
    name="notifications-outline"
    size={24}
    color="#003366"
  />
</TouchableOpacity>

<TouchableOpacity
  style={styles.iconButton}
 onPress={() => navigation.navigate("Profile")}
>
  <Ionicons
    name="person-circle-outline"
    size={30}
    color="#003366"
  />
</TouchableOpacity>

             
            </View>
          </View>

          {/* STATUS CARDS */}
          <DriverLicenseCard />

          <StatusCard
            icon={
              <MaterialCommunityIcons
                name="car-info"
                size={26}
                color="#003366"
              />
            }
            title="Vehicle License"
            subtitle="Expires in 30 days"
           onPress={() => navigation.navigate("VehicleLicense")}
          />

         <StatusCard
  icon={
    <MaterialIcons
      name="warning-amber"
      size={26}
      color="#E65100"
    />
  }
  title="Traffic Fines"
  subtitle="Outstanding Balance: R750 • 2 Unpaid"
  onPress={() => navigation.navigate("Fines")}
/>
 <StatusCard
  icon={
    <Ionicons
      name="calendar-outline"
      size={24}
      color="#003366"
    />
  }
  title="Next Appointment"
  subtitle={`Driver Licence Renewal
15 Jul 2026 • 09:30 AM
📍 Pretoria DLTC`}
  status="Confirmed"
  statusColor="#2E7D32"
  hideChevron
  onPress={() => navigation.navigate("Appointments")}
/>

          {/* QUICK ACTIONS */}
          <SectionHeader title="Quick Actions" />

          <View style={styles.grid}>
            <QuickAction icon="payment" title="Pay Fine" />
            <QuickAction icon="sync" title="Renew Disk" />
            <QuickAction icon="calendar-month" title="Appointment" />
            <QuickAction icon="badge" title="Digital License" />
          </View>

          {/* TRAFFIC */}
          <SectionHeader title="Traffic Updates" />

          <TouchableOpacity style={styles.listItem}>
            <View style={styles.row}>
              <MaterialCommunityIcons
                name="traffic-light"
                size={22}
                color="#003366"
              />
              <Text style={styles.listText}>Heavy Traffic on N1 North</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#999" />
          </TouchableOpacity>

          {/* ROAD CLOSURES */}
          <SectionHeader title="Road Closures" />

          <TouchableOpacity style={styles.listItem}>
            <View style={styles.row}>
              <MaterialCommunityIcons
                name="road-variant"
                size={22}
                color="#003366"
              />
              <Text style={styles.listText}>Mabopane Road Closed</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#999" />
          </TouchableOpacity>

          {/* WEATHER */}
          <SectionHeader title="Weather" />

          <TouchableOpacity style={styles.listItem}>
            <View style={styles.row}>
              <Ionicons
                name="partly-sunny-outline"
                size={22}
                color="#003366"
              />
              <Text style={styles.listText}>Pretoria • 24°C • Clear</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#999" />
          </TouchableOpacity>

          {/* NOTIFICATIONS */}
          <SectionHeader title="Recent Notifications" />

          <TouchableOpacity style={styles.listItem}>
            <View style={styles.row}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#003366"
              />
              <Text style={styles.listText}>
                Driver's license ready for collection
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#999" />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* COMPONENTS */

function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function StatusCard({ icon, title, subtitle, onPress }: StatusCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        {icon}

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>

        <Ionicons name="chevron-forward" size={22} color="#999" />
      </View>
    </TouchableOpacity>
  );
}

function QuickAction({ icon, title, onPress }: QuickActionProps) {
  return (
    <TouchableOpacity style={styles.action} onPress={onPress}>
      <MaterialIcons name={icon} size={28} color="#003366" />
      <Text style={styles.actionText}>{title}</Text>
      <Ionicons name="chevron-forward" size={18} color="#999" />
    </TouchableOpacity>
  );
}

/* STYLES */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  wrapper: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },

  header: {
    paddingTop: 10,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  greeting: {
    color: "#666",
    fontSize: 14,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#003366",
    marginTop: 2,
  },

  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconButton: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 12,
    marginLeft: 10,
    elevation: 2,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  cardContent: {
    flex: 1,
    marginLeft: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  cardSubtitle: {
    marginTop: 4,
    color: "#666",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003366",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  action: {
    width: "48%",
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
    elevation: 1,
  },

  actionText: {
    marginTop: 10,
    fontWeight: "600",
    color: "#222",
  },

  listItem: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
  },

  listText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#222",
  },
});