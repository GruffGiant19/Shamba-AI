import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getChatResponse } from "../services/geminiService";
import { getUserProfile } from "../services/userService";

export default function ConversationScreen() {
  const router = useRouter();
  const { initialPrompt } = useLocalSearchParams<{ initialPrompt: string }>();

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  // Auto-send the initial prompt if one was passed
  useEffect(() => {
    if (initialPrompt && profile !== undefined) {
      sendMessage(initialPrompt);
    }
  }, [profile]);

  const loadProfile = async () => {
    try {
      const userData = await getUserProfile();
      setProfile(userData);
    } catch (error) {
      console.error("Failed to load profile:", error);
      setProfile(null);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const aiResponse = await getChatResponse(userMessage.content, profile);
      const aiMessage = { role: "assistant", content: aiResponse };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Error:", error);
      Alert.alert("Error", error.message || "Failed to get response from AI");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble responding right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleSend = () => sendMessage(inputText);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-4 border-b border-border bg-surface">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
            <Ionicons name="arrow-back" size={24} color="#1B4332" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-primary font-bold text-lg">Shamba AI</Text>
            <Text className="text-text-secondary text-xs">
              Your farming assistant 🌱
            </Text>
          </View>
          <View className="bg-primary rounded-full p-2">
            <Ionicons name="sparkles" size={16} color="#FFFFFF" />
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-6"
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.length === 0 && (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-text-muted text-sm text-center">
                Type your question below to get started
              </Text>
            </View>
          )}

          <View style={{ gap: 16 }}>
            {messages.map((message, index) => (
              <View
                key={index}
                className={`flex-row ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <View className="bg-primary rounded-full w-8 h-8 items-center justify-center mr-2 mt-1">
                    <Ionicons name="sparkles" size={16} color="#FFFFFF" />
                  </View>
                )}

                <View
                  className={`max-w-[75%] p-4 rounded-2xl ${
                    message.role === "user"
                      ? "bg-primary"
                      : "bg-surface border border-border"
                  }`}
                >
                  <Text
                    className={`text-sm leading-5 ${
                      message.role === "user"
                        ? "text-white"
                        : "text-text-primary"
                    }`}
                  >
                    {message.content}
                  </Text>
                </View>

                {message.role === "user" && (
                  <View className="bg-accent rounded-full w-8 h-8 items-center justify-center ml-2 mt-1">
                    <Ionicons name="person" size={16} color="#FFFFFF" />
                  </View>
                )}
              </View>
            ))}

            {loading && (
              <View className="flex-row justify-start">
                <View className="bg-primary rounded-full w-8 h-8 items-center justify-center mr-2">
                  <Ionicons name="sparkles" size={16} color="#FFFFFF" />
                </View>
                <View className="bg-surface border border-border p-4 rounded-2xl">
                  <Text className="text-text-muted text-sm">Thinking...</Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Input */}
        <View className="px-6 py-4 mb-2 border-t border-border bg-surface">
          <View className="flex-row items-center" style={{ gap: 12 }}>
            <TextInput
              className="flex-1 bg-background border border-border rounded-full px-4 py-3 text-text-primary"
              placeholder="Ask about your crops..."
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              style={{ maxHeight: 100 }}
            />
            <TouchableOpacity
              className={`rounded-full p-3 ${
                inputText.trim() && !loading ? "bg-primary" : "bg-border"
              }`}
              onPress={handleSend}
              disabled={!inputText.trim() || loading}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() && !loading ? "#FFFFFF" : "#9CA3AF"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
