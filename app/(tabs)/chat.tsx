import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const PROMPTS = [
  {
    icon: "leaf-outline",
    label: "How do I improve maize yield?",
  },
  {
    icon: "calendar-outline",
    label: "When should I plant tomatoes?",
  },
  {
    icon: "flask-outline",
    label: "Best fertilizer for my crops?",
  },
  {
    icon: "bug-outline",
    label: "How to deal with pests?",
  },
  {
    icon: "chatbubble-ellipses-outline",
    label: "Ask your own question",
  },
];

export default function ChatScreen() {
  const router = useRouter();

  const handlePromptPress = (prompt: string) => {
    router.push({
      pathname: "/conversation",
      params: {
        initialPrompt: prompt === "Ask your own question" ? "" : prompt,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="px-6 py-4 border-b border-border">
        <Text className="text-primary font-bold text-2xl">Shamba AI</Text>
        <Text className="text-text-secondary text-sm mt-1">
          Your farming assistant 🌱
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View className="items-center py-8">
          <View className="bg-primary rounded-full p-6 mb-4">
            <Ionicons name="sparkles" size={48} color="#FFFFFF" />
          </View>
          <Text className="text-text-primary font-bold text-xl mb-2">
            What do you need help with?
          </Text>
          <Text className="text-text-secondary text-sm text-center px-8">
            Pick a topic or ask your own question
          </Text>
        </View>

        {/* Prompt Cards */}
        <View style={{ gap: 12 }}>
          {PROMPTS.map((item, index) => {
            const isCustom = item.label === "Ask your own question";
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handlePromptPress(item.label)}
                className={`flex-row items-center p-4 rounded-2xl border ${
                  isCustom
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
                }`}
                style={{ gap: 14 }}
              >
                <View
                  className={`rounded-full p-2 ${
                    isCustom ? "bg-white/20" : "bg-primary/10"
                  }`}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={isCustom ? "#FFFFFF" : "#1B4332"}
                  />
                </View>
                <Text
                  className={`flex-1 text-sm font-medium ${
                    isCustom ? "text-white" : "text-text-primary"
                  }`}
                >
                  {item.label}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={isCustom ? "#FFFFFF" : "#9CA3AF"}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}