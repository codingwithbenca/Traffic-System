
import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";

import { useAuth } from "../context/AuthContext";

export default function RootNavigator() {
  const { isLoggedIn, loading } = useAuth();

  // Wait until the saved session has been checked.
  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
