import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";

import AuthNavigator from "./AuthNavigator";
import TabNavigator from "./TabNavigator";

export default function RootNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <TabNavigator />
      ) : (
        <AuthNavigator setIsLoggedIn={setIsLoggedIn} />
      )}
    </NavigationContainer>
  );
}