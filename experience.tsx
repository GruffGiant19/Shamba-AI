import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
// import Button from "../../components/common/Button";

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
    { id: "beginner", icon: "🌱", label: "Beginner", sublabel: "Less than 2 years" },
    { id: "intermediate", icon: "🌿", label: "Intermediate", sublabel: "2 to 5 years" },
    { id: "experienced", icon: "🌳", label: "Experienced", sublabel: "More than 5 years" },
  ];

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const handleFinish = async () => {
    if (!experienceLevel) {
      Alert.alert("Required", "Please select your farming experience level");
      return;
    }

    if (!seasonStart) {
      Alert.alert("Required", "Please select your season start month");
      return;
    }

    setLoading(true);

    // TODO: Save user profile data to Firestore
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

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator */}
        <View className="flex-row items-center justify-center mb-8 gap-2">
          <View className="flex-1 h-1 bg-primary rounded-full" />
          <View className="flex-1 h-1 bg-primary rounded-full ml-2" />
        </View>

        <Text className="text-text-muted text-sm text-center mb-2">
          Step 2 of 2
        </Text>

        {/* Header */}
        <View className="mb-8">
          <Text className="text-primary text-3xl font-bold text-center">
            Almost There! 🌾
          </Text>
          <Text className="text-text-secondary text-base text-center mt-2">
            A little more about your farming
          </Text>
        </View>

        {/* Experience Level */}
        <View className="mb-6">
          <Text className="text-text-primary font-semibold text-base mb-4">
            Farming Experience
          </Text>

          {experienceLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              onPress={() => setExperienceLevel(level.id)}
              className={`flex-row items-center p-4 mb-3 rounded-xl border-2 ${
                experienceLevel === level.id
                  ? "border-primary bg-primary-tint"
                  : "border-border bg-surface"
              }`}
            >
              <Text style={{ fontSize: 32, marginRight: 12 }}>{level.icon}</Text>
              <View className="flex-1">
                <Text className="text-text-primary font-bold text-base">
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

        {/* Season Start Month */}
        <View className="mb-6">
          <Text className="text-text-primary font-semibold text-base mb-3">
            Season Start Month
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
                className={`px-4 py-3 mr-2 rounded-xl border ${
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

        {/* Notification Preferences */}
        <View className="mb-6">
          <Text className="text-text-primary font-semibold text-base mb-4">
            Notification Preferences
          </Text>

          <TouchableOpacity
            onPress={() => toggleNotification("activityReminders")}
            className="flex-row items-center justify-between p-4 mb-3 rounded-xl bg-surface border border-border"
          >
            <View className="flex-1 mr-3">
              <Text className="text-text-primary font-semibold text-sm">
                Activity Reminders
              </Text>
              <Text className="text-text-secondary text-xs mt-1">
                Get reminded about upcoming farm activities
              </Text>
            </View>
            <View
              className={`w-12 h-7 rounded-full justify-center ${
                notifications.activityReminders ? "bg-primary" : "bg-border"
              }`}
            >
              <View
                className={`w-5 h-5 rounded-full bg-white ${
                  notifications.activityReminders ? "self-end mr-1" : "self-start ml-1"
                }`}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => toggleNotification("aiInsights")}
            className="flex-row items-center justify-between p-4 mb-3 rounded-xl bg-surface border border-border"
          >
            <View className="flex-1 mr-3">
              <Text className="text-text-primary font-semibold text-sm">
                AI Weekly Insights
              </Text>
              <Text className="text-text-secondary text-xs mt-1">
                Receive personalized farming tips from Shamba AI
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
            onPress={() => toggleNotification("weatherAlerts")}
            className="flex-row items-center justify-between p-4 mb-3 rounded-xl bg-surface border border-border"
          >
            <View className="flex-1 mr-3">
              <Text className="text-text-primary font-semibold text-sm">
                Weather Alerts
              </Text>
              <Text className="text-text-secondary text-xs mt-1">
                Get notified about weather changes
              </Text>
            </View>
            <View
              className={`w-12 h-7 rounded-full justify-center ${
                notifications.weatherAlerts ? "bg-primary" : "bg-border"
              }`}
            >
              <View
                className={`w-5 h-5 rounded-full bg-white ${
                  notifications.weatherAlerts ? "self-end mr-1" : "self-start ml-1"
                }`}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Finish Button */}
        {/* <Button
          label="Finish Setup"
          onPress={handleFinish}
          variant="primary"
          loading={loading}
        /> */}

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


export default experienceSetup