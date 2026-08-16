
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";

type FineStatus = "Paid" | "Outstanding" | "Overdue";

type Fine = {
  id: string;
  offence: string;
  date: string;
  location: string;
  amount: number;
  status: FineStatus;
  reference: string;
  vehicleRegistration?: string;
};

// Temporary data.
// Replace this with user?.fines once your Firestore
// fines structure is finalized.
const sampleFines: Fine[] = [
  {
    id: "FINE001",
    offence: "Speeding",
    date: "05 August 2026",
    location: "N4 Highway",
    amount: 750,
    status: "Outstanding",
    reference: "FINE-2026-001",
    vehicleRegistration: "ABC 123 GP",
  },
  {
    id: "FINE002",
    offence: "Failure to obey traffic sign",
    date: "29 July 2026",
    location: "Pretoria CBD",
    amount: 500,
    status: "Overdue",
    reference: "FINE-2026-002",
    vehicleRegistration: "ABC 123 GP",
  },
  {
    id: "FINE003",
    offence: "Parking violation",
    date: "12 July 2026",
    location: "Pretoria",
    amount: 300,
    status: "Paid",
    reference: "FINE-2026-003",
    vehicleRegistration: "XYZ 789 GP",
  },
];

export default function FinesOverviewScreen() {
  const { user } = useAuth();

  /*
   * Later replace:
   *
   * const fines = sampleFines;
   *
   * with:
   *
   * const fines = user?.fines ?? [];
   */

  const fines = sampleFines;

  const totalFines = fines.length;

  const paidFines = fines.filter(
    (fine) => fine.status === "Paid"
  );

  const outstandingFines = fines.filter(
    (fine) => fine.status === "Outstanding"
  );

  const overdueFines = fines.filter(
    (fine) => fine.status === "Overdue"
  );

  const totalAmount = fines.reduce(
    (total, fine) => total + fine.amount,
    0
  );

  const outstandingAmount = fines
    .filter(
      (fine) =>
        fine.status === "Outstanding" ||
        fine.status === "Overdue"
    )
    .reduce((total, fine) => total + fine.amount, 0);

  const paidAmount = paidFines.reduce(
    (total, fine) => total + fine.amount,
    0
  );

  const formatCurrency = (amount: number) => {
    return `R ${amount.toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusIcon = (status: FineStatus) => {
    if (status === "Paid") {
      return "check-circle";
    }

    if (status === "Overdue") {
      return "warning";
    }

    return "pending-actions";
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Fines Overview</Text>

          <Text style={styles.subtitle}>
            Review your traffic fines, payment history and current
            outstanding penalties.
          </Text>
        </View>

        {/* TOTAL SUMMARY */}
        <View style={styles.totalCard}>
          <View style={styles.totalIcon}>
            <MaterialIcons
              name="receipt-long"
              size={27}
              color="#003366"
            />
          </View>

          <Text style={styles.totalLabel}>
            Total Fines
          </Text>

          <Text style={styles.totalNumber}>
            {totalFines}
          </Text>

          <Text style={styles.totalDescription}>
            Recorded on your traffic account
          </Text>

          <View style={styles.totalDivider} />

          <View style={styles.amountRow}>
            <View>
              <Text style={styles.amountLabel}>
                Total Value
              </Text>

              <Text style={styles.amountValue}>
                {formatCurrency(totalAmount)}
              </Text>
            </View>

            <View style={styles.amountRight}>
              <Text style={styles.amountLabel}>
                Outstanding
              </Text>

              <Text style={styles.outstandingAmount}>
                {formatCurrency(outstandingAmount)}
              </Text>
            </View>
          </View>
        </View>

        {/* STATUS SUMMARY */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Payment Status
          </Text>
        </View>

        <View style={styles.statusGrid}>
          {/* PAID */}
          <View style={styles.statusCard}>
            <View style={styles.paidIcon}>
              <MaterialIcons
                name="check-circle"
                size={22}
                color="#2E7D32"
              />
            </View>

            <Text style={styles.statusNumber}>
              {paidFines.length}
            </Text>

            <Text style={styles.statusLabel}>
              Paid
            </Text>

            <Text style={styles.statusAmount}>
              {formatCurrency(paidAmount)}
            </Text>
          </View>

          {/* OUTSTANDING */}
          <View style={styles.statusCard}>
            <View style={styles.pendingIcon}>
              <MaterialIcons
                name="pending-actions"
                size={22}
                color="#B26A00"
              />
            </View>

            <Text style={styles.statusNumber}>
              {outstandingFines.length}
            </Text>

            <Text style={styles.statusLabel}>
              Outstanding
            </Text>

            <Text style={styles.statusAmount}>
              {formatCurrency(
                outstandingFines.reduce(
                  (total, fine) => total + fine.amount,
                  0
                )
              )}
            </Text>
          </View>

          {/* OVERDUE */}
          <View style={styles.statusCard}>
            <View style={styles.overdueIcon}>
              <MaterialIcons
                name="warning"
                size={22}
                color="#C62828"
              />
            </View>

            <Text style={[styles.statusNumber, styles.redText]}>
              {overdueFines.length}
            </Text>

            <Text style={styles.statusLabel}>
              Overdue
            </Text>

            <Text style={styles.statusAmount}>
              {formatCurrency(
                overdueFines.reduce(
                  (total, fine) => total + fine.amount,
                  0
                )
              )}
            </Text>
          </View>
        </View>

        {/* INFORMATION */}
        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle-outline"
            size={21}
            color="#003366"
          />

          <Text style={styles.infoText}>
            This overview shows the fines currently recorded against
            your account. Payment status may change after a payment
            has been successfully processed.
          </Text>
        </View>

        {/* FINE HISTORY */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Fine History
          </Text>

          <Text style={styles.countText}>
            {totalFines} {totalFines === 1 ? "record" : "records"}
          </Text>
        </View>

        {fines.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialIcons
              name="check-circle-outline"
              size={46}
              color="#2E7D32"
            />

            <Text style={styles.emptyTitle}>
              No Fines Recorded
            </Text>

            <Text style={styles.emptyText}>
              There are currently no traffic fines associated with
              your account.
            </Text>
          </View>
        ) : (
          fines.map((fine) => (
            <View key={fine.id} style={styles.fineCard}>
              {/* FINE HEADER */}
              <View style={styles.fineHeader}>
                <View style={styles.fineHeading}>
                  <View
                    style={[
                      styles.fineIcon,
                      fine.status === "Paid" &&
                        styles.paidBackground,
                      fine.status === "Overdue" &&
                        styles.overdueBackground,
                    ]}
                  >
                    <MaterialIcons
                      name={getStatusIcon(fine.status)}
                      size={21}
                      color={
                        fine.status === "Paid"
                          ? "#2E7D32"
                          : fine.status === "Overdue"
                          ? "#C62828"
                          : "#003366"
                      }
                    />
                  </View>

                  <View style={styles.fineTitleContainer}>
                    <Text style={styles.fineTitle}>
                      {fine.offence}
                    </Text>

                    <Text style={styles.reference}>
                      {fine.reference}
                    </Text>
                  </View>
                </View>

                {/* STATUS */}
                <View
                  style={[
                    styles.badge,
                    fine.status === "Paid" &&
                      styles.paidBadge,
                    fine.status === "Overdue" &&
                      styles.overdueBadge,
                    fine.status === "Outstanding" &&
                      styles.outstandingBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      fine.status === "Paid" &&
                        styles.paidText,
                      fine.status === "Overdue" &&
                        styles.overdueText,
                      fine.status === "Outstanding" &&
                        styles.outstandingText,
                    ]}
                  >
                    {fine.status}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* DETAILS */}
              <View style={styles.details}>
                <View style={styles.detail}>
                  <Text style={styles.detailLabel}>
                    Date
                  </Text>

                  <Text style={styles.detailValue}>
                    {fine.date}
                  </Text>
                </View>

                <View style={styles.detail}>
                  <Text style={styles.detailLabel}>
                    Location
                  </Text>

                  <Text
                    style={styles.detailValue}
                    numberOfLines={1}
                  >
                    {fine.location}
                  </Text>
                </View>
              </View>

              {/* VEHICLE */}
              {fine.vehicleRegistration && (
                <View style={styles.vehicleRow}>
                  <MaterialIcons
                    name="directions-car"
                    size={18}
                    color="#777"
                  />

                  <Text style={styles.vehicleText}>
                    Vehicle: {fine.vehicleRegistration}
                  </Text>
                </View>
              )}

              {/* AMOUNT */}
              <View style={styles.amountBox}>
                <Text style={styles.amountBoxLabel}>
                  Fine Amount
                </Text>

                <Text style={styles.amountBoxValue}>
                  {formatCurrency(fine.amount)}
                </Text>
              </View>

              {/* ACTION */}
              {fine.status !== "Paid" && (
                <TouchableOpacity
                  style={styles.payButton}
                  activeOpacity={0.8}
                  onPress={() =>
                    console.log(
                      "Pay fine:",
                      fine.reference
                    )
                  }
                >
                  <Text style={styles.payButtonText}>
                    Pay Fine
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              )}

              {fine.status === "Paid" && (
                <View style={styles.paidConfirmation}>
                  <MaterialIcons
                    name="check-circle"
                    size={18}
                    color="#2E7D32"
                  />

                  <Text style={styles.paidConfirmationText}>
                    Payment completed
                  </Text>
                </View>
              )}
            </View>
          ))
        )}

        {/* FOOTER */}
        <View style={styles.footer}>
          <MaterialIcons
            name="lock-outline"
            size={17}
            color="#777"
          />

          <Text style={styles.footerText}>
            Your traffic fine information is securely associated with
            your account.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  content: {
    padding: 16,
    paddingBottom: 35,
  },

  /* HEADER */

  header: {
    marginTop: 8,
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#003366",
    marginBottom: 6,
  },

  subtitle: {
    color: "#666",
    fontSize: 14,
    lineHeight: 21,
  },

  /* TOTAL CARD */

  totalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 19,
    marginBottom: 22,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  totalIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#EAF1F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  totalLabel: {
    color: "#777",
    fontSize: 13,
  },

  totalNumber: {
    fontSize: 30,
    fontWeight: "800",
    color: "#003366",
    marginTop: 2,
  },

  totalDescription: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },

  totalDivider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 16,
  },

  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  amountRight: {
    alignItems: "flex-end",
  },

  amountLabel: {
    color: "#888",
    fontSize: 11,
    marginBottom: 4,
  },

  amountValue: {
    color: "#222",
    fontWeight: "700",
    fontSize: 15,
  },

  outstandingAmount: {
    color: "#C62828",
    fontWeight: "800",
    fontSize: 15,
  },

  /* SECTION */

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#003366",
  },

  countText: {
    color: "#777",
    fontSize: 12,
  },

  /* STATUS */

  statusGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },

  statusCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 13,
  },

  paidIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EAF6EC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 9,
  },

  pendingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFF4E5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 9,
  },

  overdueIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FDECEC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 9,
  },

  statusNumber: {
    fontSize: 21,
    fontWeight: "800",
    color: "#003366",
  },

  redText: {
    color: "#C62828",
  },

  statusLabel: {
    color: "#777",
    fontSize: 11,
    marginTop: 2,
  },

  statusAmount: {
    color: "#333",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 7,
  },

  /* INFO */

  infoCard: {
    backgroundColor: "#EAF1F7",
    borderRadius: 13,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },

  infoText: {
    flex: 1,
    marginLeft: 9,
    color: "#4D5D6B",
    fontSize: 12,
    lineHeight: 18,
  },

  /* FINE CARD */

  fineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 13,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  fineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  fineHeading: {
    flexDirection: "row",
    flex: 1,
    marginRight: 8,
  },

  fineIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EAF1F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  paidBackground: {
    backgroundColor: "#EAF6EC",
  },

  overdueBackground: {
    backgroundColor: "#FDECEC",
  },

  fineTitleContainer: {
    flex: 1,
  },

  fineTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#222",
    marginTop: 2,
  },

  reference: {
    color: "#888",
    fontSize: 10,
    marginTop: 4,
  },

  badge: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  paidBadge: {
    backgroundColor: "#EAF6EC",
  },

  outstandingBadge: {
    backgroundColor: "#FFF4E5",
  },

  overdueBadge: {
    backgroundColor: "#FDECEC",
  },

  badgeText: {
    fontSize: 9,
    fontWeight: "800",
  },

  paidText: {
    color: "#2E7D32",
  },

  outstandingText: {
    color: "#B26A00",
  },

  overdueText: {
    color: "#C62828",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 14,
  },

  /* DETAILS */

  details: {
    flexDirection: "row",
    marginBottom: 13,
  },

  detail: {
    flex: 1,
  },

  detailLabel: {
    color: "#888",
    fontSize: 10,
    marginBottom: 4,
  },

  detailValue: {
    color: "#333",
    fontSize: 12,
    fontWeight: "600",
    paddingRight: 8,
  },

  /* VEHICLE */

  vehicleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },

  vehicleText: {
    color: "#666",
    fontSize: 12,
    marginLeft: 7,
  },

  /* AMOUNT */

  amountBox: {
    backgroundColor: "#F7F8FA",
    borderRadius: 11,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  amountBoxLabel: {
    color: "#777",
    fontSize: 12,
  },

  amountBoxValue: {
    color: "#003366",
    fontSize: 16,
    fontWeight: "800",
  },

  /* PAY */

  payButton: {
    backgroundColor: "#003366",
    borderRadius: 11,
    minHeight: 44,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  payButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    marginRight: 8,
  },

  /* PAID */

  paidConfirmation: {
    backgroundColor: "#EAF6EC",
    borderRadius: 11,
    minHeight: 44,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  paidConfirmationText: {
    color: "#2E7D32",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 6,
  },

  /* EMPTY */

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
  },

  emptyTitle: {
    color: "#222",
    fontSize: 17,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 6,
  },

  emptyText: {
    color: "#777",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },

  /* FOOTER */

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  footerText: {
    color: "#777",
    fontSize: 10,
    marginLeft: 5,
    textAlign: "center",
  },
});
