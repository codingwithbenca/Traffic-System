
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthContext";

/* =========================================================
   COLORS
========================================================= */

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

  success: "#2E7D32",
  warning: "#B7791F",
  danger: "#B42318",
};

/* =========================================================
   MENU ITEMS
========================================================= */

const MENU_ITEMS = [
  {
    id: "personal",
    title: "Personal Information",
    description: "Manage your personal details",
    icon: "person-outline",
    screen: "PersonalDetails",
    color: COLORS.primary,
    background: COLORS.softBlue,
  },
  {
    id: "driver",
    title: "Driver Licence Information",
    description: "View your driver licence details",
    icon: "card-outline",
    screen: "DriverLicense",
    color: COLORS.primary,
    background: COLORS.softBlue,
  },
  {
    id: "vehicle",
    title: "Vehicle Information",
    description: "Manage your registered vehicles",
    icon: "car-outline",
    screen: "VehicleLicense",
    color: COLORS.warning,
    background: COLORS.softYellow,
  },
  {
    id: "addresses",
    title: "Saved Addresses",
    description: "Manage your saved locations",
    icon: "location-outline",
    screen: "Addresses",
    color: "#6A1B9A",
    background: "#F3EAF7",
  },
  {
    id: "notifications",
    title: "Notification Settings",
    description: "Manage alerts and notifications",
    icon: "notifications-outline",
    screen: "Notifications",
    color: COLORS.primary,
    background: COLORS.softBlue,
  },
  {
    id: "privacy",
    title: "Privacy & Security",
    description: "Manage account security",
    icon: "shield-outline",
    screen: "Privacy",
    color: COLORS.success,
    background: COLORS.softGreen,
  },
  {
    id: "help",
    title: "Help & Support",
    description: "Get assistance with Traffic Connect",
    icon: "help-circle-outline",
    screen: "Help",
    color: "#00838F",
    background: "#E6F6F7",
  },
  {
    id: "about",
    title: "About the App",
    description: "Information about Traffic Connect",
    icon: "information-circle-outline",
    screen: "About",
    color: COLORS.textLight,
    background: "#F0F2F4",
  },
];

/* =========================================================
   QUICK ACTIONS
========================================================= */

const QUICK_ACTIONS = [
  {
    id: "edit",
    title: "Edit Profile",
    icon: "create-outline",
  },
  {
    id: "password",
    title: "Password",
    icon: "key-outline",
  },
  {
    id: "logout",
    title: "Logout",
    icon: "log-out-outline",
  },
];

/* =========================================================
   PROFILE SCREEN
========================================================= */

