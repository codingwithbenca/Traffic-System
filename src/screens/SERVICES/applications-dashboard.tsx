
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

import { db } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";

/* =========================================================
   TYPES
========================================================= */

type ApplicationStatus =
  | "Submitted"
  | "Pending"
  | "Processing"
  | "In Review"
  | "Approved"
  | "Completed"
  | "Rejected";

type Application = {
  id: string;

  service: string;
  type?: string;

  status: ApplicationStatus;

  reference?: string;

  submittedAt?: Timestamp | Date | string;

  createdAt?: Timestamp | Date | string;
  updatedAt?: Timestamp | Date | string;

  vehicle?: {
    vehicleId?: string;
    registrationNumber?: string;
    vin?: string;
    make?: string;
    model?: string;
  };
};

/* =========================================================
   STATUS CONFIG
========================================================= */

function getStatusConfig(status: ApplicationStatus) {
  switch (status) {
    case "Submitted":
      return {
        background: "#EFF6FF",
        text: "#2563EB",
        icon: "paper-plane-outline" as const,
      };

    case "Pending":
      return {
        background: "#FEF3C7",
        text: "#B45309",
        icon: "time-outline" as const,
      };

    case "Processing":
      return {
        background: "#DBEAFE",
        text: "#1D4ED8",
        icon: "sync-outline" as const,
      };

    case "In Review":
      return {
        background: "#F3E8FF",
        text: "#7E22CE",
        icon: "eye-outline" as const,
      };

    case "Approved":
      return {
        background: "#DCFCE7",
        text: "#15803D",
        icon: "checkmark-circle-outline" as const,
      };

    case "Completed":
      return {
        background: "#E2E8F0",
        text: "#475569",
        icon: "checkmark-done-outline" as const,
      };

    case "Rejected":
      return {
        background: "#FEE2E2",
        text: "#B91C1C",
        icon: "close-circle-outline" as const,
      };

    default:
      return {
        background: "#E2E8F0",
        text: "#475569",
        icon: "document-outline" as const,
      };
  }
}

/* =========================================================
   DATE FORMATTER
========================================================= */

