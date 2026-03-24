import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getUserProfile } from "@/services/userService";
import { getLogs, LogEntry } from "@/services/logService";
import { useAuth } from "@/context/authContext";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "@/services/firebase";

const ACTIVITY_META: Record<
  string,
  { icon: string; color: string; label: string }
> = {
  planting: { icon: "leaf-outline", color: "#4ADE80", label: "Planting" },
  watering: { icon: "water-outline", color: "#3B82F6", label: "Watering" },
  fertilizing: {
    icon: "flask-outline",
    color: "#F59E0B",
    label: "Fertilizing",
  },
  weeding: { icon: "cut-outline", color: "#6B7280", label: "Weeding" },
  spraying: { icon: "medical-outline", color: "#EF4444", label: "Spraying" },
  harvest: { icon: "basket-outline", color: "#1B4332", label: "Harvesting" },
};

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) loadData();
      else setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loadData = async () => {
    try {
      const [userData, logsData] = await Promise.all([
        getUserProfile(),
        getLogs(),
      ]);
      setProfile(userData);
      setLogs(logsData);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  )

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const totalExpenses = logs.reduce((sum, l) => sum + (l.cost || 0), 0);
  const totalYield = logs.reduce((sum, l) => sum + (l.quantity || 0), 0);
  const recentLogs = logs.slice(0, 5);

  const formatCurrency = (amount: number) =>
    `GH₵ ${amount.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-muted">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Greeting */}
        <View className="mb-8">
          <Text className="text-text-secondary text-sm">{greeting()}</Text>
          <Text className="text-text-primary font-bold text-3xl">
            {profile?.fullName || user?.email?.split("@")[0] || "Farmer"}
          </Text>
          <Text className="text-text-secondary text-sm">
            {profile?.farmProfile?.farmName || "Your farm dashboard"}
          </Text>
        </View>

        {/* Weather Card */}
        <View className="mb-8 flex-row bg-primary rounded-xl items-center justify-between">
          <View className="flex-col px-4 py-6 gap-1">
            <Text className="text-surface text-sm">Today's Weather</Text>
            <Text className="text-white font-bold text-4xl">28°C</Text>
            <Text className="text-white text-sm">Accra</Text>
          </View>
          <View className="flex-col p-4 items-center">
            <Text style={{ fontSize: 64 }}>☀️</Text>
            <Text className="text-white text-sm mt-2">Sunny</Text>
          </View>
        </View>

        {/* Season Overview */}
        <View className="mb-8">
          <Text className="font-bold text-xl text-text-primary mb-4">
            Season Overview
          </Text>

          <View className="flex-row gap-4 mb-4">
            <View className="gap-2 bg-surface p-4 rounded-xl flex-1">
              <Ionicons name="calendar-outline" size={24} />
              <Text className="text-xs text-text-muted">Season Start</Text>
              <Text className="font-bold text-text-primary">
                {profile?.experience?.seasonStart || "Not Set"}
              </Text>
            </View>
            <View className="gap-2 bg-surface p-4 rounded-xl flex-1">
              <Ionicons name="leaf-outline" size={24} />
              <Text className="text-xs text-text-muted">Active Crops</Text>
              <Text className="font-bold text-text-primary">
                {profile?.farmProfile?.primaryCrops?.length
                  ? `${profile.farmProfile.primaryCrops.length} crops`
                  : "Not Set"}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-4">
            <View className="gap-2 bg-surface p-4 rounded-xl flex-1">
              <Ionicons name="cash-outline" size={24} color="#F59E0B" />
              <Text className="text-xs text-text-muted">Total Expenses</Text>
              <Text className="font-bold text-text-primary">
                {formatCurrency(totalExpenses)}
              </Text>
            </View>
            <View className="gap-2 bg-surface p-4 rounded-xl flex-1">
              <Ionicons name="trending-up-outline" size={24} color="#4ADE80" />
              <Text className="text-xs text-text-muted">Total Yield</Text>
              <Text className="font-bold text-text-primary">
                {totalYield > 0 ? `${totalYield.toLocaleString()} kg` : "0 kg"}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-text-primary font-bold text-lg mb-4">
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <TouchableOpacity
              className="flex-1 min-w-[45%] bg-primary rounded-xl p-4 items-center"
              onPress={() => router.push("/(tabs)/logs")}
            >
              <Ionicons name="add-circle-outline" size={32} color="#FFFFFF" />
              <Text className="text-white font-semibold text-sm mt-2">
                Log Activity
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 min-w-[45%] bg-surface border border-border rounded-xl p-4 items-center"
              onPress={() => router.push("/(tabs)/logs")}
            >
              <Ionicons name="wallet-outline" size={32} color="#1B4332" />
              <Text className="text-text-primary font-semibold text-sm mt-2">
                Add Expense
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 min-w-[45%] bg-surface border border-border rounded-xl p-4 items-center"
              onPress={() => router.push("/(tabs)/logs")}
            >
              <Ionicons name="barbell-outline" size={32} color="#1B4332" />
              <Text className="text-text-primary font-semibold text-sm mt-2">
                Record Harvest
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 min-w-[45%] bg-accent rounded-xl p-4 items-center"
              onPress={() => router.push("/(tabs)/chat")}
            >
              <Ionicons name="chatbubbles-outline" size={32} color="#FFFFFF" />
              <Text className="text-white font-semibold text-sm mt-2">
                Ask Shamba AI
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-text-primary font-bold text-lg">
              Recent Activity
            </Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/logs")}>
              <Text className="text-accent text-sm font-semibold">See All</Text>
            </TouchableOpacity>
          </View>

          {recentLogs.length === 0 ? (
            <View className="bg-surface border border-border rounded-xl p-6 items-center">
              <Ionicons
                name="document-text-outline"
                size={48}
                color="#9CA3AF"
              />
              <Text className="text-text-muted text-sm mt-3 text-center">
                No activities yet
              </Text>
              <Text className="text-text-muted text-xs mt-1 text-center">
                Start logging your farm activities to see them here
              </Text>
              <TouchableOpacity
                className="mt-4 bg-primary px-6 py-2 rounded-full"
                onPress={() => router.push("/(tabs)/logs")}
              >
                <Text className="text-white font-semibold text-sm">
                  Log Your First Activity
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {recentLogs.map((log) => {
                const meta =
                  ACTIVITY_META[log.activityType] || ACTIVITY_META.planting;
                return (
                  <View
                    key={log._id}
                    className="flex-row items-center bg-surface border border-border rounded-xl p-3"
                    style={{ gap: 12 }}
                  >
                    <View
                      className="rounded-full p-2"
                      style={{ backgroundColor: `${meta.color}20` }}
                    >
                      <Ionicons
                        name={meta.icon as any}
                        size={20}
                        color={meta.color}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-text-primary font-semibold text-sm">
                        {meta.label} — {log.crop}
                      </Text>
                      <Text className="text-text-muted text-xs mt-0.5">
                        {new Date(log.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </Text>
                    </View>
                    {log.cost && log.cost > 0 ? (
                      <Text className="text-text-secondary text-xs font-semibold">
                        {formatCurrency(log.cost)}
                      </Text>
                    ) : null}
                    {log.quantity && log.quantity > 0 ? (
                      <Text className="text-text-secondary text-xs font-semibold">
                        {log.quantity} kg
                      </Text>
                    ) : null}
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Tip of the Day */}
        <View className="bg-accent-light border border-accent rounded-xl p-4 mb-24">
          <View className="flex-row items-start">
            <Ionicons name="bulb-outline" size={24} color="#F59E0B" />
            <View className="flex-1 ml-3">
              <Text className="text-text-primary font-bold text-sm">
                Farming Tip of the Day
              </Text>
              <Text className="text-text-secondary text-sm mt-1">
                Regular monitoring of your crops helps identify pest issues
                early. Check your{" "}
                {profile?.farmProfile?.primaryCrops?.[0] || "crops"} at least
                twice a week!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
