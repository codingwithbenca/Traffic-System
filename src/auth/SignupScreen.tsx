import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Linking,
  ScrollView,
} from "react-native";

import { getDeviceInfo } from "../utils/device";
import { verifyUser } from "../services/authService";

export default function VerifyAccountScreen({ navigation }: any) {
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | "info" | ""
  >("");

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const showMessage = (text: string, type: "success" | "error" | "info") => {
    setMessage(text);
    setMessageType(type);
  };

  useEffect(() => {
    if (messageType === "error") {
      shake();
    }
  }, [message]);

  const shake = () => {
    shakeAnim.setValue(0);

    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
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

  const handleVerify = async () => {
    if (!idNumber || !phone) {
      showMessage("Please enter ID number and phone number.", "error");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const device = await getDeviceInfo();
      const result = await verifyUser(idNumber, phone, device);

      if (result.success) {
        showMessage(result.message, "success");

        setTimeout(() => {
          navigation.replace("Login");
        }, 1200);
      } else {
        showMessage(result.message, "error");
      }
    } catch (error: any) {
      showMessage(error?.message || "Something went wrong. Try again.", "error");
    }

    setLoading(false);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 24,
        justifyContent: "center",
        backgroundColor: "#F4F5F7",
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={{ fontSize: 26, fontWeight: "700", marginBottom: 10 }}>
        Verify Account
      </Text>

      <Text style={{ fontSize: 13, color: "#666", marginBottom: 25 }}>
        Link your existing government record to access TrafficConnect SA services.
      </Text>

      <TextInput
        placeholder="South African ID Number"
        value={idNumber}
        onChangeText={setIdNumber}
        keyboardType="number-pad"
        style={{
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#D0D0D0",
          padding: 14,
          borderRadius: 10,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Registered Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={{
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#D0D0D0",
          padding: 14,
          borderRadius: 10,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={handleVerify}
        disabled={loading}
        style={{
          backgroundColor: "#3F51B5",
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Verify
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => console.log("Biometric verify")}
        style={{
          borderWidth: 1,
          borderColor: "#3F51B5",
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 12,
          backgroundColor: "#fff",
        }}
      >
        <Text style={{ color: "#3F51B5" }}>
          Verify with Fingerprint / Face ID
        </Text>
      </TouchableOpacity>

      {/* TRUST TEXT */}
      <Text
        style={{
          fontSize: 11,
          color: "#777",
          textAlign: "center",
          marginTop: 12,
          paddingHorizontal: 10,
        }}
      >
        Your data is securely encrypted and only used for government verification.
      </Text>

      {/* SUPPORT */}
      <TouchableOpacity
        onPress={() => {
          const supportNumber = "27760000000";
          const message = "Hi, I need help with account verification.";
          const url = `https://wa.me/${supportNumber}?text=${encodeURIComponent(message)}`;
          Linking.openURL(url);
        }}
        style={{ marginTop: 12, alignItems: "center" }}
      >
        <Text style={{ color: "#1565C0", fontWeight: "600" }}>
          Need Help? Contact Support
        </Text>
      </TouchableOpacity>

      {/* MESSAGE */}
      {message !== "" && (
        <Animated.Text
          style={[
            {
              marginTop: 20,
              textAlign: "center",
              fontSize: 13,
              fontWeight: "600",
              color:
                messageType === "success"
                  ? "green"
                  : messageType === "error"
                  ? "red"
                  : "#1565C0",
            },
            messageType === "error" && shakeStyle,
          ]}
        >
          {message}
        </Animated.Text>
      )}
    </ScrollView>
  );
}