function formatDate(
  value?: Timestamp | Date | string
) {
  if (!value) {
    return "Date unavailable";
  }

  try {
    let date: Date;

    if (value instanceof Timestamp) {
      date = value.toDate();
    } else if (value instanceof Date) {
      date = value;
    } else {
      date = new Date(value);
    }

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString("en-ZA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Date unavailable";
  }
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ApplicationsDashboardScreen() {
  const navigation = useNavigation<any>();

  const { user, loading: authLoading } = useAuth();

  const [applications, setApplications] =
    useState<Application[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  /* =======================================================
     FETCH APPLICATIONS
  ======================================================= */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user?.idNumber) {
      setApplications([]);
      setLoading(false);
      return;
    }

    /*
     * IMPORTANT:
     *
     * Your AuthContext currently does not expose
     * the Firestore document ID directly.
     *
     * If your citizen document ID is the user's ID number,
     * this is correct.
     *
     * citizens/{idNumber}/applications
     */

    const applicationsRef = collection(
      db,
      "citizens",
      user.idNumber,
      "applications"
    );

    const applicationsQuery = query(
      applicationsRef,
      orderBy("submittedAt", "desc")
    );

    const unsubscribe = onSnapshot(
      applicationsQuery,
      (snapshot) => {
        const data: Application[] =
          snapshot.docs.map((document) => ({
            id: document.id,
            ...(document.data() as Omit<
              Application,
              "id"
            >),
          }));

        setApplications(data);
        setLoading(false);
        setRefreshing(false);
      },
      (error) => {
        console.log(
          "Applications fetch error:",
          error
        );

        setApplications([]);
        setLoading(false);
        setRefreshing(false);
      }
    );

    return unsubscribe;
  }, [
    user?.idNumber,
    authLoading,
  ]);

  /* =======================================================
     REFRESH
  ======================================================= */

  const handleRefresh = () => {
    /*
     * Firestore onSnapshot already keeps this screen
     * synchronized in real time.
     *
     * Setting refreshing briefly gives the user
     * visual feedback when pulling down.
     */

    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 700);
  };

  /* =======================================================
     OPEN APPLICATION
  ======================================================= */

  const openApplication = (
    application: Application
  ) => {
    navigation.navigate(
      "ApplicationDetails",
      {
        applicationId: application.id,
      }
    );
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (authLoading || loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator
          size="large"
          color="#0B4F8A"
        />

        <Text style={styles.loadingText}>
          Loading your applications...
        </Text>
      </View>
    );
  }

  /* =======================================================
     SUMMARY COUNTS
  ======================================================= */

  const totalApplications =
    applications.length;

  const activeApplications =
    applications.filter(
      (application) =>
        application.status ===
          "Submitted" ||
        application.status ===
          "Pending" ||
        application.status ===
          "Processing" ||
        application.status ===
          "In Review"
    ).length;

  const completedApplications =
    applications.filter(
      (application) =>
        application.status ===
          "Completed" ||
        application.status ===
          "Approved"
    ).length;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <View style={styles.screen}>
      {/* =================================================
          HEADER
      ================================================= */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
          activeOpacity={0.8}
        >
          <Ionicons
            name="arrow-back"
            size={21}
            color="#17212B"
          />
        </TouchableOpacity>

        <View style={styles.headerInformation}>
          <Text style={styles.headerTitle}>
            Applications
          </Text>

          <Text
            style={styles.headerSubtitle}
          >
            View and track your applications
          </Text>
        </View>
      </View>

      {/* =================================================
          CONTENT
      ================================================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {/* =================================================
            SUMMARY
        ================================================= */}

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryIcon}>
              <Ionicons
                name="documents-outline"
                size={24}
                color="#0B4F8A"
              />
            </View>

            <View
              style={
                styles.summaryInformation
              }
            >
              <Text
                style={
                  styles.summaryTitle
                }
              >
                Your Applications
              </Text>

              <Text
                style={
                  styles.summaryDescription
                }
              >
                Track applications submitted
                through Citizen Services.
              </Text>
            </View>
          </View>

          <View style={styles.summaryStats}>
            <View
              style={styles.summaryStat}
            >
              <Text
                style={
                  styles.summaryStatNumber
                }
              >
                {totalApplications}
              </Text>

              <Text
                style={
                  styles.summaryStatLabel
                }
              >
                Total
              </Text>
            </View>

            <View
              style={styles.summaryDivider}
            />

            <View
              style={styles.summaryStat}
            >
              <Text
                style={
                  styles.summaryStatNumber
                }
              >
                {activeApplications}
              </Text>

              <Text
                style={
                  styles.summaryStatLabel
                }
              >
                Active
              </Text>
            </View>

            <View
              style={styles.summaryDivider}
            />

            <View
              style={styles.summaryStat}
            >
              <Text
                style={
                  styles.summaryStatNumber
                }
              >
                {completedApplications}
              </Text>

              <Text
                style={
                  styles.summaryStatLabel
                }
              >
                Completed
              </Text>
            </View>
          </View>
        </View>

        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <View
          style={styles.sectionHeader}
        >
          <Text
            style={styles.sectionTitle}
          >
            Application History
          </Text>

          <View
            style={styles.countBadge}
          >
            <Text
              style={styles.countText}
            >
              {applications.length}
            </Text>
          </View>
        </View>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {applications.length === 0 && (
          <View style={styles.emptyCard}>
            <View
              style={styles.emptyIcon}
            >
              <Ionicons
                name="document-text-outline"
                size={30}
                color="#64748B"
              />
            </View>

            <Text
              style={styles.emptyTitle}
            >
              No Applications Yet
            </Text>

            <Text
              style={styles.emptyText}
            >
              Applications you submit through
              Citizen Services will appear here.
            </Text>
          </View>
        )}

        {/* =================================================
            APPLICATIONS
        ================================================= */}

        {applications.map(
          (application) => {
            const status =
              getStatusConfig(
                application.status
              );

            return (
              <TouchableOpacity
                key={application.id}
                style={styles.applicationCard}
                activeOpacity={0.8}
                onPress={() =>
                  openApplication(
                    application
                  )
                }
              >
                {/* ICON */}

                <View
                  style={
                    styles.applicationIcon
                  }
                >
                  <Ionicons
                    name="document-text-outline"
                    size={23}
                    color="#0B4F8A"
                  />
                </View>

                {/* INFORMATION */}

                <View
                  style={
                    styles.applicationInformation
                  }
                >
                  <Text
                    style={
                      styles.applicationTitle
                    }
                    numberOfLines={2}
                  >
                    {application.service ||
                      application.type ||
                      "Citizen Service"}
                  </Text>

                  {application.vehicle
                    ?.registrationNumber && (
                    <View
                      style={
                        styles.vehicleRow
                      }
                    >
                      <Ionicons
                        name="car-outline"
                        size={13}
                        color="#64748B"
                      />

                      <Text
                        style={
                          styles.vehicleText
                        }
                      >
                        {
                          application
                            .vehicle
                            .registrationNumber
                        }
                      </Text>
                    </View>
                  )}

                  <View
                    style={
                      styles.metaRow
                    }
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={13}
                      color="#64748B"
                    />

                    <Text
                      style={
                        styles.metaText
                      }
                    >
                      Submitted{" "}
                      {formatDate(
                        application.submittedAt ||
                          application.createdAt
                      )}
                    </Text>
                  </View>

                  {application.reference && (
                    <Text
                      style={
                        styles.reference
                      }
                    >
                      Reference:{" "}
                      {application.reference}
                    </Text>
                  )}

                  {/* STATUS */}

                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          status.background,
                      },
                    ]}
                  >
                    <Ionicons
                      name={status.icon}
                      size={13}
                      color={status.text}
                    />

                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            status.text,
                        },
                      ]}
                    >
                      {
                        application.status
                      }
                    </Text>
                  </View>
                </View>

                {/* CHEVRON */}

                <Ionicons
                  name="chevron-forward"
                  size={19}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            );
          }
        )}

        {/* =================================================
            INFORMATION
        ================================================= */}

        {applications.length > 0 && (
          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#0B4F8A"
            />

            <Text
              style={styles.infoText}
            >
              Application statuses are updated
              as your applications move through
              the processing stages.
            </Text>
          </View>
        )}
      </ScrollView>
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

  /* =======================================================
     LOADING
  ======================================================= */

  loadingScreen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: "#64748B",
  },

  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 17,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  headerInformation: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#17212B",
  },

  headerSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#66737F",
  },

  /* =======================================================
     CONTENT
  ======================================================= */

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  /* =======================================================
     SUMMARY
  ======================================================= */

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D9E0E6",
    marginBottom: 24,
  },

  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EAF3FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  summaryInformation: {
    flex: 1,
  },

  summaryTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#083B68",
  },

  summaryDescription: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: "#66737F",
  },

  summaryStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },

  summaryStat: {
    flex: 1,
    alignItems: "center",
  },

  summaryStatNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#17212B",
  },

  summaryStatLabel: {
    marginTop: 3,
    fontSize: 10,
    color: "#66737F",
    fontWeight: "600",
  },

  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#D9E0E6",
  },

  /* =======================================================
     SECTION
  ======================================================= */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "800",
    color: "#17212B",
  },

  countBadge: {
    minWidth: 28,
    height: 28,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: "#EAF3FA",
    alignItems: "center",
    justifyContent: "center",
  },

  countText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0B4F8A",
  },

  /* =======================================================
     APPLICATION CARD
  ======================================================= */

  applicationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#D9E0E6",
  },

  applicationIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EAF3FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  applicationInformation: {
    flex: 1,
  },

  applicationTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#17212B",
    lineHeight: 20,
  },

  vehicleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  vehicleText: {
    marginLeft: 5,
    fontSize: 11,
    color: "#475569",
    fontWeight: "700",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  metaText: {
    marginLeft: 5,
    fontSize: 11,
    color: "#66737F",
  },

  reference: {
    marginTop: 5,
    fontSize: 10,
    color: "#94A3B8",
  },

  /* =======================================================
     STATUS
  ======================================================= */

  statusBadge: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  statusText: {
    marginLeft: 5,
    fontSize: 10,
    fontWeight: "800",
  },

  /* =======================================================
     EMPTY
  ======================================================= */

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9E0E6",
    padding: 28,
    alignItems: "center",
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#17212B",
  },

  emptyText: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    color: "#66737F",
    textAlign: "center",
  },

  /* =======================================================
     INFORMATION
  ======================================================= */

  infoBox: {
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#EAF3FA",
    flexDirection: "row",
    alignItems: "flex-start",
  },

  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 11,
    lineHeight: 17,
    color: "#475569",
  },
});
