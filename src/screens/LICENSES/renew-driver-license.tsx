
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase";
import { doc, updateDoc, setDoc } from "firebase/firestore";

export default function RenewDriverLicenseScreen() {
  const { user } = useAuth();

  const licence = user?.driverLicense;

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState(
    (user as any)?.address ?? ""
  );
  const [postalAddress, setPostalAddress] = useState(
    (user as any)?.postalAddress ?? ""
  );
  const [emergencyContact, setEmergencyContact] = useState(
    (user as any)?.emergencyContact ?? ""
  );
  const [medicalConditions, setMedicalConditions] = useState(
    (user as any)?.medicalConditions ?? ""
  );
  const [organDonor, setOrganDonor] = useState(
    (user as any)?.organDonor ? "Yes" : "No"
  );
  const [collectionCentre, setCollectionCentre] = useState(
    user?.collection?.location ?? ""
  );

  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0F172A" />
        <Text style={styles.loadingText}>
          Loading your licence information...
        </Text>
      </View>
    );
  }

  const expired =
    !!licence?.expiryDate &&
    new Date(licence.expiryDate) <= new Date();

  async function saveChanges() {
    try {
      setSaving(true);

      await updateDoc(doc(db, "citizens", user.idNumber!), {
        fullName,
        phone,
        address,
        postalAddress,
        emergencyContact,
        medicalConditions,
        organDonor: organDonor === "Yes",
        "collection.location": collectionCentre,
      });

      Alert.alert(
        "Information Saved",
        "Your personal information has been successfully updated."
      );
    } catch (e) {
      console.log(e);

      Alert.alert(
        "Update Failed",
        "We could not save your information. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function submitRenewal() {
    if (!fullName.trim() || !phone.trim()) {
      Alert.alert(
        "Missing Information",
        "Please make sure your full name and phone number are completed."
      );
      return;
    }

    try {
      setSubmitting(true);

      await setDoc(
        doc(db, "renewalRequests", user.idNumber!),
        {
          citizenId: user.idNumber,
          fullName,
          phone,
          submittedAt: new Date().toISOString(),
          status: "Pending",

          licence: {
            number: licence?.number,
            class: licence?.class,
            issueDate: licence?.issueDate,
            expiryDate: licence?.expiryDate,
          },

          updatedInformation: {
            address,
            postalAddress,
            emergencyContact,
            medicalConditions,
            organDonor: organDonor === "Yes",
            collectionCentre,
          },
        }
      );

      Alert.alert(
        "Application Submitted",
        "Your driver's licence renewal application has been submitted successfully."
      );
    } catch (e) {
      console.log(e);

      Alert.alert(
        "Submission Failed",
        "We were unable to submit your renewal application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <MaterialIcons
              name="badge"
              size={28}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.headerText}>
            <Text style={styles.title}>
              Renew Driver Licence
            </Text>

            <Text style={styles.subtitle}>
              Review your information before submitting your renewal.
            </Text>
          </View>
        </View>

        {/* =====================================================
            LICENCE STATUS
        ===================================================== */}

        <View
          style={[
            styles.statusCard,
            expired
              ? styles.statusExpired
              : styles.statusValid,
          ]}
        >
          <View
            style={[
              styles.statusIcon,
              expired
                ? styles.statusIconExpired
                : styles.statusIconValid,
            ]}
          >
            <MaterialIcons
              name={expired ? "warning" : "verified"}
              size={25}
              color={expired ? "#DC2626" : "#15803D"}
            />
          </View>

          <View style={styles.statusContent}>
            <Text
              style={[
                styles.statusTitle,
                {
                  color: expired
                    ? "#991B1B"
                    : "#166534",
                },
              ]}
            >
              {expired
                ? "Licence Expired"
                : "Licence Valid"}
            </Text>

            <Text style={styles.statusDescription}>
              {expired
                ? "Your driver's licence has expired. You can submit your renewal application below."
                : "Your driver's licence is currently valid. You can still review your details and prepare your renewal."}
            </Text>
          </View>
        </View>

        {/* =====================================================
            CURRENT LICENCE
        ===================================================== */}

        <SectionHeader
          icon="card-membership"
          title="Current Licence"
          description="Your existing licence information"
        />

        <View style={styles.licenceCard}>
          <View style={styles.licenceTop}>
            <View>
              <Text style={styles.licenceLabel}>
                LICENCE NUMBER
              </Text>

              <Text style={styles.licenceNumber}>
                {licence?.number || "Not available"}
              </Text>
            </View>

            <View style={styles.classBadge}>
              <Text style={styles.classBadgeLabel}>
                CLASS
              </Text>

              <Text style={styles.classBadgeValue}>
                {licence?.class || "—"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.licenceDetails}>
            <InfoRow
              icon="event"
              label="Issue Date"
              value={licence?.issueDate || "Not available"}
            />

            <InfoRow
              icon="event-busy"
              label="Expiry Date"
              value={licence?.expiryDate || "Not available"}
            />
          </View>
        </View>

        {/* =====================================================
            PERSONAL INFORMATION
        ===================================================== */}

        <SectionHeader
          icon="person-outline"
          title="Personal Information"
          description="Make sure your details are correct"
        />

        <View style={styles.formCard}>
          <InputField
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            icon="person-outline"
            placeholder="Enter your full name"
          />

          <InputField
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            icon="call-outline"
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />

          <InputField
            label="Residential Address"
            value={address}
            onChangeText={setAddress}
            icon="location-outline"
            placeholder="Enter your residential address"
            multiline
          />

          <InputField
            label="Postal Address"
            value={postalAddress}
            onChangeText={setPostalAddress}
            icon="mail-outline"
            placeholder="Enter your postal address"
            multiline
          />
        </View>

        {/* =====================================================
            ADDITIONAL INFORMATION
        ===================================================== */}

        <SectionHeader
          icon="medical-information"
          title="Additional Information"
          description="Information required for your renewal"
        />

        <View style={styles.formCard}>
          <InputField
            label="Emergency Contact"
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            icon="contact-phone"
            placeholder="Enter emergency contact"
            keyboardType="phone-pad"
          />

          <InputField
            label="Medical Conditions"
            value={medicalConditions}
            onChangeText={setMedicalConditions}
            icon="medical-services"
            placeholder="Enter any relevant medical conditions"
            multiline
          />

          {/* ORGAN DONOR */}

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              Organ Donor
            </Text>

            <View style={styles.optionRow}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  organDonor === "Yes" &&
                    styles.optionButtonActive,
                ]}
                onPress={() => setOrganDonor("Yes")}
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name={
                    organDonor === "Yes"
                      ? "radio-button-checked"
                      : "radio-button-unchecked"
                  }
                  size={20}
                  color={
                    organDonor === "Yes"
                      ? "#FFFFFF"
                      : "#64748B"
                  }
                />

                <Text
                  style={[
                    styles.optionText,
                    organDonor === "Yes" &&
                      styles.optionTextActive,
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  organDonor === "No" &&
                    styles.optionButtonActive,
                ]}
                onPress={() => setOrganDonor("No")}
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name={
                    organDonor === "No"
                      ? "radio-button-checked"
                      : "radio-button-unchecked"
                  }
                  size={20}
                  color={
                    organDonor === "No"
                      ? "#FFFFFF"
                      : "#64748B"
                  }
                />

                <Text
                  style={[
                    styles.optionText,
                    organDonor === "No" &&
                      styles.optionTextActive,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <InputField
            label="Preferred Collection Centre"
            value={collectionCentre}
            onChangeText={setCollectionCentre}
            icon="location-city"
            placeholder="Enter preferred collection centre"
          />
        </View>

        {/* =====================================================
            IMPORTANT NOTICE
        ===================================================== */}

        <View style={styles.noticeCard}>
          <View style={styles.noticeIcon}>
            <Ionicons
              name="information"
              size={18}
              color="#1D4ED8"
            />
          </View>

          <View style={styles.noticeContent}>
            <Text style={styles.noticeTitle}>
              Before you submit
            </Text>

            <Text style={styles.noticeText}>
              Please check that all your personal information
              is accurate. Incorrect information may delay the
              processing of your renewal application.
            </Text>
          </View>
        </View>

        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && styles.disabledButton,
          ]}
          onPress={saveChanges}
          disabled={saving || submitting}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color="#0F172A" />
          ) : (
            <>
              <MaterialIcons
                name="save"
                size={20}
                color="#0F172A"
              />

              <Text style={styles.saveButtonText}>
                Save Changes
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            submitting && styles.disabledSubmitButton,
          ]}
          onPress={submitRenewal}
          disabled={saving || submitting}
          activeOpacity={0.85}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <MaterialIcons
                name="send"
                size={20}
                color="#FFFFFF"
              />

              <Text style={styles.submitButtonText}>
                Submit Renewal Application
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          By submitting, you confirm that the information
          provided is accurate and up to date.
        </Text>
      </ScrollView>
    </View>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIcon}>
        <MaterialIcons
          name={icon}
          size={20}
          color="#0F172A"
        />
      </View>

      <View style={styles.sectionHeaderText}>
        <Text style={styles.sectionTitle}>
          {title}
        </Text>

        <Text style={styles.sectionDescription}>
          {description}
        </Text>
      </View>
    </View>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  label,
  value,
  onChangeText,
  icon,
  placeholder,
  keyboardType,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: keyof typeof Ionicons.glyphMap | keyof typeof MaterialIcons.glyphMap;
  placeholder: string;
  keyboardType?: "default" | "phone-pad" | "email-address";
  multiline?: boolean;
}) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>
        {label}
      </Text>

      <View
        style={[
          styles.inputWrapper,
          multiline && styles.multilineWrapper,
        ]}
      >
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={19}
          color="#64748B"
          style={styles.inputIcon}
        />

        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          keyboardType={keyboardType}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
        />
      </View>
    </View>
  );
}

