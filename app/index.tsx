import { Redirect } from "expo-router";
import React from "react";
import { useAuth } from "../context/authContext";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { getUserProfile } from "../services/userService";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const { user, loading } = useAuth();
  const [seen, setSeen] = useState<boolean | null>(null);
  const [needsFarmSetup, setNeedsFarmSetup] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("onboarding_done").then((val) =>
      setSeen(val === "true"),
    );
  }, []);

  useEffect(() => {
    if (!user) {
      setNeedsFarmSetup(null);
      return;
    }

    let cancelled = false;
    AsyncStorage.getItem("farm_setup_skipped").then(async (skipped) => {
      if (skipped === "true") {
        if (!cancelled) setNeedsFarmSetup(false);
        return;
      }
      try {
        const profile = await getUserProfile();
        if (!cancelled) setNeedsFarmSetup(!profile?.farmProfile?.farmName);
      } catch {
        // Network/profile lookup failed — don't trap the user on a blank screen.
        if (!cancelled) setNeedsFarmSetup(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!loading && seen !== null && (!user || needsFarmSetup !== null)) {
      SplashScreen.hideAsync();
    }
  }, [loading, seen, user, needsFarmSetup]);

  if (loading || seen === null || (user && needsFarmSetup === null)) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#1B4332",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color="#FFFFFF" size="large" />
      </View>
    );
  }

  if (user) {
    return (
      <Redirect href={needsFarmSetup ? "/auth/farmSetup" : "/(tabs)/home"} />
    );
  }
  return <Redirect href={seen ? "/auth/splash" : "/onboarding"} />;
}
