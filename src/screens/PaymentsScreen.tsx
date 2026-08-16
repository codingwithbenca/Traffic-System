
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
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

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

export default function PaymentsScreen() {
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
              name="card-outline"
              size={24}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.headerInformation}>
            <Text style={styles.eyebrow}>
              CITIZEN SERVICES
            </Text>

            <Text style={styles.title}>
              Payments
            </Text>

            <Text style={styles.subtitle}>
              Manage all traffic-related payments,
              fees and receipts.
            </Text>
          </View>
        </View>

        {/* =================================================
            FINES
        ================================================= */}

        <Section
          title="Fines & Penalties"
          description="View and manage outstanding traffic fines and penalties."
          icon="warning-outline"
        >
          <PaymentItem
            icon="speed"
            title="Speed Camera Tickets"
            description="View and manage tickets issued by speed cameras."
            screen="SpeedCameraTickets"
          />

          <PaymentItem
            icon="warning"
            title="Outstanding Penalties"
            description="View penalties that are currently due."
            screen="OutstandingPenalties"
          />

          <PaymentItem
            icon="receipt-long"
            title="Fines Overview"
            description="View a complete overview of your traffic fines."
            screen="FinesOverview"
          />
        </Section>

        {/* =================================================
            VEHICLE PAYMENTS
        ================================================= */}

        <Section
          title="Vehicle Payments"
          description="Manage payments related to your registered vehicles."
          icon="car-outline"
        >
          <PaymentItem
            icon="directions-car"
            title="Vehicle Payments"
            description="View and manage payments associated with your vehicles."
            screen="VehiclePayments"
          />

          <PaymentItem
            icon="credit-card"
            title="Vehicle Registration Fees"
            description="Pay fees associated with vehicle registration."
            screen="VehicleRegistrationFees"
          />

          <PaymentItem
            icon="confirmation-number"
            title="Licence Disc Payments"
            description="Manage payments for your vehicle licence disc."
            screen="LicenseDiskPayments"
          />
        </Section>

        {/* =================================================
            PAYMENT METHODS
        ================================================= */}

        <Section
          title="Payment Methods"
          description="View available methods for making traffic payments."
          icon="wallet-outline"
        >
          <PaymentItem
            icon="credit-card"
            title="Card Payments"
            description="Manage payments made using a bank card."
            screen="CardPayments"
          />

          <PaymentItem
            icon="account-balance"
            title="Instant EFT"
            description="Make payments directly from your bank account."
            screen="InstantEFT"
          />

          <PaymentItem
            icon="smartphone"
            title="Mobile Payments"
            description="View available mobile payment options."
            screen="MobilePayments"
          />
        </Section>

        {/* =================================================
            PAYMENT HISTORY
        ================================================= */}

        <Section
          title="Payment History"
          description="Review your previous payments and receipts."
          icon="receipt-outline"
        >
          <PaymentItem
            icon="history"
            title="Payment History"
            description="View your previous traffic-related payments."
            screen="PaymentHistory"
          />

          <PaymentItem
            icon="download"
            title="Download Receipts"
            description="Download receipts for completed payments."
            screen="DownloadReceipts"
          />

          <PaymentItem
            icon="email"
            title="Email Receipts"
            description="Send your payment receipts to your email."
            screen="EmailReceipts"
          />
        </Section>

        {/* =================================================
            NOTICE
        ================================================= */}

        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={19}
            color={COLORS.primary}
          />

          <Text style={styles.noticeText}>
            Payment information shown here is based
            on the traffic services and transactions
            associated with your citizen account.
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
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      {/* SECTION HEADER */}

      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderIcon}>
          <Ionicons
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

      {/* SECTION ITEMS */}

      {children}
    </View>
  );
}

/* =========================================================
   PAYMENT ITEM
========================================================= */

function PaymentItem({
  icon,
  title,
  description,
  screen,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
  screen: string;
}) {
  const navigation = useNavigation<any>();

  const handlePress = () => {
    const parentNavigation =
      navigation.getParent();

    if (parentNavigation) {
      parentNavigation.navigate(screen);
    } else {
      navigation.navigate(screen);
    }
  };

  return (
    <TouchableOpacity
      style={styles.item}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      {/* ICON */}

      <View style={styles.iconContainer}>
        <MaterialIcons
          name={icon}
          size={21}
          color={COLORS.primary}
        />
      </View>

      {/* TEXT */}

      <View style={styles.textContainer}>
        <Text style={styles.itemText}>
          {title}
        </Text>

        <Text style={styles.itemDescription}>
          {description}
        </Text>
      </View>

      {/* CHEVRON */}

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
    marginBottom: 22,
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
     PAYMENT ITEM
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

  itemText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.text,
  },

  itemDescription: {
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

