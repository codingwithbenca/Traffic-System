import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
} from "react-native-reanimated";

import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext";

export default function DriverLicenseCard() {
  const [expanded, setExpanded] = useState(false);

  const { user } = useAuth();

  /*
   * =========================================================
   * USER DATA FROM AUTH CONTEXT
   * =========================================================
   */

  const license = user?.driverLicense;

  const fullName = user?.fullName || "Citizen";

  const idNumber = user?.idNumber || "Not available";

  const profilePhoto = user?.profilePhoto;

  const licenseNumber = license?.number || "Not available";

  const licenseStatus = license?.status || "UNKNOWN";

  const licenseClass = license?.class || "Not available";

  const issueDate = license?.issueDate || "Not available";

  const expiryDate = license?.expiryDate || "Not available";

  const cardNumber = license?.cardNumber || "Not available";

  const digitalLicense = user?.digitalLicense;

  /*
   * =========================================================
   * STATUS
   * =========================================================
   */

  const isValid =
    licenseStatus.toLowerCase() === "valid" ||
    licenseStatus.toLowerCase() === "active";

  const statusText = isValid ? "VALID" : licenseStatus.toUpperCase();

  return (
    <Animated.View
      layout={Layout.springify()}
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(200)}
      style={styles.container}
    >
      {/* =====================================================
          COLLAPSED SUMMARY
      ===================================================== */}

      <TouchableOpacity
        style={styles.summary}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.85}
      >
        <View style={styles.summaryRow}>
          <View style={styles.summaryIcon}>
            <MaterialIcons
              name="badge"
              size={23}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.summaryInformation}>
            <View style={styles.titleRow}>
              <Text style={styles.summaryTitle}>
                Driver Licence
              </Text>

              <View
                style={[
                  styles.validBadge,
                  !isValid && styles.invalidBadge,
                ]}
              >
                <View
                  style={[
                    styles.validDot,
                    !isValid && styles.invalidDot,
                  ]}
                />

                <Text
                  style={[
                    styles.validText,
                    !isValid && styles.invalidText,
                  ]}
                >
                  {statusText}
                </Text>
              </View>
            </View>

            <Text style={styles.summarySubtitle}>
              {isValid
                ? `Valid • Expires ${expiryDate}`
                : `Status • ${statusText}`}
            </Text>

            <Text style={styles.summaryMeta}>
              Code {licenseClass} • {licenseNumber}
            </Text>
          </View>

          <View style={styles.expandButton}>
            <Ionicons
              name={
                expanded
                  ? "chevron-up"
                  : "chevron-down"
              }
              size={18}
              color={COLORS.primary}
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* =====================================================
          DIGITAL LICENCE
      ===================================================== */}

      {expanded && (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={styles.licenceWrapper}
        >
          {/* =================================================
              GOVERNMENT HEADER
          ================================================= */}

          <View style={styles.licenceHeader}>
            <View style={styles.govIcon}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={25}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.govInformation}>
              <Text style={styles.govCountry}>
                REPUBLIC OF SOUTH AFRICA
              </Text>

              <Text style={styles.govDepartment}>
                DEPARTMENT OF TRANSPORT
              </Text>
            </View>

            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>
                DIGITAL
              </Text>
            </View>
          </View>

          {/* =================================================
              LICENCE TITLE
          ================================================= */}

          <View style={styles.licenceTitleSection}>
            <View>
              <Text style={styles.licenceEyebrow}>
                OFFICIAL DOCUMENT
              </Text>

              <Text style={styles.licenceTitle}>
                Driver Licence
              </Text>
            </View>

            <View
              style={[
                styles.statusLarge,
                !isValid && styles.invalidStatusLarge,
              ]}
            >
              <View
                style={[
                  styles.statusLargeDot,
                  !isValid && styles.invalidDot,
                ]}
              />

              <Text
                style={[
                  styles.statusLargeText,
                  !isValid && styles.invalidText,
                ]}
              >
                {statusText}
              </Text>
            </View>
          </View>

          {/* =================================================
              PROFILE
          ================================================= */}

          <View style={styles.profileSection}>
            {profilePhoto ? (
              <Image
                source={{ uri: profilePhoto }}
                style={styles.photo}
              />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoInitial}>
                  {fullName
                    .split(" ")
                    .map((name) => name.charAt(0))
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()}
                </Text>
              </View>
            )}

            <View style={styles.profileInformation}>
              <Text style={styles.profileLabel}>
                LICENCE HOLDER
              </Text>

              <Text style={styles.name}>
                {fullName}
              </Text>

              <Text style={styles.profileSecondary}>
                South African Driver
              </Text>
            </View>
          </View>

          {/* =================================================
              LICENCE NUMBER
          ================================================= */}

          <View style={styles.licenceNumberCard}>
            <View>
              <Text style={styles.detailLabel}>
                LICENCE NUMBER
              </Text>

              <Text style={styles.licenceNumber}>
                {licenseNumber}
              </Text>
            </View>

            <MaterialIcons
              name="verified"
              size={24}
              color={COLORS.primary}
            />
          </View>

          {/* =================================================
              INFORMATION GRID
          ================================================= */}

          <View style={styles.detailsSection}>
            <Text style={styles.sectionLabel}>
              LICENCE INFORMATION
            </Text>

            <View style={styles.detailsGrid}>
              <Detail
                label="ID NUMBER"
                value={idNumber}
              />

              <Detail
                label="DRIVING CODE"
                value={licenseClass}
              />

              <Detail
                label="ISSUE DATE"
                value={issueDate}
              />

              <Detail
                label="EXPIRY DATE"
                value={expiryDate}
                valueColor={
                  isValid
                    ? COLORS.success
                    : COLORS.danger
                }
              />

              <Detail
                label="CARD NUMBER"
                value={cardNumber}
              />
            </View>
          </View>

          {/* =================================================
              VERIFICATION
          ================================================= */}

          <View style={styles.verificationSection}>
            <View style={styles.verificationHeader}>
              <View>
                <Text style={styles.sectionLabel}>
                  DIGITAL VERIFICATION
                </Text>

                <Text style={styles.verificationTitle}>
                  Scan to verify licence
                </Text>
              </View>

              <View style={styles.secureBadge}>
                <Ionicons
                  name="shield-checkmark"
                  size={14}
                  color={COLORS.success}
                />

                <Text style={styles.secureText}>
                  SECURE
                </Text>
              </View>
            </View>

            <View style={styles.qrContainer}>
              <View style={styles.qrBox}>
                <Ionicons
                  name="qr-code-outline"
                  size={82}
                  color={COLORS.primaryDark}
                />
              </View>

              <View style={styles.qrInformation}>
                <Text style={styles.qrTitle}>
                  Verification Code
                </Text>

                <Text style={styles.qrCode}>
                  {digitalLicense?.qrToken ||
                    "Verification unavailable"}
                </Text>

                <Text style={styles.qrDescription}>
                  Scan this code to verify the
                  authenticity and current status
                  of this digital licence.
                </Text>
              </View>
            </View>
          </View>

          {/* =================================================
              VERIFIED NOTICE
          ================================================= */}

          <View style={styles.verificationNotice}>
            <Ionicons
              name={
                isValid
                  ? "checkmark-circle"
                  : "alert-circle"
              }
              size={18}
              color={
                isValid
                  ? COLORS.success
                  : COLORS.danger
              }
            />

            <View style={styles.noticeInformation}>
              <Text
                style={[
                  styles.noticeTitle,
                  !isValid && {
                    color: COLORS.danger,
                  },
                ]}
              >
                {isValid
                  ? "Licence verified"
                  : "Licence requires attention"}
              </Text>

              <Text style={styles.noticeDescription}>
                {isValid
                  ? "Digital record is active and valid."
                  : "Please check your licence status."}
              </Text>
            </View>

            <Text style={styles.noticeDate}>
              {digitalLicense?.lastGenerated
                ? formatDate(
                    digitalLicense.lastGenerated
                  )
                : "Not available"}
            </Text>
          </View>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.8}
            >
              <Ionicons
                name="download-outline"
                size={19}
                color={COLORS.primary}
              />

              <Text style={styles.secondaryButtonText}>
                Download
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
            >
              <Ionicons
                name="share-social-outline"
                size={19}
                color="#FFFFFF"
              />

              <Text style={styles.primaryButtonText}>
                Share Licence
              </Text>
            </TouchableOpacity>
          </View>

          {/* =================================================
              FOOTER
          ================================================= */}

          <View style={styles.footer}>
            <Ionicons
              name="information-circle-outline"
              size={15}
              color={COLORS.textLight}
            />

            <Text style={styles.footerText}>
              This digital licence is linked to your
              registered citizen profile.
            </Text>
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}

