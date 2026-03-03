import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Button from "../../components/common/Button";

const { height } = Dimensions.get("window");
const splash = () => {
  const router = useRouter();

  return (
    <View className="flex-1">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ImageBackground
        source={require("../../assets/images/splash-image.png")}
        className="flex-1"
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.1)", "rgba(0,0,0,0)"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.3 }}
        />
        <LinearGradient
          colors={["rgba(250,250,247,0)", "rgba(250,250,247,0.95)", "#FAFAF7"]}
          style={[StyleSheet.absoluteFill, { top: height * 0.45 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        <View className="flex-1">
          <View className="items-center justify-center flex-1">
            <Image
              source={require("../../assets/images/logo.png")}
              className="h-40 w-40"
              resizeMode="contain"
            />
            <Text className="text-primary text-6xl font-black mt-4 tracking-wide">
              Shamba
            </Text>
            <Text className="text-secondary text-2xl mt-2 tracking-wide">
              Your farm. Smarter every Season
            </Text>
          </View>
          <View className="px-6 mb-32 gap-4">
            <Button
              label="Get Started"
              onPress={() => router.push("/auth/signup")}
            />
            <Button
              label="Log In"
              variant="ghost"
              onPress={() => router.push("/auth/login")}
              className=""
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default splash;
