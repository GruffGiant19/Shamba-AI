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
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getChatResponse } from "../services/geminiService";

export default function ConversationScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // ✅ PARSE PROFILE AND LOGS FROM PARAMS
  const profile = params.profileData ? JSON.parse(params.profileData as string) : null;
  const logs = params.logsData ? JSON.parse(params.logsData as string) : [];

  useEffect(() => {
    // Send initial prompt if provided
    if (params.initialPrompt) {
      setInputText(params.initialPrompt as string);
    }

    // Listen for keyboard events
    const keyboardDidShow = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHide = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: inputText.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // ✅ PASS PROFILE AND LOGS TO AI
      const aiResponse = await getChatResponse(userMessage.content, profile, logs);

      const aiMessage = {
        role: "assistant",
        content: aiResponse,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Error:", error);
      Alert.alert("Error", error.message || "Failed to get response from AI");

      const errorMessage = {
        role: "assistant",
        content: "Sorry, I'm having trouble responding right now. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View className="px-6 py-4 border-b border-border bg-surface flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#1B4332" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-primary font-bold text-xl">Shamba AI</Text>
            <Text className="text-text-secondary text-xs mt-1">
              Your farming assistant 🌱
            </Text>
          </View>
        </View>

        {/* Messages Area */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-6"
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: keyboardVisible ? 20 : 100,
          }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <View className="bg-primary rounded-full p-6 mb-4">
                <Ionicons name="sparkles" size={48} color="#FFFFFF" />
              </View>
              <Text className="text-text-primary font-bold text-xl mb-2">
                Ask Shamba AI Anything
              </Text>
              <Text className="text-text-secondary text-sm text-center mb-6 px-8">
                Get personalized farming advice based on your crops and activities
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {messages.map((message, index) => (
                <View
                  key={index}
                  className={`flex-row ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <View className="bg-primary rounded-full w-8 h-8 items-center justify-center mr-2">
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
                        message.role === "user" ? "text-white" : "text-text-primary"
                      }`}
                    >
                      {message.content}
                    </Text>
                  </View>

                  {message.role === "user" && (
                    <View className="bg-accent rounded-full w-8 h-8 items-center justify-center ml-2">
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
          )}
        </ScrollView>

        {/* Input Area */}
        <View className="px-6 py-4 border-t border-border bg-surface">
          <View className="flex-row items-center gap-3">
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
                inputText.trim() ? "bg-primary" : "bg-border"
              }`}
              onPress={handleSend}
              disabled={!inputText.trim() || loading}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() ? "#FFFFFF" : "#9CA3AF"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}