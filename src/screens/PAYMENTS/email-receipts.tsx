import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
   SCREEN
========================================================= */

export default function EmailReceiptsScreen() {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const [receiptType, setReceiptType] = useState<
    "latest" | "all"
  >("latest");

  /* =======================================================
     SEND RECEIPT
  ======================================================= */

  const handleSendReceipt = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert(
        "Email required",
        "Please enter an email address."
      );
      return;
    }

    const emailIsValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        trimmedEmail
      );

    if (!emailIsValid) {
      Alert.alert(
        "Invalid email",
        "Please enter a valid email address."
      );
      return;
    }

    try {
      setSending(true);

      /*
       * -----------------------------------------------------
       * CONNECT YOUR BACKEND / FIREBASE FUNCTION HERE
       * -----------------------------------------------------
       *
       * Example:
       *
       * await sendReceiptEmail({
       *   email: trimmedEmail,
       *   type: receiptType,
       * });
       *
       * The actual email should be sent from your backend
       * or Firebase Cloud Function.
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      Alert.alert(
        "Receipt sent",
        `Your ${
          receiptType === "latest"
            ? "latest payment receipt"
            : "payment receipts"
        } has been sent to ${trimmedEmail}.`,
        [
          {
            text: "Done",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Unable to send receipt",
        "We couldn't send the receipt right now. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

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

          <View>
            <Text style={styles.headerTitle}>
              Email Receipts
            </Text>

            <Text style={styles.headerSubtitle}>
              Payment receipt delivery
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* =================================================
              HERO
          ================================================= */}

          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <MaterialCommunityIcons
                name="email-check-outline"
                size={30}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.heroTitle}>
              Get your payment receipt
            </Text>

            <Text style={styles.heroDescription}>
              Enter your email address and we'll send
              your payment receipt directly to your inbox.
            </Text>
          </View>

          {/* =================================================
              EMAIL
          ================================================= */}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Email address
            </Text>

            <Text style={styles.sectionDescription}>
              Enter the email address where you want to
              receive your receipt.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.inputLabel}>
              Email address
            </Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={COLORS.textLight}
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="example@email.com"
                placeholderTextColor="#9AA5AE"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!sending}
              />
            </View>
          </View>

          {/* =================================================
              RECEIPT TYPE
          ================================================= */}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Receipt
            </Text>

            <Text style={styles.sectionDescription}>
              Choose which payment information you want
              to receive.
            </Text>
          </View>

          <View style={styles.optionsCard}>
            {/* LATEST */}

            <ReceiptOption
              selected={receiptType === "latest"}
              icon="receipt-outline"
              title="Latest receipt"
              description="Send the receipt for your most recent payment."
              onPress={() =>
                setReceiptType("latest")
              }
            />

            <View style={styles.optionDivider} />

            {/* ALL */}

            <ReceiptOption
              selected={receiptType === "all"}
              icon="documents-outline"
              title="Payment history"
              description="Send a summary of your available payment receipts."
              onPress={() => setReceiptType("all")}
            />
          </View>

          {/* =================================================
              RECEIPT PREVIEW
          ================================================= */}

          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <View style={styles.previewIcon}>
                <Ionicons
                  name="document-text-outline"
                  size={19}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.previewHeaderInfo}>
                <Text style={styles.previewTitle}>
                  Payment receipt
                </Text>

                <Text style={styles.previewSubtitle}>
                  E-Transport Portal
                </Text>
              </View>

              <View style={styles.paidBadge}>
                <Text style={styles.paidText}>
                  PAID
                </Text>
              </View>
            </View>

            <View style={styles.previewDivider} />

            <ReceiptRow
              label="Reference"
              value="TXN-2026-00124"
            />

            <ReceiptRow
              label="Service"
              value="Transport Service"
            />

            <ReceiptRow
              label="Payment method"
              value="Card / EFT"
            />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Amount
              </Text>

              <Text style={styles.totalValue}>
                R150.00
              </Text>
            </View>
          </View>

          {/* =================================================
              SECURITY
          ================================================= */}

          <View style={styles.securityCard}>
            <View style={styles.securityIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={21}
                color={COLORS.success}
              />
            </View>

            <View style={styles.securityInformation}>
              <Text style={styles.securityTitle}>
                Your information is secure
              </Text>

              <Text style={styles.securityText}>
                Your receipt contains payment information
                but does not contain sensitive card or
                banking credentials.
              </Text>
            </View>
          </View>

          {/* =================================================
              SEND BUTTON
          ================================================= */}

          <TouchableOpacity
            style={[
              styles.sendButton,
              sending && styles.sendButtonDisabled,
            ]}
            activeOpacity={0.85}
            disabled={sending}
            onPress={handleSendReceipt}
          >
            {sending ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <>
                <Ionicons
                  name="send-outline"
                  size={20}
                  color="#FFFFFF"
                />

                <Text style={styles.sendButtonText}>
                  Send receipt
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* =================================================
              CANCEL
          ================================================= */}

          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.8}
            disabled={sending}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>
              Cancel
            </Text>
          </TouchableOpacity>

          {/* =================================================
              FOOTER
          ================================================= */}

          <View style={styles.footer}>
            <Ionicons
              name="mail-outline"
              size={14}
              color={COLORS.textLight}
            />

            <Text style={styles.footerText}>
              Receipts are sent securely to your email.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* =========================================================
   RECEIPT OPTION
