import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
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
  softBlue: "#EAF3FA",
  softGreen: "#ECFDF3",
};

/* =========================================================
   PAYMENT DATA
========================================================= */

const PAYMENTS = [
  {
    id: "1",
    service: "Driver's Licence Renewal",
    reference: "TXN-2026-00124",
    date: "16 Aug 2026",
    amount: "R250.00",
    method: "Card",
    status: "Paid",
  },
  {
    id: "2",
    service: "Vehicle Licence Renewal",
    reference: "TXN-2026-00117",
    date: "12 Aug 2026",
    amount: "R180.00",
    method: "Instant EFT",
    status: "Paid",
  },
  {
    id: "3",
    service: "Traffic Fine",
    reference: "TXN-2026-00098",
    date: "05 Aug 2026",
    amount: "R500.00",
    method: "Card",
    status: "Paid",
  },
  {
    id: "4",
    service: "Appointment Booking",
    reference: "TXN-2026-00076",
    date: "29 Jul 2026",
    amount: "R100.00",
    method: "Instant EFT",
    status: "Paid",
  },
];

/* =========================================================
   SCREEN
========================================================= */

export default function PaymentHistoryScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={COLORS.text}
            />
          </TouchableOpacity>

          <View style={styles.headerInformation}>
            <Text style={styles.headerTitle}>
              Payment History
            </Text>

            <Text style={styles.headerSubtitle}>
              Your previous transactions
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* =================================================
              SUMMARY
          ================================================= */}

          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <MaterialCommunityIcons
                name="history"
                size={27}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.summaryInformation}>
              <Text style={styles.summaryLabel}>
                Total payments
              </Text>

              <Text style={styles.summaryValue}>
                {PAYMENTS.length}
              </Text>

              <Text style={styles.summaryDescription}>
                Completed transactions
              </Text>
            </View>

            <View style={styles.summaryRight}>
              <Text style={styles.summaryTotalLabel}>
                Total paid
              </Text>

              <Text style={styles.summaryTotal}>
                R1 030.00
              </Text>
            </View>
          </View>

          {/* =================================================
              SECTION HEADER
          ================================================= */}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Transactions
            </Text>

            <Text style={styles.sectionDescription}>
              Your most recent payment activity.
            </Text>
          </View>

          {/* =================================================
              PAYMENT LIST
          ================================================= */}

          <View style={styles.paymentList}>
            {PAYMENTS.map((payment, index) => (
              <React.Fragment key={payment.id}>
                <TouchableOpacity
                  style={styles.paymentCard}
                  activeOpacity={0.8}
                  onPress={() =>
                    console.log(
                      "Selected payment:",
                      payment.id
                    )
                  }
                >
                  {/* PAYMENT ICON */}

                  <View style={styles.paymentIcon}>
                    <MaterialCommunityIcons
                      name={
                        payment.method ===
                        "Instant EFT"
                          ? "bank-transfer"
                          : "credit-card-outline"
                      }
                      size={21}
                      color={COLORS.primary}
                    />
                  </View>

                  {/* INFORMATION */}

                  <View style={styles.paymentInformation}>
                    <Text
                      style={styles.paymentService}
                      numberOfLines={1}
                    >
                      {payment.service}
                    </Text>

                    <Text style={styles.paymentReference}>
                      {payment.reference}
                    </Text>

                    <View style={styles.paymentMeta}>
                      <Text style={styles.paymentDate}>
                        {payment.date}
                      </Text>

                      <View style={styles.metaDot} />

                      <Text style={styles.paymentMethod}>
                        {payment.method}
                      </Text>
                    </View>
                  </View>

                  {/* RIGHT SIDE */}

                  <View style={styles.paymentRight}>
                    <Text style={styles.paymentAmount}>
                      {payment.amount}
                    </Text>

                    <View style={styles.statusBadge}>
                      <View style={styles.statusDot} />

                      <Text style={styles.statusText}>
                        {payment.status}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {index <
                  PAYMENTS.length - 1 && (
                  <View style={styles.divider} />
                )}
              </React.Fragment>
            ))}
          </View>

          {/* =================================================
              INFORMATION
          ================================================= */}

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.infoInformation}>
              <Text style={styles.infoTitle}>
                Need a receipt?
              </Text>

              <Text style={styles.infoText}>
                You can download an official receipt for
                completed payments from the Download
                Receipts section.
              </Text>
            </View>
          </View>

          {/* =================================================
              FOOTER
          ================================================= */}

          <View style={styles.footer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={14}
              color={COLORS.textLight}
            />

            <Text style={styles.footerText}>
              Payment records are linked to your citizen
              account.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
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

  container: {
    flex: 1,
  },

  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    height: 72,
    paddingHorizontal: 18,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },

  headerInformation: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.text,
  },

  headerSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.textLight,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 35,
  },

  /* =======================================================
     SUMMARY
  ======================================================= */

  summaryCard: {
    padding: 17,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
  },

  summaryIcon: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryInformation: {
    flex: 1,
    marginLeft: 13,
  },

  summaryLabel: {
    fontSize: 11,
    color: COLORS.textLight,
  },

  summaryValue: {
    marginTop: 1,
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
  },

  summaryDescription: {
    marginTop: 1,
    fontSize: 10,
    color: COLORS.textLight,
  },

  summaryRight: {
    alignItems: "flex-end",
  },

  summaryTotalLabel: {
    fontSize: 10,
    color: COLORS.textLight,
  },

  summaryTotal: {
    marginTop: 3,
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.primary,
  },

  /* =======================================================
     SECTION
  ======================================================= */

  sectionHeader: {
    marginTop: 25,
    marginBottom: 11,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },

  sectionDescription: {
    marginTop: 3,
    fontSize: 12,
    color: COLORS.textLight,
  },

  /* =======================================================
     PAYMENT LIST
  ======================================================= */

  paymentList: {
    padding: 7,
    borderRadius: 17,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  paymentCard: {
    minHeight: 83,
    paddingHorizontal: 9,
    paddingVertical: 11,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },

  paymentInformation: {
    flex: 1,
    marginLeft: 11,
    paddingRight: 7,
  },

  paymentService: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.text,
  },

  paymentReference: {
    marginTop: 3,
    fontSize: 10,
    color: COLORS.textLight,
  },

  paymentMeta: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
  },

  paymentDate: {
    fontSize: 10,
    color: COLORS.textLight,
  },

  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    marginHorizontal: 6,
    backgroundColor: COLORS.textLight,
  },

  paymentMethod: {
    fontSize: 10,
    color: COLORS.textLight,
  },

  paymentRight: {
    alignItems: "flex-end",
  },

  paymentAmount: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.primary,
  },

  statusBadge: {
    marginTop: 5,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 7,
    backgroundColor: COLORS.softGreen,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },

  statusText: {
    fontSize: 8,
    fontWeight: "800",
    color: COLORS.success,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 9,
  },

  /* =======================================================
     INFORMATION
  ======================================================= */

  infoCard: {
    marginTop: 17,
    padding: 15,
    borderRadius: 16,
    backgroundColor: COLORS.softBlue,
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  infoInformation: {
    flex: 1,
    marginLeft: 11,
  },

  infoTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.primaryDark,
  },

  infoText: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.textLight,
  },

  /* =======================================================
     FOOTER
  ======================================================= */

  footer: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  footerText: {
    fontSize: 10,
    color: COLORS.textLight,
    textAlign: "center",
  },
});