export default function ProfileScreen({ navigation }: any) {
  const {
    user,
    loading,
    device,
    setUser,
    setIsLoggedIn,
  } = useAuth();

  const [saving, setSaving] = useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  /* =======================================================
     EDIT DATA
  ======================================================= */

  const [editData, setEditData] = useState({
    fullName: user?.fullName ?? "",
    phone: user?.phone ?? "",
    street: user?.address?.street ?? "",
    suburb: user?.address?.suburb ?? "",
    city: user?.address?.city ?? "",
    province: user?.address?.province ?? "",
    postalCode: user?.address?.postalCode ?? "",
  });

  /* =======================================================
     PASSWORD DATA
  ======================================================= */

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* =======================================================
     INITIALS
  ======================================================= */

  const getInitials = (name: string) => {
    if (!name) return "C";

    return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  /* =======================================================
     FORMATTED ADDRESS
  ======================================================= */

  const formattedAddress = user?.address
    ? [
        user.address.street,
        user.address.suburb,
        user.address.city,
        user.address.province,
        user.address.postalCode,
      ]
        .filter(Boolean)
        .join(", ")
    : "No address added";

  /* =======================================================
     OPEN EDIT PROFILE
  ======================================================= */

  const openEditProfile = () => {
    setEditData({
      fullName: user?.fullName ?? "",
      phone: user?.phone ?? "",
      street: user?.address?.street ?? "",
      suburb: user?.address?.suburb ?? "",
      city: user?.address?.city ?? "",
      province: user?.address?.province ?? "",
      postalCode: user?.address?.postalCode ?? "",
    });

    setShowEditModal(true);
  };

  /* =======================================================
     UPDATE PROFILE
     
     NOTE:
     This updates AuthContext locally.
     
     For permanent Firebase saving, connect this function
     to updateDoc() in your service.
  ======================================================= */

  const handleEditProfile = async () => {
    if (!user) return;

    if (!editData.fullName.trim()) {
      Alert.alert(
        "Incomplete Information",
        "Please enter your full name."
      );
      return;
    }

    if (!editData.phone.trim()) {
      Alert.alert(
        "Incomplete Information",
        "Please enter your phone number."
      );
      return;
    }

    try {
      setSaving(true);

      const updatedUser = {
        ...user,

        fullName: editData.fullName.trim(),

        phone: editData.phone.trim(),

        address: {
          street: editData.street.trim(),
          suburb: editData.suburb.trim(),
          city: editData.city.trim(),
          province: editData.province.trim(),
          postalCode: editData.postalCode.trim(),
        },
      };

      setUser(updatedUser);

      setShowEditModal(false);

      Alert.alert(
        "Profile Updated",
        "Your profile information has been updated."
      );
    } catch (error) {
      console.log("Profile update error:", error);

      Alert.alert(
        "Update Failed",
        "Something went wrong while updating your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     CHANGE PASSWORD
     
     Firebase Authentication password update should be
     connected here once your authentication setup is ready.
  ======================================================= */

  const handleChangePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      Alert.alert(
        "Incomplete Information",
        "Please fill in all password fields."
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      Alert.alert(
        "Password Error",
        "New passwords do not match."
      );
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert(
        "Password Error",
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setSaving(true);

      /*
       * TODO:
       * Connect Firebase Authentication password update here.
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswordModal(false);

      Alert.alert(
        "Password Updated",
        "Your password has been changed successfully."
      );
    } catch (error) {
      console.log("Password update error:", error);

      Alert.alert(
        "Password Update Failed",
        "Unable to update your password."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = async () => {
    try {
      setShowLogoutModal(false);

      await AsyncStorage.removeItem("userId");

      setUser(null);
      setIsLoggedIn(false);

      Alert.alert(
        "Logged Out",
        "You have been logged out successfully."
      );
    } catch (error) {
      console.log("Logout error:", error);

      Alert.alert(
        "Logout Failed",
        "Unable to log you out. Please try again."
      );
    }
  };

  /* =======================================================
     MENU PRESS
  ======================================================= */

  const handleMenuItemPress = (item: any) => {
    if (navigation?.navigate) {
      navigation.navigate(item.screen);
      return;
    }

    Alert.alert(
      item.title,
      `Open ${item.title}.`
    );
  };

  /* =======================================================
     QUICK ACTION
  ======================================================= */

  const handleQuickAction = (action: any) => {
    switch (action.id) {
      case "edit":
        openEditProfile();
        break;

      case "password":
        setShowPasswordModal(true);
        break;

      case "logout":
        setShowLogoutModal(true);
        break;

      default:
        break;
    }
  };

  /* =======================================================
     PROFILE HEADER
  ======================================================= */

  const renderProfileHeader = () => (
    <View style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          {user?.profilePhoto ? (
            <Image
              source={{
                uri: user.profilePhoto,
              }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profileInitials}>
                {getInitials(
                  user?.fullName ?? "Citizen"
                )}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.editImageButton}
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert(
                "Profile Photo",
                "Profile photo upload can be connected here."
              )
            }
          >
            <Ionicons
              name="camera-outline"
              size={15}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <Text
            style={styles.profileName}
            numberOfLines={2}
          >
            {user?.fullName ?? "Citizen"}
          </Text>

          <Text style={styles.profileId}>
            ID: {user?.idNumber ?? "Not available"}
          </Text>

          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />

            <Text style={styles.statusText}>
              {user?.accountStatus ??
                (user?.verified
                  ? "Verified"
                  : "Active")}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.profileDetails}>
        {/* PHONE */}

        <View style={styles.profileDetail}>
          <View style={styles.detailIcon}>
            <Ionicons
              name="call-outline"
              size={15}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.detailInformation}>
            <Text style={styles.detailLabel}>
              PHONE
            </Text>

            <Text style={styles.profileDetailText}>
              {user?.phone ?? "Not available"}
            </Text>
          </View>
        </View>

        {/* ADDRESS */}

        <View style={styles.profileDetail}>
          <View style={styles.detailIcon}>
            <Ionicons
              name="location-outline"
              size={15}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.detailInformation}>
            <Text style={styles.detailLabel}>
              ADDRESS
            </Text>

            <Text
              style={styles.profileDetailText}
              numberOfLines={3}
            >
              {formattedAddress}
            </Text>
          </View>
        </View>

        {/* DATE OF BIRTH */}

        <View style={styles.profileDetail}>
          <View style={styles.detailIcon}>
            <Ionicons
              name="calendar-outline"
              size={15}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.detailInformation}>
            <Text style={styles.detailLabel}>
              DATE OF BIRTH
            </Text>

            <Text style={styles.profileDetailText}>
              {user?.birthDate ?? "Not available"}
            </Text>
          </View>
        </View>

        {/* GENDER */}

        <View style={styles.profileDetail}>
          <View style={styles.detailIcon}>
            <Ionicons
              name="person-outline"
              size={15}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.detailInformation}>
            <Text style={styles.detailLabel}>
              GENDER
            </Text>

            <Text style={styles.profileDetailText}>
              {user?.gender ?? "Not specified"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* QUICK ACTIONS */}

      <View style={styles.quickActions}>
        {QUICK_ACTIONS.map((action, index) => {
          const isLogout = action.id === "logout";

          return (
            <React.Fragment key={action.id}>
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() =>
                  handleQuickAction(action)
                }
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    isLogout &&
                      styles.quickActionIconLogout,
                  ]}
                >
                  <Ionicons
                    name={action.icon as any}
                    size={17}
                    color={
                      isLogout
                        ? COLORS.danger
                        : COLORS.primary
                    }
                  />
                </View>

                <Text
                  style={[
                    styles.quickActionText,
                    isLogout &&
                      styles.quickActionTextLogout,
                  ]}
                >
                  {action.title}
                </Text>
              </TouchableOpacity>

              {index <
                QUICK_ACTIONS.length - 1 && (
                <View style={styles.quickDivider} />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );

  /* =======================================================
     DRIVER LICENCE CARD
  ======================================================= */

  const renderDriverLicence = () => {
    if (!user?.driverLicense) return null;

    const license = user.driverLicense;

    return (
      <View style={styles.dataCard}>
        <View style={styles.dataCardHeader}>
          <View style={styles.dataCardHeaderIcon}>
            <Ionicons
              name="card-outline"
              size={18}
              color={COLORS.primary}
            />
          </View>

          <View>
            <Text style={styles.dataCardTitle}>
              Driver Licence
            </Text>

            <Text style={styles.dataCardSubtitle}>
              Current licence information
            </Text>
          </View>
        </View>

        <View style={styles.dataGrid}>
          <InfoItem
            label="LICENCE NUMBER"
            value={license.number}
          />

          <InfoItem
            label="CLASS"
            value={license.class}
          />

          <InfoItem
            label="STATUS"
            value={license.status}
          />

          <InfoItem
            label="EXPIRY DATE"
            value={license.expiryDate}
          />

          <InfoItem
            label="ISSUE DATE"
            value={license.issueDate}
          />

          <InfoItem
            label="CARD NUMBER"
            value={license.cardNumber}
          />
        </View>
      </View>
    );
  };

  /* =======================================================
     VEHICLES
  ======================================================= */

  const renderVehicles = () => {
    if (!user?.vehicles?.length) {
      return (
        <View style={styles.dataCard}>
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="car-outline"
                size={22}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              No vehicles registered
            </Text>

            <Text style={styles.emptyDescription}>
              Your registered vehicles will appear
              here.
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.dataCard}>
        <View style={styles.dataCardHeader}>
          <View style={styles.dataCardHeaderIcon}>
            <Ionicons
              name="car-outline"
              size={18}
              color={COLORS.warning}
            />
          </View>

          <View>
            <Text style={styles.dataCardTitle}>
              My Vehicles
            </Text>

            <Text style={styles.dataCardSubtitle}>
              {user.vehicles.length} registered{" "}
              {user.vehicles.length === 1
                ? "vehicle"
                : "vehicles"}
            </Text>
          </View>
        </View>

        {user.vehicles.map((vehicle, index) => (
          <View
            key={vehicle.vehicleId}
            style={[
              styles.vehicleItem,
              index ===
                user.vehicles!.length - 1 &&
                styles.vehicleItemLast,
            ]}
          >
            <View style={styles.vehicleTop}>
              <View style={styles.vehicleIcon}>
                <Ionicons
                  name="car-outline"
                  size={20}
                  color={COLORS.warning}
                />
              </View>

              <View style={styles.vehicleMain}>
                <Text style={styles.vehicleRegistration}>
                  {vehicle.registrationNumber}
                </Text>

                <Text style={styles.vehicleName}>
                  {vehicle.make} {vehicle.model}
                </Text>
              </View>

              <Text style={styles.vehicleYear}>
                {vehicle.year}
              </Text>
            </View>

            <View style={styles.vehicleDetails}>
              <InfoItem
                label="COLOUR"
                value={vehicle.colour}
              />

              <InfoItem
                label="VIN"
                value={vehicle.vin}
              />

              <InfoItem
                label="ENGINE"
                value={vehicle.engineNumber}
              />

              <InfoItem
                label="LICENCE DISK"
                value={
                  vehicle.licenceDisk?.status ??
                  "Unknown"
                }
              />
            </View>

            <View style={styles.vehicleStatusRow}>
              <StatusPill
                label={
                  vehicle.roadworthy
                    ? "Roadworthy"
                    : "Not Roadworthy"
                }
                success={vehicle.roadworthy}
              />

              <StatusPill
                label={
                  vehicle.stolen
                    ? "Reported Stolen"
                    : "Not Stolen"
                }
                success={!vehicle.stolen}
              />

              <StatusPill
                label={
                  vehicle.ownership?.financed
                    ? "Financed"
                    : "Owned"
                }
                success={
                  !vehicle.ownership?.financed
                }
              />
            </View>
          </View>
        ))}
      </View>
    );
  };

  /* =======================================================
     ACCOUNT SECURITY
  ======================================================= */

  const renderSecurityCard = () => (
    <View style={styles.dataCard}>
      <View style={styles.dataCardHeader}>
        <View style={styles.dataCardHeaderIcon}>
          <Ionicons
            name="shield-checkmark-outline"
            size={18}
            color={COLORS.success}
          />
        </View>

        <View>
          <Text style={styles.dataCardTitle}>
            Account Security
          </Text>

          <Text style={styles.dataCardSubtitle}>
            Your account protection status
          </Text>
        </View>
      </View>

      <SecurityRow
        icon="checkmark-circle-outline"
        label="Account verification"
        value={
          user?.verified
            ? "Verified"
            : "Not verified"
        }
        success={user?.verified}
      />

      <SecurityRow
        icon="finger-print-outline"
        label="Biometric login"
        value={
          user?.preferences?.biometricLogin
            ? "Enabled"
            : "Disabled"
        }
        success={
          user?.preferences?.biometricLogin
        }
      />

      <SecurityRow
        icon="phone-portrait-outline"
        label="Registered device"
        value={
          device?.deviceId
            ? "This device"
            : "Unknown"
        }
        success={!!device?.deviceId}
      />
    </View>
  );

  /* =======================================================
     ACCOUNT SETTINGS
  ======================================================= */

  const renderMenuItems = () => (
    <View style={styles.menuCard}>
      <View style={styles.menuHeader}>
        <View style={styles.menuHeaderIcon}>
          <Ionicons
            name="settings-outline"
            size={17}
            color={COLORS.primary}
          />
        </View>

        <View style={styles.menuHeaderInformation}>
          <Text style={styles.menuTitle}>
            Account Settings
          </Text>

          <Text style={styles.menuDescription}>
            Manage your account and preferences
          </Text>
        </View>
      </View>

      <View style={styles.menuDivider} />

      {MENU_ITEMS.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.menuItem,
            index === MENU_ITEMS.length - 1 &&
              styles.menuItemLast,
          ]}
          onPress={() =>
            handleMenuItemPress(item)
          }
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.menuIconContainer,
              {
                backgroundColor: item.background,
              },
            ]}
          >
            <Ionicons
              name={item.icon as any}
              size={19}
              color={item.color}
            />
          </View>

          <View style={styles.menuItemInformation}>
            <Text style={styles.menuItemTitle}>
              {item.title}
            </Text>

            <Text
              style={styles.menuItemDescription}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={17}
            color="#A7B0BA"
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  /* =======================================================
     EDIT PROFILE MODAL
  ======================================================= */

  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      animationType="slide"
      transparent
      onRequestClose={() =>
        setShowEditModal(false)
      }
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalEyebrow}>
                ACCOUNT
              </Text>

              <Text style={styles.modalTitle}>
                Edit Profile
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                setShowEditModal(false)
              }
              style={styles.modalCloseButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close"
                size={20}
                color={COLORS.text}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <InputField
              label="FULL NAME *"
              placeholder="Enter your full name"
              value={editData.fullName}
              onChangeText={(text) =>
                setEditData({
                  ...editData,
                  fullName: text,
                })
              }
            />

            <InputField
              label="PHONE *"
              placeholder="Enter your phone number"
              value={editData.phone}
              onChangeText={(text) =>
                setEditData({
                  ...editData,
                  phone: text,
                })
              }
              keyboardType="phone-pad"
            />

            <InputField
              label="STREET"
              placeholder="Street address"
              value={editData.street}
              onChangeText={(text) =>
                setEditData({
                  ...editData,
                  street: text,
                })
              }
            />

            <InputField
              label="SUBURB"
              placeholder="Suburb"
              value={editData.suburb}
              onChangeText={(text) =>
                setEditData({
                  ...editData,
                  suburb: text,
                })
              }
            />

            <InputField
              label="CITY"
              placeholder="City"
              value={editData.city}
              onChangeText={(text) =>
                setEditData({
                  ...editData,
                  city: text,
                })
              }
            />

            <InputField
              label="PROVINCE"
              placeholder="Province"
              value={editData.province}
              onChangeText={(text) =>
                setEditData({
                  ...editData,
                  province: text,
                })
              }
            />

            <InputField
              label="POSTAL CODE"
              placeholder="Postal code"
              value={editData.postalCode}
              onChangeText={(text) =>
                setEditData({
                  ...editData,
                  postalCode: text,
                })
              }
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={[
                styles.submitButton,
                saving &&
                  styles.submitButtonDisabled,
              ]}
              onPress={handleEditProfile}
              disabled={saving}
              activeOpacity={0.8}
            >
              {saving ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-outline"
                    size={17}
                    color="#FFFFFF"
                  />

                  <Text
                    style={styles.submitButtonText}
                  >
                    Update Profile
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <View
              style={styles.modalBottomSpace}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  /* =======================================================
     PASSWORD MODAL
  ======================================================= */

  const renderPasswordModal = () => (
    <Modal
      visible={showPasswordModal}
      animationType="slide"
      transparent
      onRequestClose={() =>
        setShowPasswordModal(false)
      }
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalEyebrow}>
                SECURITY
              </Text>

              <Text style={styles.modalTitle}>
                Change Password
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                setShowPasswordModal(false)
              }
              style={styles.modalCloseButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close"
                size={20}
                color={COLORS.text}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.securityNotice}>
              <View style={styles.securityNoticeIcon}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={18}
                  color={COLORS.primary}
                />
              </View>

              <Text
                style={styles.securityNoticeText}
              >
                Use a strong password that you do not
                use on other accounts.
              </Text>
            </View>

            <InputField
              label="CURRENT PASSWORD *"
              placeholder="Enter current password"
              value={
                passwordData.currentPassword
              }
              onChangeText={(text) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: text,
                })
              }
              secureTextEntry
            />

            <InputField
              label="NEW PASSWORD *"
              placeholder="Enter new password"
              value={passwordData.newPassword}
              onChangeText={(text) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: text,
                })
              }
              secureTextEntry
            />

            <InputField
              label="CONFIRM NEW PASSWORD *"
              placeholder="Confirm new password"
              value={
                passwordData.confirmPassword
              }
              onChangeText={(text) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: text,
                })
              }
              secureTextEntry
            />

            <TouchableOpacity
              style={[
                styles.submitButton,
                saving &&
                  styles.submitButtonDisabled,
              ]}
              onPress={handleChangePassword}
              disabled={saving}
              activeOpacity={0.8}
            >
              {saving ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <>
                  <Ionicons
                    name="lock-closed-outline"
                    size={16}
                    color="#FFFFFF"
                  />

                  <Text
                    style={styles.submitButtonText}
                  >
                    Change Password
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <View
              style={styles.modalBottomSpace}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  /* =======================================================
     LOGOUT MODAL
  ======================================================= */

  const renderLogoutModal = () => (
    <Modal
      visible={showLogoutModal}
      transparent
      animationType="fade"
      onRequestClose={() =>
        setShowLogoutModal(false)
      }
    >
      <View style={styles.modalOverlayCenter}>
        <View style={styles.logoutModalContainer}>
          <View style={styles.logoutIconContainer}>
            <Ionicons
              name="log-out-outline"
              size={25}
              color={COLORS.danger}
            />
          </View>

          <Text style={styles.logoutTitle}>
            Confirm Logout
          </Text>

          <Text style={styles.logoutDescription}>
            Are you sure you want to log out of your
            Traffic Connect account?
          </Text>

          <View style={styles.logoutButtons}>
            <TouchableOpacity
              style={[
                styles.logoutButton,
                styles.logoutCancelButton,
              ]}
              onPress={() =>
                setShowLogoutModal(false)
              }
              activeOpacity={0.8}
            >
              <Text style={styles.logoutCancelText}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.logoutButton,
                styles.logoutConfirmButton,
              ]}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text
                style={styles.logoutConfirmText}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingIcon}>
            <Ionicons
              name="person-outline"
              size={25}
              color={COLORS.primary}
            />
          </View>

          <ActivityIndicator
            size="small"
            color={COLORS.primary}
          />

          <Text style={styles.loadingText}>
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /* =======================================================
     NO USER
  ======================================================= */

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyAccount}>
          <View style={styles.emptyAccountIcon}>
            <Ionicons
              name="person-outline"
              size={28}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.emptyAccountTitle}>
            No Account Found
          </Text>

          <Text style={styles.emptyAccountText}>
            Please sign in to view your profile.
          </Text>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() =>
              navigation?.navigate?.("Login")
            }
          >
            <Text style={styles.loginButtonText}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>
            TRAFFIC CONNECT
          </Text>

          <Text style={styles.pageTitle}>
            Profile
          </Text>

          <Text style={styles.pageSubtitle}>
            Manage your account and personal information
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="person-outline"
            size={20}
            color="#FFFFFF"
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {renderProfileHeader()}

        {renderDriverLicence()}

        {renderVehicles()}

        {renderSecurityCard()}

        {renderMenuItems()}

        <View style={styles.bottomNotice}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={COLORS.primary}
          />

          <Text style={styles.bottomNoticeText}>
            Keep your account information up to date
            to ensure your Traffic Connect services
            remain accurate.
          </Text>
        </View>
      </ScrollView>

      {renderEditModal()}
      {renderPasswordModal()}
      {renderLogoutModal()}
    </SafeAreaView>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoItemLabel}>
        {label}
      </Text>

      <Text
        style={styles.infoItemValue}
        numberOfLines={2}
      >
        {value || "Not available"}
      </Text>
    </View>
  );
}

