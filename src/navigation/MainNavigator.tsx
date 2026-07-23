import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TabNavigator from "./TabNavigator";

/* ================= HOME ================= */

import NotificationsScreen from "../screens/HOME/notifications";
import ProfileScreen from "../screens/HOME/profile";
import DriverLicenseScreen from "../screens/HOME/driver-license";
import FinesScreen from "../screens/HOME/fines";
import VehicleLicenseScreen from "../screens/HOME/vehicle-license";
import AppointmentsScreen from "../screens/HOME/appointments";

/* ================= LICENSES ================= */

import MyLicensesScreen from "../screens/LicensesScreen";
import DigitalLicenseScreen from "../screens/LICENSES/digital-license";
import QRCodeScreen from "../screens/LICENSES/qr-code";
import NFCVerificationScreen from "../screens/LICENSES/nfc-verification";
import RenewDriverLicenseScreen from "../screens/LICENSES/renew-driver-license";
import VehicleInformationScreen from "../screens/LICENSES/vehicle-information";
import RenewVehicleLicenseScreen from "../screens/LICENSES/renew-vehicle-license";

/* ================= PAYMENTS ================= */

import SpeedCameraTicketsScreen from "../screens/PAYMENTS/speed-camera-tickets";
import OutstandingPenaltiesScreen from "../screens/PAYMENTS/outstanding-penalties";
import FinesOverviewScreen from "../screens/PAYMENTS/fines-overview";
import VehiclePaymentsScreen from "../screens/PAYMENTS/vehicle-payments";
import VehicleRegistrationFeesScreen from "../screens/PAYMENTS/vehicle-registration-fees";
import LicenseDiskPaymentsScreen from "../screens/PAYMENTS/license-disk-payments";
import CardPaymentsScreen from "../screens/PAYMENTS/card-payments";
import InstantEFTScreen from "../screens/PAYMENTS/instant-eft";
import MobilePaymentsScreen from "../screens/PAYMENTS/mobile-payments";
import PaymentHistoryScreen from "../screens/PAYMENTS/payment-history";
import DownloadReceiptsScreen from "../screens/PAYMENTS/download-receipts";
import EmailReceiptsScreen from "../screens/PAYMENTS/email-receipts";

/* ================= SERVICES ================= */

import AvailableSlotsScreen from "../screens/SERVICES/available-slots";
import AvailableTimesScreen from "../screens/SERVICES/available-times";
import BranchesScreen from "../screens/SERVICES/branches";
import BranchLocationsScreen from "../screens/SERVICES/branch-locations";
import UploadIDScreen from "../screens/SERVICES/upload-id";
import UploadProofAddressScreen from "../screens/SERVICES/upload-proof-address";
import UploadDocumentsScreen from "../screens/SERVICES/upload-documents";
import ApplicationsDashboardScreen from "../screens/SERVICES/applications-dashboard";