/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoRowIcon}>
        <MaterialIcons
          name={icon}
          size={18}
          color="#64748B"
        />
      </View>

      <View style={styles.infoRowText}>
        <Text style={styles.infoRowLabel}>
          {label}
        </Text>

        <Text style={styles.infoRowValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 20,
    paddingBottom: 45,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: "#64748B",
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  headerIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: "#64748B",
  },

  /* STATUS */

  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    marginBottom: 26,
    borderWidth: 1,
  },

  statusValid: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },

  statusExpired: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },

  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  statusIconValid: {
    backgroundColor: "#DCFCE7",
  },

  statusIconExpired: {
    backgroundColor: "#FEE2E2",
  },

  statusContent: {
    flex: 1,
  },

  statusTitle: {
    fontSize: 15,
    fontWeight: "800",
  },

  statusDescription: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 17,
    color: "#64748B",
  },

  /* SECTION */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  sectionHeaderText: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },

  sectionDescription: {
    marginTop: 2,
    fontSize: 11,
    color: "#64748B",
  },

  /* LICENCE CARD */

  licenceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  licenceTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  licenceLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.8,
  },

  licenceNumber: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },

  classBadge: {
    minWidth: 58,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 11,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },

  classBadgeLabel: {
    fontSize: 8,
    fontWeight: "800",
    color: "#94A3B8",
  },

  classBadgeValue: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 16,
  },

  licenceDetails: {
    flexDirection: "row",
  },

  infoRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  infoRowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  infoRowText: {
    flex: 1,
  },

  infoRowLabel: {
    fontSize: 9,
    color: "#94A3B8",
    fontWeight: "700",
  },

  infoRowValue: {
    marginTop: 2,
    fontSize: 11,
    color: "#334155",
    fontWeight: "700",
  },

  /* FORM */

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  fieldContainer: {
    marginBottom: 17,
  },

  fieldContainerLast: {
    marginBottom: 0,
  },

  fieldLabel: {
    marginBottom: 7,
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },

  inputWrapper: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
  },

  multilineWrapper: {
    alignItems: "flex-start",
    paddingTop: 13,
  },

  inputIcon: {
    marginLeft: 13,
    marginRight: 8,
  },

  input: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 4,
    paddingRight: 12,
    fontSize: 13,
    color: "#0F172A",
  },

  multilineInput: {
    minHeight: 85,
    paddingTop: 0,
  },

  /* OPTIONS */

  optionRow: {
    flexDirection: "row",
    gap: 10,
  },

  optionButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  optionButtonActive: {
    backgroundColor: "#0F172A",
    borderColor: "#0F172A",
  },

  optionText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },

  optionTextActive: {
    color: "#FFFFFF",
  },

  /* NOTICE */

  noticeCard: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
    marginBottom: 20,
  },

  noticeIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  noticeContent: {
    flex: 1,
  },

  noticeTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1E3A8A",
  },

  noticeText: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 17,
    color: "#475569",
  },

  /* BUTTONS */

  saveButton: {
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  saveButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },

  submitButton: {
    minHeight: 56,
    marginTop: 11,
    borderRadius: 14,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 9,
  },

  submitButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  disabledButton: {
    opacity: 0.6,
  },

  disabledSubmitButton: {
    opacity: 0.65,
  },

  footerText: {
    marginTop: 14,
    paddingHorizontal: 10,
    textAlign: "center",
    fontSize: 10,
    lineHeight: 15,
    color: "#94A3B8",
  },
});

