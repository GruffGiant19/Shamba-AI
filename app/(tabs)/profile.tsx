import { Ionicons } from "@expo/vector-icons";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/authContext";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { getUserProfile } from "../../services/userService";
import { logOut } from "../../services/authService";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await getUserProfile();
      setProfile(userData);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            try {
              await logOut();
              router.replace("/auth/splash");
            } catch (error) {
              Alert.alert("Error", "Failed to log out");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-muted">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background pb-24">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View className="items-center mb-6">
          <View className="h-32 w-32 rounded-full bg-primary items-center justify-center mb-4">
            <Text style={{ fontSize: 64 }}>👨‍🌾</Text>
          </View>
          <Text className="text-primary font-bold text-3xl">
            {profile?.fullName || user?.email?.split('@')[0] || 'Farmer'}
          </Text>
          <Text className="text-text-secondary mt-1">
            {profile?.farmProfile?.location || 'Location not set'}
          </Text>
        </View>

        {/* Farm Details */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-text-primary font-bold text-lg">
              Farm Profile
            </Text>
            <TouchableOpacity onPress={() => router.push("/auth/farmSetup")}>
              <Ionicons name="create-outline" size={20} color="#1B4332" />
            </TouchableOpacity>
          </View>

          <View className="bg-surface p-4 rounded-xl border border-border">
            <View className="flex-row justify-between mb-3 pb-3 border-b border-border">
              <Text className="text-text-secondary">Farm Name</Text>
              <Text className="text-primary font-bold text-base">
                {profile?.farmProfile?.farmName || 'Not set'}
              </Text>
            </View>

            <View className="flex-row justify-between mb-3 pb-3 border-b border-border">
              <Text className="text-text-secondary">Total Size</Text>
              <Text className="text-primary font-bold text-base">
                {profile?.farmProfile?.farmSize || 'Not set'}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-text-secondary">Primary Crops</Text>
              <View className="flex-1 items-end ml-4">
                {profile?.farmProfile?.primaryCrops?.length > 0 ? (
                  <View className="flex-row flex-wrap justify-end gap-1">
                    {profile.farmProfile.primaryCrops.map((crop: string, index: number) => (
                      <View key={index} className="bg-primary-tint px-2 py-1 rounded-full">
                        <Text className="text-primary text-xs font-semibold">{crop}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text className="text-primary font-bold text-base">Not set</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View className="mb-8">
          <Text className="mb-4 text-primary font-bold text-lg">
            Settings
          </Text>

          <TouchableOpacity
            className="bg-surface rounded-xl mb-3 p-4 flex-row items-center border border-border"
            onPress={() => router.push("/auth/experienceSetup")}
          >
            <Ionicons name="notifications-outline" size={22} color="#1B4332" />
            <Text className="text-text-primary ml-3 flex-1 text-base">Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-surface rounded-xl mb-3 p-4 flex-row items-center border border-border"
            onPress={() => Alert.alert("Coming Soon", "Language settings will be available soon")}
          >
            <Ionicons name="language-outline" size={22} color="#1B4332" />
            <Text className="text-text-primary ml-3 flex-1 text-base">Language</Text>
            <View className="flex-row items-center">
              <Text className="text-text-muted text-sm mr-2">English</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-surface rounded-xl mb-3 p-4 flex-row items-center border border-border"
            onPress={() => Alert.alert("Coming Soon", "Help & Support will be available soon")}
          >
            <Ionicons name="help-circle-outline" size={22} color="#1B4332" />
            <Text className="text-text-primary ml-3 flex-1 text-base">Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-surface rounded-xl mb-3 p-4 flex-row items-center border border-border"
            onPress={() => Alert.alert("Shamba v1.0.0", "Mini Demo Day Edition\nBuilt with ❤️ for African farmers")}
          >
            <Ionicons name="information-circle-outline" size={22} color="#1B4332" />
            <Text className="text-text-primary ml-3 flex-1 text-base">About</Text>
            <View className="flex-row items-center">
              <Text className="text-text-muted text-sm mr-2">v1.0.0</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-surface rounded-xl mb-3 p-4 flex-row items-center border border-error"
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={22} color="#E05C2D" />
            <Text className="text-error ml-3 flex-1 text-base font-semibold">Log Out</Text>
            <Ionicons name="chevron-forward" size={20} color="#E05C2D" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text className="text-text-muted text-xs text-center mb-4">
          {user?.email}
        </Text>
        <Text className="text-text-muted text-xs text-center mb-4">
          Member since {new Date(profile?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}