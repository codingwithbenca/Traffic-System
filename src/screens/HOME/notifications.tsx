import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  primary: "#003366",
  background: "#F4F7FB",
  card: "#FFFFFF",
  border: "#E1E7EF",

  text: "#17202A",
  textLight: "#6B7280",

  softBlue: "#EAF2F8",
  softGreen: "#EAF7EF",
  softYellow: "#FFF7DD",

  warning: "#B7791F",
};

type NotificationType =
  | "Appointment"
  | "Traffic Fine"
  | "Driver Licence"
  | "Vehicle Licence"
  | "Payment"
  | "Announcement"
  | "Licence Renewal";

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  screen: string | null;
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "Appointment",
    title: "Appointment Confirmed",
    description:
      "Your driver's license renewal appointment has been confirmed for August 15, 2026 at 09:30 AM.",
    time: "2 hours ago",
    read: false,
    icon: "calendar-outline",
    screen: "Appointments",
  },
  {
    id: "2",
    type: "Traffic Fine",
    title: "Traffic Fine Issued",
    description:
      "A traffic fine has been issued for your vehicle ABC123GP. Amount: R500.00",
    time: "5 hours ago",
    read: false,
    icon: "warning-outline",
    screen: "Fines",
  },
  {
    id: "3",
    type: "Driver Licence",
    title: "Driver Licence Reminder",
    description:
      "Your driver's license will expire in 30 days. Please renew before August 14, 2026.",
    time: "1 day ago",
    read: false,
    icon: "card-outline",
    screen: "DriverLicense",
  },
  {
    id: "4",
    type: "Vehicle Licence",
    title: "Vehicle Licence Reminder",
    description:
      "Your vehicle license for ABC123GP will expire in 45 days. Renew online to avoid penalties.",
    time: "2 days ago",
    read: true,
    icon: "car-outline",
    screen: "VehicleLicense",
  },
  {
    id: "5",
    type: "Payment",
    title: "Fine Payment Successful",
    description:
      "Your payment of R250.00 for fine reference TF20260003 has been processed successfully.",
    time: "3 days ago",
    read: true,
    icon: "wallet-outline",
    screen: "Fines",
  },
  {
    id: "6",
    type: "Appointment",
    title: "Appointment Cancelled",
    description:
      "Your driving test appointment scheduled for July 20, 2026 has been cancelled.",
    time: "5 days ago",
    read: true,
    icon: "calendar-outline",
    screen: "Appointments",
  },
  {
    id: "7",
    type: "Licence Renewal",
    title: "Licence Renewal Approved",
    description:
      "Your vehicle license renewal has been approved. New license disc number: VD-2026-0789",
    time: "1 week ago",
    read: true,
    icon: "checkmark-circle-outline",
    screen: "VehicleLicense",
  },
  {
    id: "8",
    type: "Announcement",
    title: "System Announcement",
    description:
      "The Traffic Connect System will undergo maintenance on August 20, 2026 from 02:00 AM to 04:00 AM.",
    time: "1 week ago",
    read: true,
    icon: "megaphone-outline",
    screen: null,
  },
  {
    id: "9",
    type: "Traffic Fine",
    title: "Fine Dispute Resolved",
    description:
      "Your dispute for fine reference TF20260004 has been resolved in your favor. Amount: R0.00",
    time: "2 weeks ago",
    read: true,
    icon: "warning-outline",
    screen: "Fines",
  },
  {
    id: "10",
    type: "Appointment",
    title: "Appointment Reminder",
    description:
      "Reminder: Your vehicle license renewal appointment is tomorrow at 11:00 AM.",
    time: "2 weeks ago",
    read: true,
    icon: "calendar-outline",
    screen: "Appointments",
  },
  {
    id: "11",
    type: "Driver Licence",
    title: "Driver Licence Updated",
    description:
      "Your driver's license information has been updated successfully.",
    time: "3 weeks ago",
    read: true,
    icon: "card-outline",
    screen: "DriverLicense",
  },
  {
    id: "12",
    type: "Payment",
    title: "Payment Reminder",
    description:
      "You have outstanding fines totaling R1,250.00. Please make payment to avoid penalties.",
    time: "3 weeks ago",
    read: true,
    icon: "wallet-outline",
    screen: "Fines",
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>(
    MOCK_NOTIFICATIONS
  );

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  /*
  ========================================================
  REFRESH
  ========================================================
  */

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);

      // TODO:
      // Fetch notifications from Firebase
    }, 1200);
  };

  /*
  ========================================================
  MARK ALL AS READ
  ========================================================
  */

  const markAllAsRead = () => {
    if (unreadCount === 0) {
      return;
    }

    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    );

    // TODO:
    // Update notification status in Firebase
  };

  /*
  ========================================================
  MARK SINGLE NOTIFICATION AS READ
  ========================================================
  */

  const markAsRead = (id: string) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );

    // TODO:
    // Update notification status in Firebase
  };

  /*
  ========================================================
  DELETE NOTIFICATION
  ========================================================
  */

  const deleteNotification = (id: string) => {
    setNotifications((previous) =>
      previous.filter((notification) => notification.id !== id)
    );

    setSelectedNotification(null);
    setShowDeleteModal(false);

    // TODO:
    // Delete notification from Firebase
  };

  /*
  ========================================================
  NOTIFICATION PRESS
  ========================================================
  */

  const handleNotificationPress = (
    notification: Notification
  ) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    /*
    TODO:
    Connect navigation here.

    Example:

    if (notification.screen === "Fines") {
      navigation.navigate("Fines");
    }
    */
  };

  /*
  ========================================================
  LONG PRESS
  ========================================================
  */

  const handleLongPress = (
    notification: Notification
  ) => {
    setSelectedNotification(notification);
    setShowDeleteModal(true);
  };

  /*
  ========================================================
  HEADER
  ========================================================
  */

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons
            name="notifications-outline"
            size={22}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.headerInformation}>
          <Text style={styles.eyebrow}>
            TRAFFIC CONNECT
          </Text>

          <View style={styles.titleRow}>
            <Text style={styles.title}>
              Notifications
            </Text>

            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>
                  {unreadCount}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.subtitle}>
            Stay updated with your latest traffic and
            licence information.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={onRefresh}
          activeOpacity={0.7}
        >
          <Ionicons
            name="refresh-outline"
            size={20}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*
  ========================================================
  SUMMARY
  ========================================================
  */

  const renderSummary = () => {
    const total = notifications.length;
    const read = notifications.filter(
      (notification) => notification.read
    ).length;

    return (
      <View style={styles.summaryCard}>
        <View style={styles.summaryTop}>
          <View style={styles.summaryIcon}>
            <Ionicons
              name="notifications-outline"
              size={21}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.summaryInformation}>
            <Text style={styles.summaryLabel}>
              NOTIFICATION CENTRE
            </Text>

            <Text style={styles.summaryName}>
              Your updates
            </Text>

            <Text style={styles.summaryId}>
              Important information from Traffic Connect
            </Text>
          </View>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryStats}>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>
              {total}
            </Text>

            <Text style={styles.summaryStatLabel}>
              Total
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>
              {unreadCount}
            </Text>

            <Text style={styles.summaryStatLabel}>
              Unread
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>
              {read}
            </Text>

            <Text style={styles.summaryStatLabel}>
              Read
            </Text>
          </View>
        </View>
      </View>
    );
  };

  /*
  ========================================================
  SECTION HEADER
  ========================================================
  */

  const renderSectionHeader = () => {
    return (
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderIcon}>
          <Ionicons
            name="list-outline"
            size={18}
            color={COLORS.primary}
          />
        </View>

        <View style={styles.sectionHeaderInformation}>
          <Text style={styles.sectionTitle}>
            Recent notifications
          </Text>

          <Text style={styles.sectionDescription}>
            Your latest updates and alerts
          </Text>
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={markAllAsRead}
            activeOpacity={0.7}
          >
            <Ionicons
              name="checkmark-done-outline"
              size={15}
              color={COLORS.primary}
            />

            <Text style={styles.markAllText}>
              Read all
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  /*
  ========================================================
  NOTIFICATION CARD
  ========================================================
  */

  const renderNotification = (
    notification: Notification
  ) => {
    const isUnread = !notification.read;

    return (
      <TouchableOpacity
        key={notification.id}
        style={[
          styles.notificationCard,
          isUnread && styles.notificationCardUnread,
        ]}
        onPress={() =>
          handleNotificationPress(notification)
        }
        onLongPress={() =>
          handleLongPress(notification)
        }
        activeOpacity={0.75}
      >
        <View
          style={[
            styles.notificationIcon,
            isUnread && styles.notificationIconUnread,
          ]}
        >
          <Ionicons
            name={notification.icon}
            size={20}
            color={COLORS.primary}
          />
        </View>

        <View style={styles.notificationInformation}>
          <View style={styles.notificationTitleRow}>
            <Text
              style={[
                styles.notificationTitle,
                isUnread &&
                  styles.notificationTitleUnread,
              ]}
              numberOfLines={1}
            >
              {notification.title}
            </Text>

            {isUnread && (
              <View style={styles.unreadDot} />
            )}
          </View>

          <Text
            style={styles.notificationDescription}
            numberOfLines={2}
          >
            {notification.description}
          </Text>

          <View style={styles.notificationFooter}>
            <Text style={styles.notificationType}>
              {notification.type}
            </Text>

            <View style={styles.footerDot} />

            <Text style={styles.notificationTime}>
              {notification.time}
            </Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={16}
          color="#A7B0BA"
          style={styles.chevron}
        />
      </TouchableOpacity>
    );
  };

  /*
  ========================================================
  EMPTY STATE
  ========================================================
  */

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIcon}>
          <Ionicons
            name="notifications-off-outline"
            size={35}
            color={COLORS.primary}
          />
        </View>

        <Text style={styles.emptyTitle}>
          No notifications
        </Text>

        <Text style={styles.emptyDescription}>
          You're all caught up. Important updates will
          appear here when they are available.
        </Text>
      </View>
    );
  };

  /*
  ========================================================
  LOADING
  ========================================================
  */

  const renderLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="small"
          color={COLORS.primary}
        />

        <Text style={styles.loadingText}>
          Loading notifications...
        </Text>
      </View>
    );
  };

  /*
  ========================================================
  DELETE MODAL
  ========================================================
  */

  const renderDeleteModal = () => {
    return (
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setShowDeleteModal(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIcon}>
              <Ionicons
                name="trash-outline"
                size={25}
                color="#B42318"
              />
            </View>

            <Text style={styles.modalTitle}>
              Delete notification?
            </Text>

            <Text style={styles.modalDescription}>
              This notification will be removed from
              your notification centre.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() =>
                  setShowDeleteModal(false)
                }
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  if (selectedNotification) {
                    deleteNotification(
                      selectedNotification.id
                    );
                  }
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.deleteButtonText}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  /*
  ========================================================
  MAIN
  ========================================================
  */

  return (
    <SafeAreaView
      style={styles.safe}
      edges={["top"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={styles.container}
      >
        {renderHeader()}

        {renderSummary()}

        {renderSectionHeader()}

        {loading ? (
          renderLoading()
        ) : notifications.length === 0 ? (
          renderEmptyState()
        ) : (
          <View>
            {notifications.map(
              renderNotification
            )}
          </View>
        )}

        <View style={styles.bottomNotice}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={COLORS.primary}
          />

          <Text style={styles.bottomNoticeText}>
            Long press a notification to remove it.
          </Text>
        </View>
      </ScrollView>

      {renderDeleteModal()}
    </SafeAreaView>
  );
}

/*
========================================================
STYLES
========================================================
*/

const styles = StyleSheet.create({
  /*
  ========================================================
  SAFE / CONTAINER
  ========================================================
  */

  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    paddingHorizontal: 15,
    paddingTop: 35,
    paddingBottom: 60,
  },

  /*
  ========================================================
  HEADER
  ========================================================
  */

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 17,
  },

  headerIcon: {
    width: 43,
    height: 43,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  headerInformation: {
    flex: 1,
  },

  eyebrow: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
    color: COLORS.primary,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    marginTop: 2,
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 4,
    color: COLORS.textLight,
    fontSize: 12,
    lineHeight: 18,
  },

  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  unreadBadge: {
    minWidth: 21,
    height: 21,
    borderRadius: 11,
    paddingHorizontal: 6,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    marginTop: 4,
  },

  unreadBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },

  /*
  ========================================================
  SUMMARY
  ========================================================
  */

  summaryCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 15,
    marginBottom: 22,
  },

  summaryTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  summaryIcon: {
    width: 42,
    height: 42,
    borderRadius: 9,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryInformation: {
    flex: 1,
    marginLeft: 11,
  },

  summaryLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.textLight,
    letterSpacing: 0.7,
  },

  summaryName: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },

  summaryId: {
    marginTop: 2,
    fontSize: 11,
    color: COLORS.textLight,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },

  summaryStats: {
    flexDirection: "row",
    alignItems: "center",
  },

  summaryStat: {
    flex: 1,
    alignItems: "center",
  },

  summaryStatValue: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.primary,
  },

  summaryStatLabel: {
    marginTop: 3,
    fontSize: 9,
    color: COLORS.textLight,
    textAlign: "center",
  },

  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },

  /*
  ========================================================
  SECTION
  ========================================================
  */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  sectionHeaderIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  sectionHeaderInformation: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },

  sectionDescription: {
    marginTop: 2,
    color: COLORS.textLight,
    fontSize: 11,
    lineHeight: 16,
  },

  markAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 7,
    backgroundColor: COLORS.softBlue,
  },

  markAllText: {
    marginLeft: 4,
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.primary,
  },

  /*
  ========================================================
  NOTIFICATION CARD
  ========================================================
  */

  notificationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 13,
    marginBottom: 9,
  },

  notificationCardUnread: {
    borderColor: "#C7DDED",
    backgroundColor: "#F8FBFE",
  },

  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 9,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  notificationIconUnread: {
    backgroundColor: "#DDECF7",
  },

  notificationInformation: {
    flex: 1,
    minWidth: 0,
    marginRight: 6,
  },

  notificationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  notificationTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
  },

  notificationTitleUnread: {
    fontWeight: "800",
    color: COLORS.primary,
  },

  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginLeft: 7,
  },

  notificationDescription: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 15,
    color: COLORS.textLight,
  },

  notificationFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  notificationType: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.primary,
  },

  footerDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#A7B0BA",
    marginHorizontal: 6,
  },

  notificationTime: {
    fontSize: 9,
    color: COLORS.textLight,
  },

  chevron: {
    marginTop: 12,
  },

  /*
  ========================================================
  EMPTY
  ========================================================
  */

  emptyCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 25,
    alignItems: "center",
    marginBottom: 10,
  },

  emptyIcon: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
  },

  emptyDescription: {
    marginTop: 5,
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 17,
  },

  /*
  ========================================================
  LOADING
  ========================================================
  */

  loadingContainer: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
  },

  loadingText: {
    marginTop: 9,
    fontSize: 11,
    color: COLORS.textLight,
  },

  /*
  ========================================================
  BOTTOM NOTICE
  ========================================================
  */

  bottomNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.softBlue,
    borderWidth: 1,
    borderColor: "#C7DDED",
    borderRadius: 9,
    padding: 11,
    marginTop: 8,
  },

  bottomNoticeText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 10,
    lineHeight: 16,
    color: COLORS.text,
  },

  /*
  ========================================================
  DELETE MODAL
  ========================================================
  */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 24, 48, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  modalContainer: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  modalIcon: {
    width: 45,
    height: 45,
    borderRadius: 9,
    backgroundColor: "#FDECEC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
  },

  modalDescription: {
    marginTop: 5,
    fontSize: 11,
    lineHeight: 17,
    color: COLORS.textLight,
    marginBottom: 20,
  },

  modalButtons: {
    flexDirection: "row",
    gap: 9,
  },

  cancelButton: {
    flex: 1,
    height: 43,
    borderRadius: 8,
    backgroundColor: "#F2F4F7",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.textLight,
  },

  deleteButton: {
    flex: 1,
    height: 43,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});