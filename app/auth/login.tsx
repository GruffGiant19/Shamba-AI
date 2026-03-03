import { useRouter } from "expo-router";
import { useState } from "react";
import React from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { Ionicons } from "@expo/vector-icons";
import {logIn} from "../../services/authService";

const login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleLogin = async () => {  // ✅ ADDED: async keyword
    setErrors({ email: "", password: "" });

    let hasError = false;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      hasError = true;
    }

    if (!password) {
      newErrors.password = "Password is required";
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      await logIn(email, password);  // ✅ KEPT: Firebase login
      router.replace("/(tabs)");      // ✅ MOVED: Navigate on success
    } catch (error: any) {
      setLoading(false);
      Alert.alert(
        "Login Failed",
        error.message || "An error occurred during login. Please try again."
      );
    }
  };  // ✅ FIXED: Closed function properly

  const handleGoogleSignIn = () => {
    console.log("Google Sign In");
  };

  return (
    <SafeAreaView className="flex-1 ">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
          <View className="h-96 w-96 absolute rounded-full top-1 -m-5 left-1/4">
            <Image
              source={require("../../assets/images/SVG.png")}
              style={{ tintColor: "rgba(200, 230, 201, 0.4)" }}
              className="h-full w-full"
              resizeMode="cover"
            />
          </View>

          <View className="flex-1 items-center justify-center">
            <Image
              source={require("../../assets/images/logo.png")}
              className="h-20 w-20"
              resizeMode="contain"
            />
            <Text className="text-primary text-4xl font-bold mt-4">
              Welcome Back
            </Text>
            <Text className="text-secondary text-2xl font-light mt-2">
              Your farm is waiting 🌱
            </Text>
          </View>
          <View className="mb-6">
            <Input
              placeholder="kwame@example.com"
              value={email}
              onChangeText={setEmail}
              label="Email Address"
              autoCapitalize="none"
              icon="mail-outline"
              error={errors.email}
            />

            <Input
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              label="Password"
              secureTextEntry={true}
              icon="lock-closed-outline"
              error={errors.password}
            />
          </View>

          <TouchableOpacity
            onPress={() => router.push("/auth/forgotPassword")}
            className="self-end mb-6"
          >
            <Text className="text-accent text-sm font-medium">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Button
            label="Login"
            onPress={handleLogin}
            variant="primary"
            loading={loading}
          />

          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-text-muted text-sm mx-4">
              or continue with
            </Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          <TouchableOpacity
            onPress={handleGoogleSignIn}
            className="flex-row items-center justify-center bg-surface border border-border rounded-xl h-14 mb-8"
            activeOpacity={0.7}
          >
            <Ionicons name="logo-google" size={20} color="blue" style={{ marginRight: 8 }} />
            <Text className="text-text-primary font-semibold text-base">
              Sign in with Google
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-center mb-8">
            <Text className="text-text-secondary text-base">
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/auth/signup")}>
              <Text className="text-accent font-bold text-base">Sign Up</Text>
            </TouchableOpacity>
          </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default login;