========================================================= */

type ReceiptOptionProps = {
  selected: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
};

function ReceiptOption({
  selected,
  icon,
  title,
  description,
  onPress,
}: ReceiptOptionProps) {
  return (
    <TouchableOpacity
      style={[
        styles.receiptOption,
        selected && styles.receiptOptionSelected,
      ]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View
        style={[
          styles.receiptOptionIcon,
          selected &&
            styles.receiptOptionIconSelected,
        ]}
      >
        <Ionicons
          name={icon}
          size={21}
          color={
            selected
              ? "#FFFFFF"
              : COLORS.primary
          }
        />
      </View>

      <View style={styles.receiptOptionInformation}>
        <Text
          style={[
            styles.receiptOptionTitle,
            selected &&
              styles.receiptOptionTitleSelected,
          ]}
        >
          {title}
        </Text>

        <Text style={styles.receiptOptionDescription}>
          {description}
        </Text>
      </View>

      <View
        style={[
          styles.radio,
          selected && styles.radioSelected,
        ]}
      >
        {selected && (
          <Ionicons
            name="checkmark"
            size={14}
            color="#FFFFFF"
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

/* =========================================================
   RECEIPT ROW
========================================================= */

type ReceiptRowProps = {
  label: string;
  value: string;
};

function ReceiptRow({
  label,
  value,
}: ReceiptRowProps) {
  return (
    <View style={styles.receiptRow}>
      <Text style={styles.receiptRowLabel}>
        {label}
      </Text>

      <Text style={styles.receiptRowValue}>
        {value}
      </Text>
    </View>
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

  /* HEADER */

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

  /* HERO */

  heroCard: {
    padding: 20,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },

  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },

  heroTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
  },

  heroDescription: {
    marginTop: 7,
    fontSize: 12,
    lineHeight: 18,
    color: "#DCEBFA",
    textAlign: "center",
    paddingHorizontal: 10,
  },

  /* SECTION */

  sectionHeader: {
    marginTop: 24,
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
    lineHeight: 17,
    color: COLORS.textLight,
  },

  /* FORM */

  formCard: {
    padding: 17,
    borderRadius: 17,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  inputLabel: {
    marginBottom: 7,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.text,
  },

  inputWrapper: {
    height: 53,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#FAFBFC",
    flexDirection: "row",
    alignItems: "center",
  },

  inputIcon: {
    marginLeft: 14,
  },

  input: {
    flex: 1,
    height: 51,
    paddingHorizontal: 11,
    fontSize: 15,
    color: COLORS.text,
  },

  /* OPTIONS */

  optionsCard: {
    padding: 7,
    borderRadius: 17,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  receiptOption: {
    minHeight: 74,
    paddingHorizontal: 10,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  receiptOptionSelected: {
    backgroundColor: COLORS.softBlue,
  },

  receiptOptionIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },

  receiptOptionIconSelected: {
    backgroundColor: COLORS.primary,
  },

  receiptOptionInformation: {
    flex: 1,
    marginLeft: 12,
  },

  receiptOptionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.text,
  },

  receiptOptionTitleSelected: {
    color: COLORS.primaryDark,
  },

  receiptOptionDescription: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 15,
    color: COLORS.textLight,
  },

  optionDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 10,
  },

  radio: {
    width: 23,
    height: 23,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  radioSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },

  /* PREVIEW */

  previewCard: {
    marginTop: 17,
    padding: 17,
    borderRadius: 17,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },

  previewHeaderInfo: {
    flex: 1,
    marginLeft: 11,
  },

  previewTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.text,
  },

  previewSubtitle: {
    marginTop: 2,
    fontSize: 10,
    color: COLORS.textLight,
  },

  paidBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
    backgroundColor: COLORS.softGreen,
  },

  paidText: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.success,
  },

  previewDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },

  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
  },

  receiptRowLabel: {
    fontSize: 11,
    color: COLORS.textLight,
  },

  receiptRowValue: {
    maxWidth: "58%",
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "right",
  },

  totalRow: {
    marginTop: 5,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
  },

  totalValue: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.primary,
  },

  /* SECURITY */

  securityCard: {
    marginTop: 16,
    padding: 15,
    borderRadius: 16,
    backgroundColor: COLORS.softGreen,
    flexDirection: "row",
    alignItems: "center",
  },

  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  securityInformation: {
    flex: 1,
    marginLeft: 11,
  },

  securityTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.success,
  },

  securityText: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 16,
    color: "#3D6B56",
  },

  /* BUTTON */

  sendButton: {
    height: 54,
    marginTop: 22,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  sendButtonDisabled: {
    opacity: 0.65,
  },

  sendButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  cancelButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textLight,
  },

  /* FOOTER */

  footer: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  footerText: {
    fontSize: 10,
    color: COLORS.textLight,
  },
});