import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getUserProfile } from "../../services/userService";
import { getLogs, LogEntry } from "../../services/logService";
import { auth } from "../../services/firebase";

type TimeRange = "week" | "month" | "season";

// ─── Helpers ────────────────────────────────────────────────────────────────

const getStartDate = (range: TimeRange, seasonStart?: string): Date => {
  const now = new Date();
  if (range === "week") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d;
  }
  if (range === "month") {
    const d = new Date(now);
    d.setMonth(d.getMonth() - 1);
    return d;
  }
  // season — use profile's seasonStart month, default to 6 months ago
  if (seasonStart) {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthIndex = months.indexOf(seasonStart);
    if (monthIndex !== -1) {
      const d = new Date(now.getFullYear(), monthIndex, 1);
      // if that date is in the future, go back a year
      if (d > now) d.setFullYear(d.getFullYear() - 1);
      return d;
    }
  }
  const d = new Date(now);
  d.setMonth(d.getMonth() - 6);
  return d;
};

const filterByRange = (logs: LogEntry[], range: TimeRange, seasonStart?: string): LogEntry[] => {
  const start = getStartDate(range, seasonStart);
  return logs.filter((l) => new Date(l.date) >= start);
};

const formatCurrency = (amount: number) =>
  `GH₵ ${amount.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const pctChange = (current: number, previous: number): number | null => {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  icon,
  iconColor,
  label,
  value,
  change,
}: {
  icon: string;
  iconColor: string;
  label: string;
  value: string;
  change: number | null;
}) {
  const positive = change !== null && change >= 0;
  return (
    <View className="flex-1 bg-surface border border-border rounded-xl p-4">
      <View className="flex-row items-center justify-between mb-2">
        <Ionicons name={icon as any} size={24} color={iconColor} />
        {change !== null && (
          <View
            className="px-2 py-1 rounded-full"
            style={{ backgroundColor: positive ? "#4ADE8020" : "#EF444420" }}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: positive ? "#4ADE80" : "#EF4444" }}
            >
              {positive ? "+" : ""}
              {change}%
            </Text>
          </View>
        )}
      </View>
      <Text className="text-text-muted text-xs">{label}</Text>
      <Text className="text-text-primary font-bold text-2xl mt-1">{value}</Text>
    </View>
  );
}

function BarChart({
  data,
  color = "#1B4332",
}: {
  data: { label: string; value: number }[];
  color?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <View className="h-44 flex-row items-end justify-between">
      {data.map((item) => (
        <View key={item.label} className="items-center flex-1">
          <View
            className="w-6 rounded-t-md"
            style={{
              height: `${Math.max((item.value / max) * 100, 2)}%`,
              backgroundColor: color,
              opacity: item.value === 0 ? 0.2 : 1,
            }}
          />
          <Text className="text-[10px] text-text-secondary mt-2">{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function ReportsScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("month");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        loadData();
      } else {
        setLoading(false);
      }
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
      console.error("Failed to load reports data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // ── Derived analytics ──────────────────────────────────────────────────────

  const seasonStart = profile?.experience?.seasonStart;
  const filtered = filterByRange(logs, timeRange, seasonStart);

  // Previous period for % change comparison
  const prevStart = getStartDate(timeRange, seasonStart);
  const prevDuration = Date.now() - prevStart.getTime();
  const prevPeriodStart = new Date(prevStart.getTime() - prevDuration);
  const previous = logs.filter(
    (l) => new Date(l.date) >= prevPeriodStart && new Date(l.date) < prevStart
  );

  const totalExpenses = filtered.reduce((sum, l) => sum + (l.cost || 0), 0);
  const totalYield = filtered.reduce((sum, l) => sum + (l.quantity || 0), 0);
  const prevExpenses = previous.reduce((sum, l) => sum + (l.cost || 0), 0);
  const prevYield = previous.reduce((sum, l) => sum + (l.quantity || 0), 0);

  // Monthly expense chart (last 6 months always)
  const monthlyExpenses = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const month = d.toLocaleString("default", { month: "short" });
    const year = d.getFullYear();
    const monthLogs = logs.filter((l) => {
      const ld = new Date(l.date);
      return ld.getMonth() === d.getMonth() && ld.getFullYear() === year;
    });
    return {
      label: month,
      value: monthLogs.reduce((sum, l) => sum + (l.cost || 0), 0),
    };
  });

  // Activity breakdown
  const activityTypes = ["planting", "watering", "fertilizing", "weeding", "spraying", "harvest"];
  const activityCounts = activityTypes.map((type) => ({
    label: type.charAt(0).toUpperCase() + type.slice(1),
    value: filtered.filter((l) => l.activityType === type).length,
  }));

  // Crop breakdown by cost
  const crops = profile?.farmProfile?.primaryCrops || [];
  const cropExpenses = crops.map((crop: string) => ({
    crop,
    expenses: filtered
      .filter((l) => l.crop === crop)
      .reduce((sum, l) => sum + (l.cost || 0), 0),
    yield: filtered
      .filter((l) => l.crop === crop)
      .reduce((sum, l) => sum + (l.quantity || 0), 0),
    activities: filtered.filter((l) => l.crop === crop).length,
  }));

  const cropColors = ["#1B4332", "#2D6A4F", "#4ADE80", "#F59E0B", "#3B82F6", "#EF4444", "#6B7280", "#8B5CF6"];

  const hasData = filtered.length > 0;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-muted">Loading reports...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-primary font-bold text-3xl">Reports</Text>
          <Text className="text-text-secondary text-sm mt-1">
            Track your farm's performance
          </Text>
        </View>

        {/* Time Range Toggle */}
        <View className="flex-row gap-2 mb-6">
          {(["week", "month", "season"] as TimeRange[]).map((range) => (
            <TouchableOpacity
              key={range}
              className={`flex-1 py-3 rounded-xl ${
                timeRange === range ? "bg-primary" : "bg-surface border border-border"
              }`}
              onPress={() => setTimeRange(range)}
            >
              <Text
                className={`text-center font-semibold text-sm ${
                  timeRange === range ? "text-white" : "text-text-primary"
                }`}
              >
                {range === "season" ? "Season" : `This ${range.charAt(0).toUpperCase() + range.slice(1)}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* No data state */}
        {!hasData && (
          <View className="bg-surface border border-border rounded-2xl p-8 items-center mb-6">
            <Ionicons name="stats-chart-outline" size={48} color="#9CA3AF" />
            <Text className="text-text-primary font-bold text-lg mt-4">No Data Yet</Text>
            <Text className="text-text-secondary text-sm mt-2 text-center">
              Start logging farm activities to see your analytics here
            </Text>
          </View>
        )}

        {/* Summary Stats */}
        <View className="flex-row gap-3 mb-6">
          <StatCard
            icon="cash-outline"
            iconColor="#F59E0B"
            label="Total Expenses"
            value={formatCurrency(totalExpenses)}
            change={pctChange(totalExpenses, prevExpenses)}
          />
          <StatCard
            icon="trending-up-outline"
            iconColor="#4ADE80"
            label="Total Yield"
            value={`${totalYield.toLocaleString()} kg`}
            change={pctChange(totalYield, prevYield)}
          />
        </View>

        {/* Activity Count */}
        <View className="bg-surface border border-border rounded-xl p-4 mb-6">
          <Text className="text-text-primary font-bold text-base mb-1">
            Total Activities
          </Text>
          <Text className="text-primary font-bold text-3xl">{filtered.length}</Text>
          <Text className="text-text-muted text-xs mt-1">
            logged in this {timeRange}
          </Text>
        </View>

        {/* Expense Trend Chart */}
        <View className="bg-surface border border-border rounded-2xl p-4 mb-6">
          <Text className="text-text-primary font-bold text-lg mb-1">
            Expense Trend
          </Text>
          <Text className="text-text-secondary text-xs mb-16">
            Monthly farming expenses (GH₵)
          </Text>
          <BarChart data={monthlyExpenses} color="#1B4332" />
          <View className="mt-3 pt-2 border-t border-border">
            <Text className="text-text-muted text-xs">
              Peak: {formatCurrency(Math.max(...monthlyExpenses.map((m) => m.value), 0))}
            </Text>
          </View>
        </View>

        {/* Activity Breakdown Chart */}
        <View className="bg-surface border border-border rounded-2xl p-4 mb-6">
          <Text className="text-text-primary font-bold text-lg mb-1">
            Activity Breakdown
          </Text>
          <Text className="text-text-secondary text-xs mb-16">
            Number of activities by type
          </Text>
          <BarChart data={activityCounts} color="#2D6A4F" />
        </View>

        {/* Crop Performance */}
        {cropExpenses.length > 0 && (
          <View className="bg-surface border border-border rounded-2xl p-4 mb-6">
            <Text className="text-text-primary font-bold text-lg mb-4">
              Crop Breakdown
            </Text>
            <View style={{ gap: 12 }}>
              {cropExpenses.map((item: any, index: number) => (
                <View key={item.crop}>
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center" style={{ gap: 8 }}>
                      <View
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cropColors[index % cropColors.length] }}
                      />
                      <Text className="text-text-primary font-semibold text-sm">
                        {item.crop}
                      </Text>
                    </View>
                    <Text className="text-text-secondary text-xs">
                      {item.activities} activities
                    </Text>
                  </View>
                  <View className="flex-row gap-4">
                    <Text className="text-text-muted text-xs">
                      💰 {formatCurrency(item.expenses)}
                    </Text>
                    {item.yield > 0 && (
                      <Text className="text-text-muted text-xs">
                        ⚖️ {item.yield} kg harvested
                      </Text>
                    )}
                  </View>
                  {/* Progress bar relative to most expensive crop */}
                  {cropExpenses.some((c: any) => c.expenses > 0) && (
                    <View className="h-1.5 bg-border rounded-full mt-2 overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${
                            (item.expenses /
                              Math.max(...cropExpenses.map((c: any) => c.expenses), 1)) *
                            100
                          }%`,
                          backgroundColor: cropColors[index % cropColors.length],
                        }}
                      />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recent Harvests */}
        {filtered.filter((l) => l.activityType === "harvest" && l.quantity && l.quantity > 0).length > 0 && (
          <View className="bg-surface border border-border rounded-2xl p-4 mb-6">
            <Text className="text-text-primary font-bold text-lg mb-4">
              Recent Harvests
            </Text>
            <View style={{ gap: 10 }}>
              {filtered
                .filter((l) => l.activityType === "harvest" && l.quantity && l.quantity > 0)
                .slice(0, 5)
                .map((log) => (
                  <View
                    key={log._id}
                    className="flex-row items-center justify-between py-2 border-b border-border"
                  >
                    <View>
                      <Text className="text-text-primary font-semibold text-sm">
                        {log.crop}
                      </Text>
                      <Text className="text-text-muted text-xs">
                        {new Date(log.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </Text>
                    </View>
                    <Text className="text-primary font-bold text-sm">
                      {log.quantity} kg
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}