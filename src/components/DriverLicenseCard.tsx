import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
} from "react-native-reanimated";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function DriverLicenseCard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Animated.View
      layout={Layout.springify()}
      entering={FadeIn}
      exiting={FadeOut}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.summary}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.9}
      >
        <View style={styles.row}>
          <MaterialIcons name="badge" size={28} color="#003366" />

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.title}>Driver Licence</Text>
            <Text style={styles.subtitle}>
              Valid • Expires 12 Mar 2030
            </Text>
          </View>

          <View style={styles.status}>
            <Text style={styles.statusText}>VALID</Text>
          </View>
        </View>
      </TouchableOpacity>

      {expanded && (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={styles.licence}
        >
          <Text style={styles.country}>
            Republic of South Africa
          </Text>

          <Text style={styles.heading}>
            Driver Licence
          </Text>

          <Image
            source={{
              uri: "https://i.pravatar.cc/200",
            }}
            style={styles.photo}
          />

          <Text style={styles.name}>
            Ebenca Mohlala
          </Text>

          <Text style={styles.detail}>
            Licence No: DL123456789
          </Text>

          <Text style={styles.detail}>
            ID: 0101015009087
          </Text>

          <Text style={styles.detail}>
            Code: B
          </Text>

          <Text style={styles.detail}>
            Expires: 12 Mar 2030
          </Text>

          <View style={styles.qr}>
            <Ionicons
              name="qr-code-outline"
              size={70}
              color="#003366"
            />
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>
                Download
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>
                Share
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },

  summary: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 4,
    color: "#666",
  },

  status: {
    backgroundColor: "#DFF6E5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    color: "#2E7D32",
    fontWeight: "700",
    fontSize: 12,
  },

  licence: {
    marginTop: 12,
    backgroundColor: "#003366",
    borderRadius: 20,
    padding: 20,
  },

  country: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "600",
  },

  heading: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 6,
    marginBottom: 20,
  },

  photo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignSelf: "center",
    marginBottom: 15,
  },

  name: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 15,
  },

  detail: {
    color: "#FFF",
    marginBottom: 8,
    fontSize: 15,
  },

  qr: {
    alignItems: "center",
    marginVertical: 25,
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  button: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },

  buttonText: {
    textAlign: "center",
    fontWeight: "700",
    color: "#003366",
  },
});