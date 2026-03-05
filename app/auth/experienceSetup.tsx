import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

const experienceSetup = () => {
  const router = useRouter();
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [seasonStart, setSeasonStart] = useState<string>("");
  const [notifications, setNotifications] = useState({
    activityReminders: true,
    aiInsights: true,
    weatherAlerts: true,
  });
  const [loading, setLoading] = useState(false);

  const experienceLevels = [
    {
      id: "beginner",
      label: "Beginner",
      sublabel: "Less than 2 years",
      icon: "🌱",
    },
    {
      id: "intermediate",
      label: "Intermediate",
      sublabel: "2 to 5 years",
      icon: "🌿",
    },
    {
      id: "experienced",
      label: "Experienced",
      sublabel: "More than 5 years",
      icon: "🌳",
    },
  ];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const toggleNotifications = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handleFinish = () => {
    if (!experienceLevel) {
      Alert.alert("Required", "Please select your farming experience level");
      return;
    }

    if (!seasonStart) {
      Alert.alert("Required", "Please select your season start month");
      return;
    }

    setLoading(true);

    console.log({
      experienceLevel,
      seasonStart,
      notifications,
    });

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.replace("/(tabs)");  // Now go to dashboard
    }, 1000);
  };
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-center mb-8 gap-2">
          <View className="h-1 bg-primary flex-1 rounded-full" />
          <View className="h-1 bg-primary flex-1 rounded-full" />
        </View>

        <Text className="text-text-muted text-center mb-2">Step 2 of 2</Text>

        <View className="mb-8 ">
          <Text className="text-3xl font-bold text-center">
            Almost There 🌾
          </Text>
          <Text className="text-center text-base text-text-secondary">
            A little more about your farming
          </Text>
        </View>

        <View className="mb-8">
          <Text className="text-text-primary font-bold text-xl mb-4">
            Experience Level
          </Text>

          {experienceLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              onPress={() => setExperienceLevel(level.id)}
              className={`flex-row mb-3 border-2 rounded-3xl items-center p-4 ${
                experienceLevel === level.id
                  ? "border-primary bg-primary-tint"
                  : "border-border bg-surface"
              }`}
            >
              <Text style={{ fontSize: 32, marginRight: 12 }}>
                {level.icon}
              </Text>
              <View className="flex-1">
                <Text className="text-text-primary font-bold text-base mb-2">
                  {level.label}
                </Text>
                <Text className="text-text-secondary text-sm">
                  {level.sublabel}
                </Text>
              </View>
              {experienceLevel === level.id && (
                <Ionicons name="checkmark-circle" size={24} color="#1B4332" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View className="mb-8">
          <Text className="text-text-primary font-bold text-xl mb-4">
            Season Start month
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {months.map((month) => (
              <TouchableOpacity
                key={month}
                onPress={() => setSeasonStart(month)}
                className={`px-6 py-3 border rounded-3xl mr-2 ${
                  seasonStart === month
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
                }`}
              >
                <Text
                  className={`font-semibold text-sm ${
                    seasonStart === month ? "text-white" : "text-text-primary"
                  }`}
                >
                  {month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="mb-8">
          <Text className="text-text-primary font-bold text-xl mb-4">
            Notifications
          </Text>
          <TouchableOpacity
            onPress={() => toggleNotifications("activityReminders")}
            className="flex-row p-4 bg-surface border-border border rounded-2xl mb-4"
          >
            <View className="flex-1 mr-3">
              <Text className="text-text-primary font-semibold text-sm">
                Activity Reminders
              </Text>
              <Text className="text-text-secondary text-xs mt-1">
                Don't forget to log tasks
              </Text>
            </View>

            <View
              className={`w-12 h-7 rounded-full justify-center ${
                notifications.activityReminders ? "bg-primary" : "bg-border"
              }`}
            >
              <View
                className={`w-5 h-5 rounded-full bg-white ${
                  notifications.activityReminders
                    ? "self-end mr-1"
                    : "self-start ml-1"
                }`}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => toggleNotifications("aiInsights")}
            className="flex-row p-4 bg-surface border-border border rounded-2xl mb-4"
          >
            <View className="flex-1 mr-3">
              <Text className="text-text-primary font-semibold text-sm">
                AI Weekly Insights
              </Text>
              <Text className="text-text-secondary text-xs mt-1">
                Tips for better yield
              </Text>
            </View>

            <View
              className={`w-12 h-7 rounded-full justify-center ${
                notifications.aiInsights ? "bg-primary" : "bg-border"
              }`}
            >
              <View
                className={`w-5 h-5 rounded-full bg-white ${
                  notifications.aiInsights ? "self-end mr-1" : "self-start ml-1"
                }`}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggleNotifications("weatherAlerts")}
            className="flex-row p-4 bg-surface border-border border rounded-2xl"
          >
            <View className="flex-1 mr-3">
              <Text className="text-text-primary font-semibold text-sm">
                Weather Alerts
              </Text>
              <Text className="text-text-secondary text-xs mt-1">
                Rain & drought updates
              </Text>
            </View>

            <View
              className={`w-12 h-7 rounded-full justify-center ${
                notifications.weatherAlerts ? "bg-primary" : "bg-border"
              }`}
            >
              <View
                className={`w-5 h-5 rounded-full bg-white ${
                  notifications.weatherAlerts
                    ? "self-end mr-1"
                    : "self-start ml-1"
                }`}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Finish Button */}
        <Button
          label="Finish Setup"
          onPress={handleFinish}
          variant="primary"
          loading={loading}
        />

        {/* Skip Link */}
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)")}
          className="items-center mt-4 mb-8"
        >
          <Text className="text-text-muted text-sm">Skip for now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default experienceSetup;
