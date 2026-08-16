import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
   TYPES
========================================================= */

type Receipt = {
  id: string;
  reference: string;
  service: string;
  date: string;
  amount: string;
  method: string;
  status: "Paid";
};

/* =========================================================
   DEMO RECEIPTS
========================================================= */

const RECEIPTS: Receipt[] = [
  {
    id: "1",
    reference: "TXN-2026-00124",
    service: "Driver's Licence Renewal",
    date: "16 Aug 2026",
    amount: "R250.00",
    method: "Card",
    status: "Paid",
  },
  {
    id: "2",
    reference: "TXN-2026-00117",
    service: "Vehicle Licence Renewal",
    date: "12 Aug 2026",
    amount: "R180.00",
    method: "Instant EFT",
    status: "Paid",
  },
  {
    id: "3",
    reference: "TXN-2026-00098",
    service: "Traffic Fine",
    date: "05 Aug 2026",
    amount: "R500.00",
    method: "Card",
    status: "Paid",
  },
];

/* =========================================================
   SCREEN
========================================================= */

export default function DownloadReceiptsScreen() {
  const navigation = useNavigation<any>();

  const [selectedReceipt, setSelectedReceipt] =
    useState<Receipt | null>(null);

  const [downloading, setDownloading] =
    useState(false);

  /* =======================================================
     DOWNLOAD RECEIPT
  ======================================================= */

  const handleDownload = async () => {
    if (!selectedReceipt) {
      Alert.alert(
        "Select a receipt",
        "Please select a payment receipt to download."
      );

      return;
    }

    try {
      setDownloading(true);

      /*
       * -----------------------------------------------------
       * REAL PDF DOWNLOAD GOES HERE
       * -----------------------------------------------------
       *
       * In production:
       *
       * 1. Get the receipt/PDF URL from Firebase.
       * 2. Download the PDF using Expo FileSystem.
       * 3. Optionally open/share it using Expo Sharing.
       *
       * Example backend flow:
       *
       * const receiptUrl = await getReceiptUrl(
       *   selectedReceipt.id
       * );
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      Alert.alert(
        "Receipt ready",
        `${selectedReceipt.reference} is ready to download.`,
        [
          {
            text: "OK",
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Download failed",
        "We couldn't download the receipt. Please try again."
      );
    } finally {
      setDownloading(false);
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
              Download Receipts
            </Text>

            <Text style={styles.headerSubtitle}>
              Official payment records
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* =================================================
              HERO
          ================================================= */}

          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <MaterialCommunityIcons
                name="file-download-outline"
                size={30}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.heroInformation}>
              <Text style={styles.heroTitle}>
                Your payment receipts
              </Text>

              <Text style={styles.heroDescription}>
                Select a completed payment to download
                its official receipt.
              </Text>
            </View>
          </View>

          {/* =================================================
              RECEIPTS
          ================================================= */}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Payment history
            </Text>

            <Text style={styles.sectionDescription}>
              Select the receipt you want to download.
            </Text>
          </View>

          <View style={styles.receiptsCard}>
            {RECEIPTS.map((receipt, index) => {
              const selected =
                selectedReceipt?.id === receipt.id;

              return (
                <React.Fragment key={receipt.id}>
                  <TouchableOpacity
                    style={[
                      styles.receiptItem,
                      selected &&
                        styles.receiptItemSelected,
                    ]}
                    activeOpacity={0.8}
                    onPress={() =>
                      setSelectedReceipt(receipt)
                    }
                  >
                    {/* ICON */}

                    <View
                      style={[
                        styles.receiptIcon,
                        selected &&
                          styles.receiptIconSelected,
                      ]}
                    >
                      <Ionicons
                        name="document-text-outline"
                        size={21}
                        color={
                          selected
                            ? "#FFFFFF"
                            : COLORS.primary
                        }
                      />
                    </View>

                    {/* INFORMATION */}

                    <View style={styles.receiptInformation}>
                      <Text
                        style={styles.receiptService}
                        numberOfLines={1}
                      >
                        {receipt.service}
                      </Text>

                      <Text
                        style={styles.receiptReference}
                      >
                        {receipt.reference}
                      </Text>

                      <Text
                        style={styles.receiptDate}
                      >
                        {receipt.date}
                      </Text>
                    </View>

                    {/* AMOUNT */}

                    <View style={styles.receiptRight}>
                      <Text style={styles.receiptAmount}>
                        {receipt.amount}
                      </Text>

                      <View style={styles.paidBadge}>
                        <Text style={styles.paidText}>
                          {receipt.status}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {index <
                    RECEIPTS.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </React.Fragment>
              );
            })}
          </View>

          {/* =================================================
              SELECTED RECEIPT
          ================================================= */}

          {selectedReceipt && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Receipt details
                </Text>

                <Text style={styles.sectionDescription}>
                  Review the payment before downloading.
                </Text>
              </View>

              <View style={styles.detailsCard}>
                <View style={styles.detailsHeader}>
                  <View style={styles.detailsDocumentIcon}>
                    <Ionicons
                      name="receipt-outline"
                      size={22}
                      color={COLORS.primary}
                    />
                  </View>

                  <View
                    style={styles.detailsHeaderInformation}
                  >
                    <Text
                      style={styles.detailsTitle}
                    >
                      Official receipt
                    </Text>

                    <Text
                      style={styles.detailsReference}
                    >
                      {selectedReceipt.reference}
                    </Text>
                  </View>

                  <View style={styles.paidBadgeLarge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color={COLORS.success}
                    />

                    <Text style={styles.paidText}>
                      PAID
                    </Text>
                  </View>
                </View>

                <View style={styles.detailsDivider} />

                <DetailRow
                  label="Service"
                  value={selectedReceipt.service}
                />

                <DetailRow
                  label="Payment date"
                  value={selectedReceipt.date}
                />

                <DetailRow
                  label="Payment method"
                  value={selectedReceipt.method}
                />

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>
                    Total paid
                  </Text>

                  <Text style={styles.totalValue}>
                    {selectedReceipt.amount}
                  </Text>
                </View>
              </View>
            </>
          )}

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
                Official payment record
              </Text>

              <Text style={styles.securityDescription}>
                Downloaded receipts contain the official
                transaction reference and payment details
                associated with your citizen account.
              </Text>
            </View>
          </View>

          {/* =================================================
              DOWNLOAD BUTTON
          ================================================= */}

          <TouchableOpacity
            style={[
              styles.downloadButton,
              (!selectedReceipt || downloading) &&
                styles.downloadButtonDisabled,
            ]}
            activeOpacity={0.85}
            disabled={
              !selectedReceipt || downloading
            }
            onPress={handleDownload}
          >
            {downloading ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <>
                <Ionicons
                  name="download-outline"
                  size={21}
                  color="#FFFFFF"
                />

                <Text style={styles.downloadButtonText}>
                  Download receipt
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
            disabled={downloading}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>
              Back
            </Text>
          </TouchableOpacity>

          {/* =================================================
              FOOTER
          ================================================= */}

          <View style={styles.footer}>
            <Ionicons
              name="document-outline"
              size={14}
              color={COLORS.textLight}
            />

            <Text style={styles.footerText}>
              Receipts are provided as official payment
              records.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* =========================================================
   DETAIL ROW
========================================================= */

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({
  label,
  value,
}: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>
        {label}
      </Text>

      <Text
        style={styles.detailValue}
        numberOfLines={2}
      >
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
    padding: 18,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
  },

  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  heroInformation: {
    flex: 1,
    marginLeft: 14,
  },

  heroTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  heroDescription: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 17,
    color: "#DCEBFA",
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

  /* RECEIPTS */

  receiptsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 17,
    padding: 7,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  receiptItem: {
    minHeight: 82,
    paddingHorizontal: 9,
    paddingVertical: 10,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  receiptItemSelected: {
    backgroundColor: COLORS.softBlue,
  },

  receiptIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },

  receiptIconSelected: {
    backgroundColor: COLORS.primary,
  },

  receiptInformation: {
    flex: 1,
    marginLeft: 11,
    paddingRight: 7,
  },

  receiptService: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.text,
  },

  receiptReference: {
    marginTop: 3,
    fontSize: 10,
    color: COLORS.textLight,
  },

  receiptDate: {
    marginTop: 2,
    fontSize: 10,
    color: COLORS.textLight,
  },

  receiptRight: {
    alignItems: "flex-end",
  },

  receiptAmount: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.primary,
  },

  paidBadge: {
    marginTop: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: COLORS.softGreen,
  },

  paidText: {
    fontSize: 8,
    fontWeight: "800",
    color: COLORS.success,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 9,
  },

  /* DETAILS */

  detailsCard: {
    padding: 17,
    borderRadius: 17,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  detailsHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  detailsDocumentIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },

  detailsHeaderInformation: {
    flex: 1,
    marginLeft: 11,
  },

  detailsTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.text,
  },

  detailsReference: {
    marginTop: 3,
    fontSize: 10,
    color: COLORS.textLight,
  },

  paidBadgeLarge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.softGreen,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  detailsDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 15,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 11,
  },

  detailLabel: {
    fontSize: 11,
    color: COLORS.textLight,
  },

  detailValue: {
    maxWidth: "60%",
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "right",
  },

  totalRow: {
    marginTop: 3,
    paddingTop: 13,
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
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
  },

  /* SECURITY */

  securityCard: {
    marginTop: 17,
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

  securityDescription: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 16,
    color: "#3D6B56",
  },

  /* DOWNLOAD */

  downloadButton: {
    height: 54,
    marginTop: 22,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  downloadButtonDisabled: {
    opacity: 0.45,
  },

  downloadButtonText: {
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
    textAlign: "center",
  },
});