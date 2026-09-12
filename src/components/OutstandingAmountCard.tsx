
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

type Fine = {
  fineId?: string;
  offence?: string;
  amount?: number | string;
  status?: string;
};

type OutstandingAmountCardProps = {
  citizenId: string;
  onPress?: () => void;
};

export default function OutstandingAmountCard({
  citizenId,
  onPress,
}: OutstandingAmountCardProps) {
  const [total, setTotal] = useState(0);
  const [fineCount, setFineCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOutstandingFines();
  }, [citizenId]);

  const loadOutstandingFines = async () => {
    try {
      setLoading(true);

      const citizenRef = doc(db, "citizens", citizenId);
      const snapshot = await getDoc(citizenRef);

      if (!snapshot.exists()) {
        setTotal(0);
        setFineCount(0);
        return;
      }

      const data = snapshot.data();

      const fines: Fine[] = Array.isArray(data.fines)
        ? data.fines
        : [];

      const outstandingFines = fines.filter((fine) => {
        const status = String(
          fine.status ?? "Outstanding"
        ).toLowerCase();

        return (
          status === "outstanding" ||
          status === "unpaid" ||
          status === "overdue"
        );
      });

      const amount = outstandingFines.reduce(
        (sum, fine) => {
          const value =
            typeof fine.amount === "number"
              ? fine.amount
              : Number(fine.amount ?? 0);

          return sum + (Number.isFinite(value) ? value : 0);
        },
        0
      );

      setTotal(amount);
      setFineCount(outstandingFines.length);
    } catch (error) {
      console.error(
        "Failed to load outstanding fines:",
        error
      );

      setTotal(0);
      setFineCount(0);
    } finally {
      setLoading(false);
    }
  };

  const formattedAmount = total.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const hasOutstanding = total > 0;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={onPress}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <View style={styles.headerRow}>
        <View style={styles.iconBox}>
          <Ionicons
            name="wallet-outline"
            size={23}
            color={hasOutstanding ? "#B42318" : "#18794E"}
          />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            Outstanding fines
          </Text>

          <Text style={styles.subtitle}>
            Your current amount due
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            hasOutstanding
              ? styles.statusBadgeDanger
              : styles.statusBadgeSuccess,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              hasOutstanding
                ? styles.statusDotDanger
                : styles.statusDotSuccess,
            ]}
          />

          <Text
            style={[
              styles.statusBadgeText,
              hasOutstanding
                ? styles.statusTextDanger
                : styles.statusTextSuccess,
            ]}
          >
            {hasOutstanding ? "Due" : "Clear"}
          </Text>
        </View>
      </View>

      {/* =================================================
          AMOUNT
      ================================================= */}

      <View style={styles.amountSection}>
        <Text style={styles.amountLabel}>
          YOU OWE
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#0B4F8A"
            />
          </View>
        ) : (
          <View style={styles.amountRow}>
            <Text
              style={[
                styles.currency,
                hasOutstanding
                  ? styles.currencyDanger
                  : styles.currencySuccess,
              ]}
            >
              R
            </Text>

            <Text style={styles.amount}>
              {formattedAmount}
            </Text>
          </View>
        )}
      </View>

      {/* =================================================
          FOOTER
      ================================================= */}

      {!loading && (
        <View style={styles.footer}>
          <View style={styles.fineInfo}>
            <Ionicons
              name={
                hasOutstanding
                  ? "alert-circle-outline"
                  : "checkmark-circle-outline"
              }
              size={18}
              color={
                hasOutstanding
                  ? "#B42318"
                  : "#18794E"
              }
            />

            <Text style={styles.fineInfoText}>
              {hasOutstanding
                ? `${fineCount} ${
                    fineCount === 1
                      ? "outstanding penalty"
                      : "outstanding penalties"
                  }`
                : "You have no outstanding fines"}
            </Text>
          </View>

          {hasOutstanding && (
            <View style={styles.payButton}>
              <Text style={styles.payButtonText}>
                View & Pay
              </Text>

              <Ionicons
                name="arrow-forward"
                size={16}
                color="#FFFFFF"
              />
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  /* =====================================================
     CARD
  ===================================================== */

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 22,

    borderWidth: 1,
    borderColor: "#D9E0E6",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  }, 

  /* =====================================================
     HEADER
  ===================================================== */

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,

    backgroundColor: "#F2F6FA",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 13,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 17,
    fontWeight: "800",
    color: "#17212B",
  },

  subtitle: {
    marginTop: 3,
    fontSize: 13,
    color: "#66737F",
  },

  /* =====================================================
     STATUS
  ===================================================== */

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: 20,
  },

  statusBadgeDanger: {
    backgroundColor: "#FEF3F2",
  },

  statusBadgeSuccess: {
    backgroundColor: "#ECFDF3",
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 5,
  },

  statusDotDanger: {
    backgroundColor: "#B42318",
  },

  statusDotSuccess: {
    backgroundColor: "#18794E",
  },

  statusBadgeText: {
    fontSize: 12,
    fontWeight: "800",
  },

  statusTextDanger: {
    color: "#B42318",
  },

  statusTextSuccess: {
    color: "#18794E",
  },

  /* =====================================================
     AMOUNT
  ===================================================== */

  amountSection: {
    marginTop: 24,
    paddingBottom: 20,
  },

  amountLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#66737F",
    marginBottom: 5,
  },

  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  currency: {
    fontSize: 25,
    fontWeight: "800",
    marginRight: 5,
  },

  currencyDanger: {
    color: "#B42318",
  },

  currencySuccess: {
    color: "#18794E",
  },

  amount: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: "900",
    color: "#17212B",
    letterSpacing: -1,
  },

  loadingContainer: {
    height: 46,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  /* =====================================================
     FOOTER
  ===================================================== */

  footer: {
    borderTopWidth: 1,
    borderTopColor: "#EDF0F2",

    paddingTop: 15,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  fineInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },

  fineInfoText: {
    marginLeft: 7,
    fontSize: 12,
    color: "#66737F",
    fontWeight: "600",
  },

  payButton: {
    minHeight: 38,

    paddingHorizontal: 13,

    borderRadius: 10,

    backgroundColor: "#0B4F8A",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 6,
  },

  payButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
});

