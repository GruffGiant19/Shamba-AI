import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/authContext";
import { getUserProfile } from "../../services/userService";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function LogsScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "all" | "planting" | "harvest" | "expense"
  >("all");

  // Form state
  const [activityType, setActivityType] = useState<string>("");
  const [crop, setCrop] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    loadProfile();
    loadLogs();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await getUserProfile();
      setProfile(userData);
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  const loadLogs = () => {
    // TODO: Load logs from backend
    // For now, using mock data
    setLogs([]);
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

  const handleSaveLog = () => {
    if (!activityType) {
      Alert.alert("Required", "Please select an activity type");
      return;
    }

    if (!crop) {
      Alert.alert("Required", "Please select a crop");
      return;
    }

    // TODO: Save to backend
    console.log({
      activityType,
      crop,
      description,
      cost: cost ? parseFloat(cost) : 0,
      quantity: quantity ? parseFloat(quantity) : 0,
      date,
    });

    // Close modal and reset form
    setModalVisible(false);
    resetForm();
    Alert.alert("Success", "Activity logged successfully!");
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
    return logs.filter((log) => log.type === activeTab);
  };

  return (
    <SafeAreaView className="flex-1 bg-background pb-24">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
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
          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              activeTab === "all"
                ? "bg-primary"
                : "bg-surface border border-border"
            }`}
            onPress={() => setActiveTab("all")}
          >
            <Text
              className={`font-semibold text-sm ${
                activeTab === "all" ? "text-white" : "text-text-primary"
              }`}
            >
              All Activities
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              activeTab === "planting"
                ? "bg-primary"
                : "bg-surface border border-border"
            }`}
            onPress={() => setActiveTab("planting")}
          >
            <Text
              className={`font-semibold text-sm ${
                activeTab === "planting" ? "text-white" : "text-text-primary"
              }`}
            >
              Planting
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              activeTab === "harvest"
                ? "bg-primary"
                : "bg-surface border border-border"
            }`}
            onPress={() => setActiveTab("harvest")}
          >
            <Text
              className={`font-semibold text-sm ${
                activeTab === "harvest" ? "text-white" : "text-text-primary"
              }`}
            >
              Harvest
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              activeTab === "expense"
                ? "bg-primary"
                : "bg-surface border border-border"
            }`}
            onPress={() => setActiveTab("expense")}
          >
            <Text
              className={`font-semibold text-sm ${
                activeTab === "expense" ? "text-white" : "text-text-primary"
              }`}
            >
              Expenses
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Empty State */}
        {getFilteredLogs().length === 0 && (
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

        {/* TODO: Activity List will go here when we have data */}
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
              <TouchableOpacity onPress={() => setModalVisible(false)}>
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
              {/* Activity Type Selection */}
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
              <View className="flex-row flex-wrap gap-2 mb-6">
                {profile?.farmProfile?.primaryCrops?.map((cropName: string) => (
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

              {/* Description */}
              <Input
                label="Description (Optional)"
                placeholder="E.g., Applied fertilizer to maize field"
                value={description}
                onChangeText={setDescription}
                icon="create-outline"
              />

              {/* Cost (if applicable) */}
              {["fertilizing", "spraying", "planting"].includes(
                activityType,
              ) && (
                <Input
                  label="Cost (GH₵)"
                  placeholder="0.00"
                  value={cost}
                  onChangeText={setCost}
                  keyboardType="numeric"
                  icon="cash-outline"
                />
              )}

              {/* Quantity (for harvest) */}
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

              {/* Save Button */}
              <View className="mt-6 mb-8">
                <Button
                  label="Save Activity"
                  onPress={handleSaveLog}
                  variant="primary"
                />
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
