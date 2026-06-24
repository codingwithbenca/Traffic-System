import React, { createContext, useContext, useEffect, useState } from "react";
import { getDeviceInfo } from "../utils/device";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

/* =========================
   TYPES
========================= */

type CitizenUser = {
  phone: string;
  verified: boolean;
  fullName?: string;
  licenseStatus?: boolean;
  vehicleCount?: number;
  devices?: any;
};

type AuthContextType = {
  user: CitizenUser | null;
  loading: boolean;
  isLoggedIn: boolean;
  device: any;
  setIsLoggedIn: (value: boolean) => void;
  setUser: (user: CitizenUser | null) => void;
};

/* =========================
   CONTEXT
========================= */

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isLoggedIn: false,
  device: null,
  setIsLoggedIn: () => {},
  setUser: () => {},
});

/* =========================
   PROVIDER
========================= */

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<CitizenUser | null>(null);
  const [device, setDevice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loadSession = async () => {
    try {
      const dev = await getDeviceInfo();
      setDevice(dev);

      const savedUserId = null; // later: AsyncStorage or token

      if (!savedUserId) {
        setLoading(false);
        return;
      }

      const ref = doc(db, "citizens", savedUserId);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setLoading(false);
        return;
      }

      const data = snap.data() as CitizenUser;

      // 🔐 DEVICE GUARD
      if (!data.devices?.[dev.deviceId]) {
        setUser(null);
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      setUser(data);
      setIsLoggedIn(true);
    } catch (error) {
      console.log("Auth error:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn,
        device,
        setIsLoggedIn,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =========================
   HOOK
========================= */

export const useAuth = () => useContext(AuthContext);