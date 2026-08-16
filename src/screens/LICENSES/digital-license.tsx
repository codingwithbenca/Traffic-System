
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import * as ScreenOrientation from "expo-screen-orientation";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../../context/AuthContext";

export default function DigitalLicenseScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();

  /*
   * =========================================================
   * FORCE THIS SCREEN INTO LANDSCAPE
   * =========================================================
   */

  useEffect(() => {
    const enableLandscape = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } catch (error) {
        console.log("Could not lock landscape:", error);
      }
    };

    enableLandscape();

    /*
     * When leaving this screen,
     * return the application to portrait.
     */
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      ).catch((error) => {
        console.log("Could not restore portrait:", error);
      });
    };
  }, []);

  /*
   * =========================================================
   * USER LOADING
   * =========================================================
   */

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar hidden />

        <MaterialIcons
          name="credit-card"
          size={45}
          color="#003366"
        />

        <Text style={styles.loadingText}>
          Loading digital licence...
        </Text>
      </View>
    );
  }

  /*
   * =========================================================
   * LICENCE DATA
   * =========================================================
   */

  const fullName = user.fullName ?? "";

  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map((x) => x[0])
      .join("")
      .toUpperCase() || "--";

  const licenseNumber =
    user.driverLicense?.number ?? "N/A";

  const licenseCategory =
    user.driverLicense?.class ?? "N/A";

  const issueDate =
    user.driverLicense?.issueDate ?? "N/A";

  const expiryDate =
    user.driverLicense?.expiryDate ?? "N/A";

  const status =
    user.driverLicense?.status ?? "Unknown";

  const documentNumber =
    user.idNumber ?? "N/A";

  const gender =
    user.gender ?? "N/A";

  const birthDate =
    user.birthDate ?? "N/A";

  /*
   * QR INFORMATION
   */

  const qrValue = JSON.stringify({
    fullName,
    initials,
    licenseNumber,
    licenseCategory,
    expiryDate,
    status,
  });

  /*
   * =========================================================
   * SCREEN
   * =========================================================
   */

  return (
    <View style={styles.screen}>
      <StatusBar hidden />

      {/* =====================================================
          BACK BUTTON
      ===================================================== */}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Ionicons
          name="arrow-back"
          size={22}
          color="#FFFFFF"
        />

        <Text style={styles.backText}>
          Back
        </Text>
      </TouchableOpacity>

      {/* =====================================================
          LICENCE CARD
      ===================================================== */}

      <View style={styles.licenseCard}>

        {/* ===================================================
            HEADER
        =================================================== */}

        <View style={styles.header}>

          <View style={styles.headerLeft}>
            <View style={styles.govIcon}>
              <MaterialIcons
                name="account-balance"
                size={28}
                color="#FFFFFF"
              />
            </View>

            <View>
              <Text style={styles.department}>
                DEPARTMENT OF TRANSPORT
              </Text>

              <Text style={styles.country}>
                REPUBLIC OF SOUTH AFRICA
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <Ionicons
              name="shield-checkmark"
              size={18}
              color="#FFFFFF"
            />

            <Text style={styles.digitalText}>
              DIGITAL DRIVER'S LICENCE
            </Text>
          </View>
        </View>

        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <View style={styles.mainContent}>

          {/* ===============================================
              PROFILE
          =============================================== */}

          <View style={styles.profileSection}>

            <View style={styles.photo}>

              {user.profilePhoto ? (
                <MaterialIcons
                  name="person"
                  size={65}
                  color="#003366"
                />
              ) : (
                <MaterialIcons
                  name="person"
                  size={65}
                  color="#003366"
                />
              )}

            </View>

            <Text style={styles.initials}>
              {initials}
            </Text>

            <Text
              style={styles.fullName}
              numberOfLines={2}
            >
              {fullName || "Not Available"}
            </Text>

            <View
              style={[
                styles.statusBadge,
                status.toLowerCase() === "valid"
                  ? styles.valid
                  : styles.invalid,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  status.toLowerCase() === "valid"
                    ? styles.validDot
                    : styles.invalidDot,
                ]}
              />

              <Text
                style={[
                  styles.statusText,
                  status.toLowerCase() === "valid"
                    ? styles.validText
                    : styles.invalidText,
                ]}
              >
                {status.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* ===============================================
              DETAILS
          =============================================== */}

          <View style={styles.detailsSection}>

            <Text style={styles.sectionTitle}>
              DRIVER INFORMATION
            </Text>

            <View style={styles.detailsGrid}>

              <Info
                label="Licence Number"
                value={licenseNumber}
              />

              <Info
                label="Category"
                value={licenseCategory}
              />

              <Info
                label="ID / Document Number"
                value={documentNumber}
              />

              <Info
                label="Gender"
                value={gender}
              />

              <Info
                label="Date of Birth"
                value={birthDate}
              />

              <Info
                label="Issue Date"
                value={issueDate}
              />

              <Info
                label="Expiry Date"
                value={expiryDate}
              />

            </View>
          </View>

          {/* ===============================================
              QR CODE
          =============================================== */}

          <View style={styles.qrSection}>

            <View style={styles.qrContainer}>
              <QRCode
                value={qrValue}
                size={125}
                backgroundColor="#FFFFFF"
                color="#111111"
              />
            </View>

            <View style={styles.verifyRow}>
              <Ionicons
                name="shield-checkmark"
                size={16}
                color="#2E7D32"
              />

              <Text style={styles.verifyText}>
                VERIFIED
              </Text>
            </View>

            <Text style={styles.scanText}>
              Scan to verify
            </Text>
          </View>
        </View>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <View style={styles.footer}>

          <View style={styles.footerLeft}>

            <MaterialIcons
              name="verified-user"
              size={17}
              color="#003366"
            />

            <Text style={styles.footerText}>
              Government-issued digital credential
            </Text>

          </View>

          <Text style={styles.footerLicense}>
            Licence No. {licenseNumber}
          </Text>

          <Text style={styles.footerCountry}>
            SOUTH AFRICA
          </Text>
        </View>

      </View>
    </View>
  );
}

