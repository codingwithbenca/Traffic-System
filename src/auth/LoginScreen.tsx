import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { verifyLogin } from "../services/authService";
import { getDeviceInfo } from "../utils/device";
import SeedCitizensButton from "../components/SeedCitizensButton";



export default function LoginScreen({
  navigation,
  setIsLoggedIn,
}: any) {
  const [idNumber, setIdNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (!idNumber) {
      setMessage("Please enter your ID Number");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // 📱 get device info
      const device = await getDeviceInfo();

      // 🔐 login check from Firebase
      const result = await verifyLogin(idNumber, device);

      if (result.success) {
        setIsLoggedIn(true);
      } else {
        setMessage(result.message);
      }
    } catch (error: any) {
      console.log("Login error:", error);
      setMessage("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
     
    <View
      style={{
        flex: 1,
        padding: 24,
        justifyContent: "center",
        backgroundColor: "#F4F5F7",
      }}
    >
      {/* TITLE */}
      <Text
        style={{
          fontSize: 26,
          fontWeight: "700",
          color: "#111",
          marginBottom: 30,
        }}
      >
        TrafficConnect SA
      </Text>

      {/* ID INPUT */}
      <TextInput
        placeholder="South African ID Number"
        placeholderTextColor="#888"
        value={idNumber}
        onChangeText={setIdNumber}
        style={{
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#D0D0D0",
          padding: 14,
          borderRadius: 10,
          marginBottom: 20,
          color: "#111",
        }}
      />

      {/* LOGIN BUTTON */}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: "#3F51B5",
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 12,
          opacity: loading ? 0.7 : 1,
        }}
      >
  

        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Login
          </Text>
        )}
      </TouchableOpacity>

      {/* BIOMETRIC (placeholder for later) */}
      <TouchableOpacity
        onPress={() => console.log("Biometric login")}
        style={{
          borderWidth: 1,
          borderColor: "#3F51B5",
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 20,
          backgroundColor: "#fff",
        }}
      >
        <Text style={{ color: "#3F51B5" }}>
          Use Fingerprint / Face ID
        </Text>
      </TouchableOpacity>

      {/* MESSAGE */}
      {message !== "" && (
        <Text
          style={{
            textAlign: "center",
            color: "red",
            fontSize: 13,
            marginBottom: 15,
          }}
        >
          {message}
        </Text>
      )}

      {/* FOOTER ACTIONS */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={{ color: "#111", fontSize: 13 }}>
            Forgot password
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={{ color: "#3F51B5", fontSize: 13, fontWeight: "500" }}>
            Activate Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}