/* =========================================================
   STATUS PILL
========================================================= */

function StatusPill({
  label,
  success,
}: {
  label: string;
  success: boolean;
}) {
  return (
    <View
      style={[
        styles.statusPill,
        {
          backgroundColor: success
            ? COLORS.softGreen
            : "#FDECEC",
        },
      ]}
    >
      <View
        style={[
          styles.statusPillDot,
          {
            backgroundColor: success
              ? COLORS.success
              : COLORS.danger,
          },
        ]}
      />

      <Text
        style={[
          styles.statusPillText,
          {
            color: success
              ? COLORS.success
              : COLORS.danger,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

/* =========================================================
   SECURITY ROW
========================================================= */

function SecurityRow({
  icon,
  label,
  value,
  success,
}: {
  icon: any;
  label: string;
  value: string;
  success?: boolean;
}) {
  return (
    <View style={styles.securityRow}>
      <View style={styles.securityRowLeft}>
        <Ionicons
          name={icon}
          size={18}
          color={
            success
              ? COLORS.success
              : COLORS.textLight
          }
        />

        <Text style={styles.securityRowLabel}>
          {label}
        </Text>
      </View>

      <Text
        style={[
          styles.securityRowValue,
          {
            color: success
              ? COLORS.success
              : COLORS.textLight,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: any;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>
        {label}
      </Text>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#9AA3AD"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={
          secureTextEntry
            ? "none"
            : undefined
        }
      />
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  topHeader: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: COLORS.primary,
    marginBottom: 4,
  },

  pageTitle: {
    fontSize: 27,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.5,
  },

  pageSubtitle: {
    marginTop: 4,
    fontSize: 12.5,
    color: COLORS.textLight,
    lineHeight: 18,
  },

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 14,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 35,
  },

  /* =======================================================
     PROFILE
  ======================================================= */

  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 14,
  },

  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  profileImageContainer: {
    position: "relative",
  },

  profileImage: {
    width: 76,
    height: 76,
    borderRadius: 22,
  },

  profilePlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },

  profileInitials: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.primary,
  },

  editImageButton: {
    position: "absolute",
    right: -5,
    bottom: -5,
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: COLORS.card,
  },

  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },

  profileName: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: "800",
    color: COLORS.text,
  },

  profileId: {
    marginTop: 5,
    fontSize: 12,
    color: COLORS.textLight,
  },

  statusBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: COLORS.softGreen,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },

  statusText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: COLORS.success,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 17,
  },

  profileDetails: {
    gap: 15,
  },

  profileDetail: {
    flexDirection: "row",
    alignItems: "center",
  },

  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  detailInformation: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
    color: "#89939F",
    marginBottom: 2,
  },

  profileDetailText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    lineHeight: 18,
  },

  quickActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  quickAction: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  quickActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },

  quickActionIconLogout: {
    backgroundColor: "#FDECEC",
  },

  quickActionText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: COLORS.text,
  },

  quickActionTextLogout: {
    color: COLORS.danger,
  },

  quickDivider: {
    width: 1,
    height: 34,
    backgroundColor: COLORS.border,
  },

  /* =======================================================
     DATA CARDS
  ======================================================= */

  dataCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 14,
  },

  dataCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 17,
  },

  dataCardHeaderIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  dataCardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },

  dataCardSubtitle: {
    fontSize: 11.5,
    color: COLORS.textLight,
    marginTop: 2,
  },

  dataGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },

  infoItem: {
    width: "46%",
  },

  infoItemLabel: {
    fontSize: 8.5,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: "#89939F",
    marginBottom: 4,
  },

  infoItemValue: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.text,
    lineHeight: 17,
  },

  /* =======================================================
     VEHICLES
  ======================================================= */

  vehicleItem: {
    paddingTop: 15,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  vehicleItemLast: {
    paddingBottom: 0,
  },

  vehicleTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  vehicleIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: COLORS.softYellow,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  vehicleMain: {
    flex: 1,
  },

  vehicleRegistration: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },

  vehicleName: {
    marginTop: 2,
    fontSize: 11.5,
    color: COLORS.textLight,
  },

  vehicleYear: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textLight,
  },

  vehicleDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 13,
    marginTop: 16,
  },

  vehicleStatusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 15,
  },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusPillDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 5,
  },

  statusPillText: {
    fontSize: 9.5,
    fontWeight: "800",
  },

  /* =======================================================
     SECURITY
  ======================================================= */

  securityRow: {
    minHeight: 47,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  securityRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  securityRowLabel: {
    marginLeft: 10,
    fontSize: 12.5,
    fontWeight: "600",
    color: COLORS.text,
  },

  securityRowValue: {
    fontSize: 11,
    fontWeight: "800",
  },

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  emptyState: {
    alignItems: "center",
    paddingVertical: 14,
  },

  emptyIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
  },

  emptyDescription: {
    marginTop: 4,
    fontSize: 11.5,
    color: COLORS.textLight,
    textAlign: "center",
  },

  /* =======================================================
     MENU
  ======================================================= */

  menuCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 17,
    marginBottom: 14,
    overflow: "hidden",
  },

  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 15,
  },

  menuHeaderIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  menuHeaderInformation: {
    flex: 1,
  },

  menuTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },

  menuDescription: {
    marginTop: 2,
    fontSize: 11.5,
    color: COLORS.textLight,
  },

  menuDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },

  menuItem: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  menuItemLast: {
    borderBottomWidth: 0,
  },

  menuIconContainer: {
    width: 39,
    height: 39,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  menuItemInformation: {
    flex: 1,
    paddingRight: 10,
  },

  menuItemTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
  },

  menuItemDescription: {
    marginTop: 3,
    fontSize: 10.5,
    color: COLORS.textLight,
    lineHeight: 15,
  },

  /* =======================================================
     NOTICE
  ======================================================= */

  bottomNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.softBlue,
    borderRadius: 14,
    padding: 13,
    marginTop: 1,
  },

  bottomNoticeText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 10.5,
    color: COLORS.primary,
    lineHeight: 15,
    fontWeight: "600",
  },

  /* =======================================================
     LOADING
  ======================================================= */

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  loadingIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "600",
  },

  /* =======================================================
     EMPTY ACCOUNT
  ======================================================= */

  emptyAccount: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyAccountIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  emptyAccountTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.text,
  },

  emptyAccountText: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: "center",
  },

  loginButton: {
    marginTop: 20,
    height: 46,
    paddingHorizontal: 28,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  /* =======================================================
     MODALS
  ======================================================= */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: "92%",
    paddingTop: 19,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  modalEyebrow: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: COLORS.primary,
    marginBottom: 3,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },

  modalCloseButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F1F3F5",
    alignItems: "center",
    justifyContent: "center",
  },

  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },

  inputGroup: {
    marginBottom: 16,
  },

  inputLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.7,
    color: "#727D88",
    marginBottom: 7,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    paddingHorizontal: 14,
    fontSize: 13,
    color: COLORS.text,
    backgroundColor: "#FBFCFD",
  },

  securityNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.softBlue,
    borderRadius: 14,
    padding: 13,
    marginBottom: 18,
  },

  securityNoticeIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  securityNoticeText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.primary,
    fontWeight: "600",
  },

  submitButton: {
    height: 49,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },

  submitButtonDisabled: {
    opacity: 0.65,
  },

  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  modalBottomSpace: {
    height: 30,
  },

  /* =======================================================
     LOGOUT
  ======================================================= */

  modalOverlayCenter: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },

  logoutModalContainer: {
    width: "100%",
    maxWidth: 390,
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 22,
  },

  logoutIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FDECEC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  logoutTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },

  logoutDescription: {
    marginTop: 7,
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 18,
  },

  logoutButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 22,
  },

  logoutButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  logoutCancelButton: {
    backgroundColor: "#F1F3F5",
  },

  logoutConfirmButton: {
    backgroundColor: COLORS.danger,
  },

  logoutCancelText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.text,
  },

  logoutConfirmText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});