/*
 * =========================================================
 * INFORMATION COMPONENT
 * =========================================================
 */

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text
        style={styles.infoValue}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

/*
 * =========================================================
 * STYLES
 * =========================================================
 */

const styles = StyleSheet.create({

  /*
   * SCREEN
   */

  screen: {
    flex: 1,
    backgroundColor: "#111820",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  /*
   * BACK
   */

  backButton: {
    position: "absolute",
    top: 15,
    left: 18,
    zIndex: 20,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "rgba(0,0,0,0.55)",

    paddingHorizontal: 12,
    paddingVertical: 8,

    borderRadius: 20,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 5,
  },

  /*
   * LICENCE CARD
   */

  licenseCard: {
    width: "92%",
    maxWidth: 900,

    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    overflow: "hidden",

    elevation: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },

  /*
   * HEADER
   */

  header: {
    height: 68,

    backgroundColor: "#003366",

    paddingHorizontal: 22,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  govIcon: {
    width: 43,
    height: 43,

    borderRadius: 10,

    backgroundColor: "rgba(255,255,255,0.15)",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },

  department: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  country: {
    color: "#C9D8E8",
    fontSize: 9,
    marginTop: 3,
    letterSpacing: 0.8,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 13,
    paddingVertical: 8,

    borderRadius: 20,

    backgroundColor: "rgba(255,255,255,0.12)",
  },

  digitalText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    marginLeft: 6,
    letterSpacing: 0.5,
  },

  /*
   * MAIN
   */

  mainContent: {
    minHeight: 235,

    flexDirection: "row",

    paddingHorizontal: 22,
    paddingVertical: 18,
  },

  /*
   * PROFILE
   */

  profileSection: {
    width: "24%",

    alignItems: "center",
    justifyContent: "center",

    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",

    paddingRight: 18,
  },

  photo: {
    width: 88,
    height: 88,

    borderRadius: 12,

    backgroundColor: "#E8F1FB",

    borderWidth: 1,
    borderColor: "#D4E1ED",

    justifyContent: "center",
    alignItems: "center",
  },

  initials: {
    color: "#777",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 5,
  },

  fullName: {
    color: "#111827",

    fontSize: 17,
    fontWeight: "800",

    textAlign: "center",

    marginTop: 4,
  },

  /*
   * STATUS
   */

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,
    paddingVertical: 6,

    borderRadius: 20,

    marginTop: 9,
  },

  valid: {
    backgroundColor: "#E8F5E9",
  },

  invalid: {
    backgroundColor: "#FFF3E0",
  },

  statusDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    marginRight: 6,
  },

  validDot: {
    backgroundColor: "#2E7D32",
  },

  invalidDot: {
    backgroundColor: "#E65100",
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },

  validText: {
    color: "#2E7D32",
  },

  invalidText: {
    color: "#E65100",
  },

  /*
   * DETAILS
   */

  detailsSection: {
    flex: 1,

    paddingHorizontal: 22,

    justifyContent: "center",
  },

  sectionTitle: {
    color: "#7A8794",

    fontSize: 10,
    fontWeight: "800",

    letterSpacing: 1,

    marginBottom: 13,
  },

  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  infoItem: {
    width: "50%",

    marginBottom: 14,

    paddingRight: 15,
  },

  infoLabel: {
    color: "#7A8794",

    fontSize: 9,

    textTransform: "uppercase",

    marginBottom: 3,
  },

  infoValue: {
    color: "#17202A",

    fontSize: 13,

    fontWeight: "800",
  },

  /*
   * QR
   */

  qrSection: {
    width: "19%",

    minWidth: 130,

    borderLeftWidth: 1,
    borderLeftColor: "#E5E7EB",

    alignItems: "center",
    justifyContent: "center",

    paddingLeft: 15,
  },

  qrContainer: {
    padding: 7,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E1E5E9",

    borderRadius: 8,
  },

  verifyRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 8,
  },

  verifyText: {
    color: "#2E7D32",

    fontSize: 9,

    fontWeight: "800",

    marginLeft: 4,
  },

  scanText: {
    color: "#777",

    fontSize: 9,

    marginTop: 3,
  },

  /*
   * FOOTER
   */

  footer: {
    height: 42,

    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",

    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  footerText: {
    color: "#68727D",

    fontSize: 9,

    marginLeft: 6,
  },

  footerLicense: {
    color: "#68727D",

    fontSize: 9,

    fontWeight: "700",
  },

  footerCountry: {
    color: "#003366",

    fontSize: 9,

    fontWeight: "800",

    letterSpacing: 1,
  },

  /*
   * LOADING
   */

  loadingContainer: {
    flex: 1,

    backgroundColor: "#111820",

    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#FFFFFF",

    marginTop: 12,

    fontSize: 15,

    fontWeight: "600",
  },
});

