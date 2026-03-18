import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getUserProfile } from "../../services/userService";
import {
  saveLog,
  getLogs,
  deleteLog,
  LogEntry,
} from "../../services/logService";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { auth } from "../../services/firebase";

type TabType = "all" | "planting" | "harvest" | "expense";

export default function LogsScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("all");

  // Form state
  const [activityType, setActivityType] = useState("");
  const [crop, setCrop] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        loadProfile();
        loadLogs();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await getUserProfile();
      setProfile(userData);
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  const loadLogs = async () => {
    try {
      const data = await getLogs();
      setLogs(data);
    } catch (error) {
      console.error("Failed to load logs:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadLogs();
  };

  const activityTypes = [
    {
      id: "planting",
      icon: "leaf-outline",
      label: "Planting",
      color: "#4ADE80",
    },
    {
      id: "watering",
      icon: "water-outline",
      label: "Watering",
      color: "#3B82F6",
    },
    {
      id: "fertilizing",
      icon: "flask-outline",
      label: "Fertilizing",
      color: "#F59E0B",
    },
    { id: "weeding", icon: "cut-outline", label: "Weeding", color: "#6B7280" },
    {
      id: "spraying",
      icon: "medical-outline",
      label: "Spraying",
      color: "#EF4444",
    },
    {
      id: "harvest",
      icon: "basket-outline",
      label: "Harvesting",
      color: "#1B4332",
    },
  ];

  const handleSaveLog = async () => {
    if (!activityType) {
      Alert.alert("Required", "Please select an activity type");
      return;
    }
    if (!crop) {
      Alert.alert("Required", "Please select a crop");
      return;
    }

    setSaving(true);
    try {
      const newLog = await saveLog({
        activityType,
        crop,
        description,
        cost: cost ? parseFloat(cost) : 0,
        quantity: quantity ? parseFloat(quantity) : 0,
        date,
      });

      setLogs((prev) => [newLog, ...prev]);
      setModalVisible(false);
      resetForm();
      Alert.alert("Success", "Activity logged successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to save activity");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLog = (logId: string) => {
    Alert.alert(
      "Delete Activity",
      "Are you sure you want to delete this log?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteLog(logId);
              setLogs((prev) => prev.filter((l) => l._id !== logId));
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to delete log");
            }
          },
        },
      ],
    );
  };

  const resetForm = () => {
    setActivityType("");
    setCrop("");
    setDescription("");
    setCost("");
    setQuantity("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  const getFilteredLogs = () => {
    if (activeTab === "all") return logs;
    if (activeTab === "expense")
      return logs.filter((l) => l.cost && l.cost > 0);
    return logs.filter((l) => l.activityType === activeTab);
  };

  const getActivityMeta = (type: string) =>
    activityTypes.find((a) => a.id === type) || activityTypes[0];

  const tabs: { id: TabType; label: string }[] = [
    { id: "all", label: "All Activities" },
    { id: "planting", label: "Planting" },
    { id: "harvest", label: "Harvest" },
    { id: "expense", label: "Expenses" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-primary font-bold text-3xl">Farm Logs</Text>
            <Text className="text-text-secondary text-sm mt-1">
              Track your farming activities
            </Text>
          </View>
          <TouchableOpacity
            className="bg-primary rounded-full p-3"
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerStyle={{ gap: 8 }}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              className={`px-4 py-2 rounded-full ${
                activeTab === tab.id
                  ? "bg-primary"
                  : "bg-surface border border-border"
              }`}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text
                className={`font-semibold text-sm ${
                  activeTab === tab.id ? "text-white" : "text-text-primary"
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Loading */}
        {loading && (
          <View className="items-center py-12">
            <Text className="text-text-muted">Loading activities...</Text>
          </View>
        )}

        {/* Empty State */}
        {!loading && getFilteredLogs().length === 0 && (
          <View className="bg-surface border border-border rounded-2xl p-8 items-center mt-8">
            <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />
            <Text className="text-text-primary font-bold text-lg mt-4">
              No Activities Yet
            </Text>
            <Text className="text-text-secondary text-sm mt-2 text-center">
              Start tracking your farm activities to see insights and patterns
            </Text>
            <TouchableOpacity
              className="mt-6 bg-primary px-6 py-3 rounded-full"
              onPress={() => setModalVisible(true)}
            >
              <Text className="text-white font-semibold">
                Log Your First Activity
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Log List */}
        {!loading && getFilteredLogs().length > 0 && (
          <View style={{ gap: 12 }}>
            {getFilteredLogs().map((log) => {
              const meta = getActivityMeta(log.activityType);
              return (
                <View
                  key={log._id}
                  className="bg-surface border border-border rounded-2xl p-4"
                >
                  <View className="flex-row items-start justify-between">
                    <View
                      className="flex-row items-center flex-1"
                      style={{ gap: 12 }}
                    >
                      <View
                        className="rounded-full p-2"
                        style={{ backgroundColor: `${meta.color}20` }}
                      >
                        <Ionicons
                          name={meta.icon as any}
                          size={22}
                          color={meta.color}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-text-primary font-bold text-sm">
                          {meta.label}
                        </Text>
                        <Text className="text-text-secondary text-xs mt-0.5">
                          {log.crop}
                        </Text>
                        {log.description ? (
                          <Text className="text-text-muted text-xs mt-1">
                            {log.description}
                          </Text>
                        ) : null}
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleDeleteLog(log._id!)}
                      className="p-1 ml-2"
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#9CA3AF"
                      />
                    </TouchableOpacity>
                  </View>

                  <View
                    className="flex-row mt-3 pt-3 border-t border-border"
                    style={{ gap: 16 }}
                  >
                    <Text className="text-text-muted text-xs">
                      📅{" "}
                      {new Date(log.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                    {log.cost && log.cost > 0 ? (
                      <Text className="text-text-muted text-xs">
                        💰 GH₵{log.cost.toFixed(2)}
                      </Text>
                    ) : null}
                    {log.quantity && log.quantity > 0 ? (
                      <Text className="text-text-muted text-xs">
                        ⚖️ {log.quantity}kg
                      </Text>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Add Log Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-background">
          <View className="flex-1">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-border">
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Ionicons name="close" size={28} color="#1B4332" />
              </TouchableOpacity>
              <Text className="text-primary font-bold text-lg">
                Log Activity
              </Text>
              <View style={{ width: 28 }} />
            </View>

            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Activity Type */}
              <Text className="text-text-primary font-bold text-base mb-3">
                Activity Type
              </Text>
              <View className="flex-row flex-wrap gap-3 mb-6">
                {activityTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    className={`flex-1 min-w-[30%] border-2 rounded-xl p-4 items-center ${
                      activityType === type.id
                        ? "border-primary bg-primary-tint"
                        : "border-border bg-surface"
                    }`}
                    onPress={() => setActivityType(type.id)}
                  >
                    <Ionicons
                      name={type.icon as any}
                      size={32}
                      color={activityType === type.id ? "#1B4332" : type.color}
                    />
                    <Text
                      className={`text-xs font-semibold mt-2 ${
                        activityType === type.id
                          ? "text-primary"
                          : "text-text-secondary"
                      }`}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Crop Selection */}
              <Text className="text-text-primary font-bold text-base mb-3">
                Select Crop
              </Text>
              {profile?.farmProfile?.primaryCrops?.length > 0 ? (
                <View className="flex-row flex-wrap gap-2 mb-6">
                  {profile.farmProfile.primaryCrops.map((cropName: string) => (
                    <TouchableOpacity
                      key={cropName}
                      className={`px-4 py-3 rounded-full border ${
                        crop === cropName
                          ? "bg-primary border-primary"
                          : "bg-surface border-border"
                      }`}
                      onPress={() => setCrop(cropName)}
                    >
                      <Text
                        className={`font-semibold text-sm ${
                          crop === cropName ? "text-white" : "text-text-primary"
                        }`}
                      >
                        {cropName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text className="text-text-muted text-sm mb-6">
                  No crops set up. Add crops in your farm profile.
                </Text>
              )}

              {/* Description */}
              <Input
                label="Description (Optional)"
                placeholder="E.g., Applied fertilizer to maize field"
                value={description}
                onChangeText={setDescription}
                icon="create-outline"
              />

              {/* Cost */}
              {[
                "fertilizing",
                "spraying",
                "planting",
                "watering",
                "harvest",
                "weeding",
              ].includes(activityType) && (
                <Input
                  label="Cost (GH₵)"
                  placeholder="0.00"
                  value={cost}
                  onChangeText={setCost}
                  keyboardType="numeric"
                  icon="cash-outline"
                />
              )}

              {/* Quantity */}
              {activityType === "harvest" && (
                <Input
                  label="Quantity (kg)"
                  placeholder="0"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  icon="barbell-outline"
                />
              )}

              {/* Date */}
              <Input
                label="Date"
                placeholder="YYYY-MM-DD"
                value={date}
                onChangeText={setDate}
                icon="calendar-outline"
              />

              <View className="mt-6 mb-8">
                <Button
                  label="Save Activity"
                  onPress={handleSaveLog}
                  variant="primary"
                  loading={saving}
                />
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