import LearnersTestScreen from "../screens/SERVICES/learners-test";
import DriversTestScreen from "../screens/SERVICES/drivers-test";
import NewLicenseApplicationScreen from "../screens/SERVICES/new-license-application";
import VehicleRegistrationScreen from "../screens/SERVICES/vehicle-registration";
import ChangeOwnershipScreen from "../screens/SERVICES/change-ownership";
import OwnershipTransferScreen from "../screens/SERVICES/ownership-transfer";

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
      }}
    >
      {/* Bottom Tabs */}
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      {/* HOME */}

      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: "Notifications" }}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />

      <Stack.Screen
        name="DriverLicense"
        component={DriverLicenseScreen}
        options={{ title: "Driver License" }}
      />

      <Stack.Screen
        name="VehicleLicense"
        component={VehicleLicenseScreen}
        options={{ title: "Vehicle License" }}
      />

      <Stack.Screen
        name="Fines"
        component={FinesScreen}
        options={{ title: "Traffic Fines" }}
      />

      <Stack.Screen
        name="Appointments"
        component={AppointmentsScreen}
        options={{ title: "Appointments" }}
      />

      {/* LICENSES */}

      <Stack.Screen
        name="MyLicenses"
        component={MyLicensesScreen}
        options={{ title: "My Licenses" }}
      />

      <Stack.Screen
        name="DigitalLicense"
        component={DigitalLicenseScreen}
        options={{ title: "Digital Driver License" }}
      />

      <Stack.Screen
        name="QRCode"
        component={QRCodeScreen}
        options={{ title: "QR Code" }}
      />

      <Stack.Screen
        name="NFCVerification"
        component={NFCVerificationScreen}
        options={{ title: "NFC Verification" }}
      />

      <Stack.Screen
        name="RenewDriverLicense"
        component={RenewDriverLicenseScreen}
        options={{ title: "Renew Driver License" }}
      />

      <Stack.Screen
        name="VehicleInformation"
        component={VehicleInformationScreen}
        options={{ title: "Vehicle Information" }}
      />

      <Stack.Screen
        name="RenewVehicleLicense"
        component={RenewVehicleLicenseScreen}
        options={{ title: "Renew Vehicle License" }}
      />
            {/* ================= PAYMENTS ================= */}

      <Stack.Screen
        name="SpeedCameraTickets"
        component={SpeedCameraTicketsScreen}
        options={{ title: "Speed Camera Tickets" }}
      />

      <Stack.Screen
        name="OutstandingPenalties"
        component={OutstandingPenaltiesScreen}
        options={{ title: "Outstanding Penalties" }}
      />

      <Stack.Screen
        name="FinesOverview"
        component={FinesOverviewScreen}
        options={{ title: "Fines Overview" }}
      />

      <Stack.Screen
        name="VehiclePayments"
        component={VehiclePaymentsScreen}
        options={{ title: "Vehicle Payments" }}
      />

      <Stack.Screen
        name="VehicleRegistrationFees"
        component={VehicleRegistrationFeesScreen}
        options={{ title: "Vehicle Registration Fees" }}
      />

      <Stack.Screen
        name="LicenseDiskPayments"
        component={LicenseDiskPaymentsScreen}
        options={{ title: "License Disk Payments" }}
      />

      <Stack.Screen
        name="CardPayments"
        component={CardPaymentsScreen}
        options={{ title: "Card Payments" }}
      />

      <Stack.Screen
        name="InstantEFT"
        component={InstantEFTScreen}
        options={{ title: "Instant EFT" }}
      />

      <Stack.Screen
        name="MobilePayments"
        component={MobilePaymentsScreen}
        options={{ title: "Mobile Payments" }}
      />

      <Stack.Screen
        name="PaymentHistory"
        component={PaymentHistoryScreen}
        options={{ title: "Payment History" }}
      />

      <Stack.Screen
        name="DownloadReceipts"
        component={DownloadReceiptsScreen}
        options={{ title: "Download Receipts" }}
      />

      <Stack.Screen
        name="EmailReceipts"
        component={EmailReceiptsScreen}
        options={{ title: "Email Receipts" }}
      />

      {/* ================= SERVICES ================= */}

      <Stack.Screen
        name="AvailableSlots"
        component={AvailableSlotsScreen}
        options={{ title: "Available Slots" }}
      />

      <Stack.Screen
        name="AvailableTimes"
        component={AvailableTimesScreen}
        options={{ title: "Available Times" }}
      />

      <Stack.Screen
        name="AvailableBranches"
        component={BranchesScreen}
        options={{ title: "Available Branches" }}
      />

      <Stack.Screen
        name="BranchLocations"
        component={BranchLocationsScreen}
        options={{ title: "Branch Locations" }}
      />

      <Stack.Screen
        name="LearnersTest"
        component={LearnersTestScreen}
        options={{ title: "Learner's License Test" }}
      />

      <Stack.Screen
        name="DriversTest"
        component={DriversTestScreen}
        options={{ title: "Driver's Test" }}
      />

      <Stack.Screen
        name="NewLicenseApplication"
        component={NewLicenseApplicationScreen}
        options={{ title: "New License Application" }}
      />

      <Stack.Screen
        name="VehicleRegistration"
        component={VehicleRegistrationScreen}
        options={{ title: "Vehicle Registration" }}
      />

      <Stack.Screen
        name="ChangeOwnership"
        component={ChangeOwnershipScreen}
        options={{ title: "Change of Ownership" }}
      />

      <Stack.Screen
        name="OwnershipTransfer"
        component={OwnershipTransferScreen}
        options={{ title: "Ownership Transfer" }}
      />

      <Stack.Screen
        name="UploadID"
        component={UploadIDScreen}
        options={{ title: "Upload ID" }}
      />

      <Stack.Screen
        name="UploadProofAddress"
        component={UploadProofAddressScreen}
        options={{ title: "Upload Proof of Address" }}
      />

      <Stack.Screen
        name="UploadDocuments"
        component={UploadDocumentsScreen}
        options={{ title: "Upload Supporting Documents" }}
      />

      <Stack.Screen
        name="ApplicationsDashboard"
        component={ApplicationsDashboardScreen}
        options={{ title: "Applications Dashboard" }}
      />

    </Stack.Navigator>
  );
}