/* =========================================================
   DETAIL COMPONENT
========================================================= */

function Detail({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>
        {label}
      </Text>

      <Text
        style={[
          styles.detailValue,
          valueColor && {
            color: valueColor,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

/* =========================================================
   DATE FORMATTER
========================================================= */

function formatDate(value: string) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   COLOURS
========================================================= */

const COLORS = {
  primary: "#0B4F8A",
  primaryDark: "#083B68",

  background: "#F3F5F7",
  white: "#FFFFFF",

  text: "#17212B",
  textLight: "#66737F",

  border: "#D9E0E6",

  success: "#18794E",
  danger: "#B42318",

  softBlue: "#EAF3FA",
  softGreen: "#ECFDF3",
};

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },

  summary: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 13,
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 9,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryInformation: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  summaryTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
  },

  validBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.softGreen,
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 4,
    marginLeft: 8,
  },

  invalidBadge: {
    backgroundColor: "#FEF3F2",
  },

  validDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginRight: 4,
  },

  invalidDot: {
    backgroundColor: COLORS.danger,
  },

  validText: {
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.success,
  },

  invalidText: {
    color: COLORS.danger,
  },

  summarySubtitle: {
    marginTop: 4,
    fontSize: 10,
    color: COLORS.textLight,
  },

  summaryMeta: {
    marginTop: 3,
    fontSize: 9,
    color: "#87929C",
  },

  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },

  licenceWrapper: {
    marginTop: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    overflow: "hidden",
  },

  licenceHeader: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 15,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  govIcon: {
    width: 39,
    height: 39,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  govInformation: {
    flex: 1,
  },

  govCountry: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  govDepartment: {
    marginTop: 3,
    color: "#C9D9E7",
    fontSize: 8,
    fontWeight: "600",
    letterSpacing: 0.4,
  },

  headerBadge: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },

  headerBadgeText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "800",
  },

  licenceTitleSection: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  licenceEyebrow: {
    fontSize: 8,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 0.7,
  },

  licenceTitle: {
    marginTop: 2,
    fontSize: 19,
    fontWeight: "900",
    color: COLORS.text,
  },

  statusLarge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.softGreen,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  invalidStatusLarge: {
    backgroundColor: "#FEF3F2",
  },

  statusLargeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginRight: 5,
  },

  statusLargeText: {
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.success,
  },

  profileSection: {
    marginHorizontal: 15,
    padding: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  photo: {
    width: 68,
    height: 68,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  photoPlaceholder: {
    width: 68,
    height: 68,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  photoInitial: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "900",
  },

  profileInformation: {
    flex: 1,
    marginLeft: 12,
  },

  profileLabel: {
    fontSize: 8,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 0.6,
  },

  name: {
    marginTop: 3,
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.text,
  },

  profileSecondary: {
    marginTop: 3,
    fontSize: 9,
    color: COLORS.textLight,
  },

  licenceNumberCard: {
    marginHorizontal: 15,
    marginTop: 10,
    padding: 12,
    backgroundColor: COLORS.softBlue,
    borderWidth: 1,
    borderColor: "#C7DDED",
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  detailLabel: {
    fontSize: 8,
    fontWeight: "800",
    color: COLORS.textLight,
    letterSpacing: 0.5,
  },

  licenceNumber: {
    marginTop: 3,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.8,
    color: COLORS.primaryDark,
  },

  detailsSection: {
    marginHorizontal: 15,
    marginTop: 16,
  },

  sectionLabel: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.7,
    color: COLORS.primary,
  },

  detailsGrid: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: COLORS.border,
  },

  detail: {
    width: "50%",
    padding: 10,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },

  detailValue: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.text,
  },

  verificationSection: {
    marginHorizontal: 15,
    marginTop: 16,
    padding: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
  },

  verificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  verificationTitle: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.text,
  },

  secureBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.softGreen,
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },

  secureText: {
    marginLeft: 4,
    fontSize: 7,
    fontWeight: "900",
    color: COLORS.success,
  },

  qrContainer: {
    marginTop: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  qrBox: {
    width: 96,
    height: 96,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },

  qrInformation: {
    flex: 1,
    marginLeft: 12,
  },

  qrTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.text,
  },

  qrCode: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 0.5,
  },

  qrDescription: {
    marginTop: 6,
    fontSize: 9,
    lineHeight: 14,
    color: COLORS.textLight,
  },

  verificationNotice: {
    marginHorizontal: 15,
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#CFE8D9",
    backgroundColor: COLORS.softGreen,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  noticeInformation: {
    flex: 1,
    marginLeft: 8,
  },

  noticeTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.success,
  },

  noticeDescription: {
    marginTop: 2,
    fontSize: 8,
    color: COLORS.textLight,
  },

  noticeDate: {
    fontSize: 8,
    color: COLORS.textLight,
  },

  actions: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginTop: 12,
  },

  secondaryButton: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
    backgroundColor: COLORS.white,
  },

  secondaryButtonText: {
    marginLeft: 7,
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.primary,
  },

  primaryButton: {
    flex: 1.35,
    height: 42,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
    backgroundColor: COLORS.primary,
  },

  primaryButtonText: {
    marginLeft: 7,
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.white,
  },

  footer: {
    paddingHorizontal: 15,
    paddingTop: 11,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  footerText: {
    flex: 1,
    marginLeft: 6,
    fontSize: 8,
    lineHeight: 13,
    color: COLORS.textLight,
  },
});