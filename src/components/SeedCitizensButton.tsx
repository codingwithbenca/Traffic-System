import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";

import { db } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";

const citizens = [
  {
    id: "1000000000001",
    fullName: "Malusi",
    phone: "07729077759",
  },
  {
    id: "1000000000002",
    fullName: "Mabusa",
    phone: "07682096402",
  },
  {
    id: "1000000000003",
    fullName: "Orebetse",
    phone: "07797057222",
  },
  {
    id: "1000000000004",
    fullName: "Kamohelo",
    phone: "07827497455",
  },
  {
    id: "1000000000005",
    fullName: "Kagoentle",
    phone: "07677747261",
  },
  {
    id: "1000000000006",
    fullName: "De Nas",
    phone: "07610630843",
  },
  {
    id: "1000000000007",
    fullName: "Child",
    phone: "07647331671",
  },
  {
    id: "1000000000008",
    fullName: "Your Name",
    phone: "068990890909", // Replace with your number
  },
];

export default function SeedCitizensButton() {
  const [loading, setLoading] = useState(false);

  const injectCitizens = async () => {
    try {
      setLoading(true);

      for (const citizen of citizens) {
        await setDoc(doc(db, "citizens", citizen.id), {
          idNumber: citizen.id,
          fullName: citizen.fullName,
          phone: citizen.phone,

          verified: false,

          devices: {},

          suspiciousDevices: {},

          lockNewDevices: false,

          lastLoginDevice: null,

          lastLoginAt: null,

          biometricEnabled: false,

          accountStatus: "active",

          createdAt: new Date().toISOString(),

          updatedAt: new Date().toISOString(),
        });
      }

      Alert.alert(
        "Success",
        `${citizens.length} citizens injected successfully.`
      );
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Failed to inject citizens.");
    }

    setLoading(false);
  };

  return (
    <TouchableOpacity
      onPress={injectCitizens}
      disabled={loading}
      style={{
        backgroundColor: "#1976D2",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        margin: 20,
      }}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text
          style={{
            color: "#fff",
            fontWeight: "700",
            fontSize: 16,
          }}
        >
          Inject Test Citizens
        </Text>
      )}
    </TouchableOpacity>
  );
}