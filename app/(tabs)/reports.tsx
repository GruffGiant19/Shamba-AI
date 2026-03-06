import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getUserProfile } from "../../services/userService";

export default function ReportsScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "season">("month");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await getUserProfile();
      setProfile(userData);
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  const expenseData = [
    { month: "Jan", amount: 450 },
    { month: "Feb", amount: 380 },
    { month: "Mar", amount: 520 },
    { month: "Apr", amount: 410 },
    { month: "May", amount: 600 },
    { month: "Jun", amount: 490 },
  ];

  const cropPerformanceData =
    profile?.farmProfile?.primaryCrops?.slice(0, 4).map((crop: string, index: number) => ({
      x: crop,
      y: [45, 60, 75, 50][index] || 50,
      color: ["#1B4332", "#2D6A4F", "#4ADE80", "#F59E0B"][index],
    })) || [];
  const maxExpense = Math.max(...expenseData.map((item) => item.amount), 1);

  return (
    <SafeAreaView className="flex-1 bg-background pb-24">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6">
          <Text className="text-primary font-bold text-3xl">Reports</Text>
          <Text className="text-text-secondary text-sm mt-1">
            Track your farm's performance
          </Text>
        </View>

        <View className="flex-row gap-2 mb-6">
          {["week", "month", "season"].map((range) => (
            <TouchableOpacity
              key={range}
              className={`flex-1 py-3 rounded-xl ${
                timeRange === range ? "bg-primary" : "bg-surface border border-border"
              }`}
              onPress={() => setTimeRange(range as any)}
            >
              <Text
                className={`text-center font-semibold text-sm ${
                  timeRange === range ? "text-white" : "text-text-primary"
                }`}
              >
                This {range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-surface border border-border rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Ionicons name="cash-outline" size={24} color="#F59E0B" />
              <View className="bg-error bg-opacity-10 px-2 py-1 rounded-full">
                <Text className="text-error text-xs font-semibold">-12%</Text>
              </View>
            </View>
            <Text className="text-text-muted text-xs">Total Expenses</Text>
            <Text className="text-text-primary font-bold text-2xl mt-1">GH₵ 2,850</Text>
          </View>

          <View className="flex-1 bg-surface border border-border rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Ionicons name="trending-up-outline" size={24} color="#4ADE80" />
              <View className="bg-success bg-opacity-10 px-2 py-1 rounded-full">
                <Text className="text-success text-xs font-semibold">+8%</Text>
              </View>
            </View>
            <Text className="text-text-muted text-xs">Total Yield</Text>
            <Text className="text-text-primary font-bold text-2xl mt-1">1,240 kg</Text>
          </View>
        </View>

        <View className="bg-surface border border-border rounded-2xl p-4 mb-6">
          <Text className="text-text-primary font-bold text-lg mb-2">Expense Trend</Text>
          <Text className="text-text-secondary text-xs mb-4">Monthly farming expenses (GH₵)</Text>

          <View className="h-56 justify-end">
            <View className="flex-row items-end justify-between h-44">
              {expenseData.map((item) => (
                <View key={item.month} className="items-center flex-1">
                  <View
                    className="w-6 rounded-t-md bg-primary"
                    style={{ height: `${(item.amount / maxExpense) * 100}%` }}
                  />
                  <Text className="text-[10px] text-text-secondary mt-2">{item.month}</Text>
                </View>
              ))}
            </View>
            <View className="mt-3 pt-2 border-t border-border">
              <Text className="text-[11px] text-text-muted">Peak: GH₵ {maxExpense}</Text>
            </View>
          </View>
        </View>

        {/* Rest of the components... (copy from previous version) */}
      </ScrollView>
    </SafeAreaView>
  );
}
