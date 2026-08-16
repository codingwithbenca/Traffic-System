
import React, {
  useRef,
  useState,
  useEffect,
} from "react";

import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Linking,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { getDeviceInfo } from "../utils/device";
import { verifyUser } from "../services/authService";

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

export default function VerifyAccountScreen({
  navigation,
}: any) {
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState<
    "success" | "error" | "info" | ""
  >("");

  const shakeAnim =
    useRef(new Animated.Value(0)).current;

  /* =======================================================
     MESSAGE
  ======================================================= */

  const showMessage = (
    text: string,
    type: "success" | "error" | "info"
  ) => {
    setMessage(text);
    setMessageType(type);
  };

  /* =======================================================
     SHAKE ON ERROR
  ======================================================= */

  useEffect(() => {
    if (messageType === "error") {
      shake();
    }
  }, [message]);

  const shake = () => {
    shakeAnim.setValue(0);

    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 60,
        useNativeDriver: true,
      }),

      Animated.timing(shakeAnim, {
        toValue: -1,
        duration: 60,
        useNativeDriver: true,
      }),

      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 60,
        useNativeDriver: true,
      }),

      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const shakeStyle = {
    transform: [
      {
        translateX: shakeAnim.interpolate({
          inputRange: [-1, 1],
          outputRange: [-8, 8],
        }),
      },
    ],
  };

  /* =======================================================
     VERIFY ACCOUNT
  ======================================================= */

  const handleVerify = async () => {
    if (!idNumber.trim() || !phone.trim()) {
      showMessage(
        "Please enter your ID number and phone number.",
        "error"
      );
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      // 📱 Get device information
      const device = await getDeviceInfo();

      // 🔐 Verify citizen against Firebase
      const result = await verifyUser(
        idNumber.trim(),
        phone.trim(),
        device
      );

      if (result.success) {
        showMessage(
          result.message,
          "success"
        );

        setTimeout(() => {
          navigation.replace("Login");
        }, 1200);
      } else {
        showMessage(
          result.message,
          "error"
        );
      }
    } catch (error: any) {
      console.log(
        "Verification error:",
        error
      );

      showMessage(
        error?.message ||
          "Something went wrong. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     SUPPORT
  ======================================================= */

  const handleSupport = () => {
    const supportNumber = "27760000000";

    const supportMessage =
      "Hi, I need help with account verification.";

    const url =
      `https://wa.me/${supportNumber}` +
      `?text=${encodeURIComponent(
        supportMessage
      )}`;

    Linking.openURL(url);
  };

  /* =======================================================
     MESSAGE COLOUR
  ======================================================= */

  const getMessageColor = () => {
    if (messageType === "success") {
      return COLORS.success;
    }

    if (messageType === "error") {
      return COLORS.danger;
    }

    return COLORS.primary;
  };

  /* =======================================================
     SCREEN
  ======================================================= */

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            styles.container
          }
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={31}
                color="#FFFFFF"
              />
            </View>

            <Text style={styles.eyebrow}>
              TRAFFICCONNECT SA
            </Text>

            <Text style={styles.title}>
              Verify Account
            </Text>

            <Text style={styles.subtitle}>
              Link your existing government record
              to access TrafficConnect SA citizen
              services.
            </Text>
          </View>

          {/* =================================================
              VERIFICATION CARD
          ================================================= */}

          <View style={styles.verifyCard}>
            {/* CARD HEADER */}

            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderIcon}>
                <Ionicons
                  name="person-add-outline"
                  size={21}
                  color={COLORS.primary}
                />
              </View>

              <View
                style={
                  styles.cardHeaderInformation
                }
              >
                <Text style={styles.cardTitle}>
                  Citizen Verification
                </Text>

                <Text
                  style={
                    styles.cardDescription
                  }
                >
                  Enter the details linked to your
                  government record.
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* =================================================
                ID NUMBER
            ================================================= */}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                ID NUMBER
              </Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="card-outline"
                  size={20}
                  color={COLORS.textLight}
                />

                <TextInput
                  placeholder="South African ID Number"
                  placeholderTextColor="#8A949D"
                  value={idNumber}
                  onChangeText={(value) => {
                    setIdNumber(value);

                    if (message) {
                      setMessage("");
                      setMessageType("");
                    }
                  }}
                  keyboardType="number-pad"
                  maxLength={13}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />
              </View>

              <Text style={styles.inputHint}>
                Enter your 13-digit South African ID
                number.
              </Text>
            </View>

            {/* =================================================
                PHONE NUMBER
            ================================================= */}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                REGISTERED PHONE NUMBER
              </Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={COLORS.textLight}
                />

                <TextInput
                  placeholder="Registered Phone Number"
                  placeholderTextColor="#8A949D"
                  value={phone}
                  onChangeText={(value) => {
                    setPhone(value);

                    if (message) {
                      setMessage("");
                      setMessageType("");
                    }
                  }}
                  keyboardType="phone-pad"
                  style={styles.input}
                />
              </View>

              <Text style={styles.inputHint}>
                Use the phone number registered with
                your government record.
              </Text>
            </View>

            {/* =================================================
                MESSAGE
            ================================================= */}

            {message !== "" && (
              <Animated.View
                style={[
                  styles.messageContainer,
                  messageType === "error" &&
                    shakeStyle,
                  messageType === "success" &&
                    styles.successMessage,
                  messageType === "error" &&
                    styles.errorMessage,
                  messageType === "info" &&
                    styles.infoMessage,
                ]}
              >
                <Ionicons
                  name={
                    messageType ===
                    "success"
                      ? "checkmark-circle-outline"
                      : messageType ===
                        "error"
                      ? "alert-circle-outline"
                      : "information-circle-outline"
                  }
                  size={18}
                  color={getMessageColor()}
                />

                <Text
                  style={[
                    styles.messageText,
                    {
                      color:
                        getMessageColor(),
                    },
                  ]}
                >
                  {message}
                </Text>
              </Animated.View>
            )}

            {/* =================================================
                VERIFY BUTTON
            ================================================= */}

            <TouchableOpacity
              onPress={handleVerify}
              disabled={loading}
              activeOpacity={0.8}
              style={[
                styles.verifyButton,
                loading &&
                  styles.verifyButtonDisabled,
              ]}
            >
              {loading ? (
                <>
                  <ActivityIndicator
                    color="#FFFFFF"
                    size="small"
                  />

                  <Text
                    style={
                      styles.verifyButtonText
                    }
                  >
                    Verifying...
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={
                      styles.verifyButtonText
                    }
                  >
                    Verify Account
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="#FFFFFF"
                  />
                </>
              )}
            </TouchableOpacity>

            {/* =================================================
                BIOMETRIC
            ================================================= */}

            <TouchableOpacity
              onPress={() =>
                console.log(
                  "Biometric verify"
                )
              }
              activeOpacity={0.8}
              style={styles.biometricButton}
            >
              <View
                style={
                  styles.biometricIcon
                }
              >
                <Ionicons
                  name="finger-print-outline"
                  size={21}
                  color={COLORS.primary}
                />
              </View>

              <View
                style={
                  styles.biometricInformation
                }
              >
                <Text
                  style={
                    styles.biometricTitle
                  }
                >
                  Verify with Fingerprint /
                  Face ID
                </Text>

                <Text
                  style={
                    styles.biometricDescription
                  }
                >
                  Use biometric verification when
                  available.
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          </View>

          {/* =================================================
              TRUST NOTICE
          ================================================= */}

          <View style={styles.securityNotice}>
            <Ionicons
              name="shield-checkmark-outline"
              size={19}
              color={COLORS.primary}
            />

            <Text style={styles.securityText}>
              Your information is securely encrypted
              and only used to verify your government
              record and activate your citizen account.
            </Text>
          </View>

          {/* =================================================
              SUPPORT
          ================================================= */}

          <TouchableOpacity
            onPress={handleSupport}
            activeOpacity={0.7}
            style={styles.supportButton}
          >
            <View style={styles.supportIcon}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={18}
                color={COLORS.primary}
              />
            </View>

            <View
              style={
                styles.supportInformation
              }
            >
              <Text style={styles.supportTitle}>
                Need Help?
              </Text>

              <Text
                style={
                  styles.supportDescription
                }
              >
                Contact support for assistance with
                account verification.
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.textLight}
            />
          </TouchableOpacity>

          {/* =================================================
              FOOTER
          ================================================= */}

          <Text style={styles.footer}>
            TrafficConnect SA
          </Text>

          <Text style={styles.footerSubtext}>
            Secure Citizen Services
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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

  keyboard: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 18,
    paddingTop: 30,
    paddingBottom: 35,
  },

  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  logoContainer: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },

  eyebrow: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    color: COLORS.primary,
  },

  title: {
    marginTop: 3,
    fontSize: 25,
    fontWeight: "800",
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 6,
    maxWidth: 335,
    color: COLORS.textLight,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },

  /* =======================================================
     CARD
  ======================================================= */

  verifyCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 16,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  cardHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 9,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },

  cardHeaderInformation: {
    flex: 1,
    marginLeft: 10,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },

  cardDescription: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 15,
    color: COLORS.textLight,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 15,
  },

  /* =======================================================
     INPUT
  ======================================================= */

  inputGroup: {
    marginBottom: 15,
  },

  inputLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.7,
    color: COLORS.textLight,
    marginBottom: 6,
  },

  inputContainer: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFBFC",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    paddingHorizontal: 12,
  },

  input: {
    flex: 1,
    marginLeft: 9,
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
    paddingVertical: 0,
  },

  inputHint: {
    marginTop: 5,
    fontSize: 9,
    lineHeight: 13,
    color: COLORS.textLight,
  },

  /* =======================================================
     MESSAGE
  ======================================================= */

  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },

  successMessage: {
    backgroundColor: COLORS.softGreen,
    borderColor: "#B7E3CA",
  },

  errorMessage: {
    backgroundColor: COLORS.softRed,
    borderColor: "#F3C7C3",
  },

  infoMessage: {
    backgroundColor: COLORS.softBlue,
    borderColor: "#C7DDED",
  },

  messageText: {
    flex: 1,
    marginLeft: 7,
    fontSize: 10,
    lineHeight: 15,
    fontWeight: "600",
  },

  /* =======================================================
     VERIFY BUTTON
  ======================================================= */

  verifyButton: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 9,
    marginBottom: 10,
  },

  verifyButtonDisabled: {
    opacity: 0.7,
  },

  verifyButtonText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
    marginRight: 8,
  },

  /* =======================================================
     BIOMETRIC
  ======================================================= */

  biometricButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 9,
    padding: 10,
  },

  biometricIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },

  biometricInformation: {
    flex: 1,
    marginLeft: 9,
    marginRight: 7,
  },

  biometricTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.primary,
  },

  biometricDescription: {
    marginTop: 2,
    fontSize: 9,
    lineHeight: 13,
    color: COLORS.textLight,
  },

  /* =======================================================
     SECURITY
  ======================================================= */

  securityNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.softBlue,
    borderWidth: 1,
    borderColor: "#C7DDED",
    borderRadius: 9,
    padding: 11,
    marginTop: 18,
  },

  securityText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 9,
    lineHeight: 15,
    color: COLORS.text,
  },

  /* =======================================================
     SUPPORT
  ======================================================= */

  supportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 11,
    marginTop: 10,
  },

  supportIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },

  supportInformation: {
    flex: 1,
    marginLeft: 9,
    marginRight: 7,
  },

  supportTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.text,
  },

  supportDescription: {
    marginTop: 2,
    fontSize: 9,
    lineHeight: 13,
    color: COLORS.textLight,
  },

  /* =======================================================
     FOOTER
  ======================================================= */

  footer: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.primary,
  },

  footerSubtext: {
    marginTop: 2,
    textAlign: "center",
    fontSize: 9,
    color: COLORS.textLight,
  },
});
