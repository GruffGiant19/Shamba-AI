import React, {useState} from "react";
import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Input from "../../components/common/Input";
import {useRouter} from "expo-router";
import Button from "../../components/common/Button";

const farmSetup = () => {
  const router = useRouter();
  const [farmName,setFarmName] = useState("");
  const [location,setLocation] = useState("");
  const [farmSize,setFarmSize] = useState("");
  const [unit,setUnit] = useState<"acres" | "hectares">("acres")
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [errors,setErrors] = useState({
    farmName: "",
    location: "",
    farmSize: "",
    crops: "",
  });

  const Crops = [
    "Maize",
    "Tomatoes",
    "Beans",
    "Cassava",
    "Rice",
    "Sorghum",
    "Vegetables",
    "Other",
  ];

  const toggleCrop = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      setSelectedCrops(selectedCrops.filter((c) => c!==crop))
    }else {
      setSelectedCrops([...selectedCrops,crop])
    }
  };

  
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20 }}
      >
        <View className="flex-row items-center justify-center mb-8">
          <View className="flex-1 h-1 bg-primary rounded-full" />
          <View className="flex-1 h-1 bg-border rounded-full ml-2" />
        </View>

        <Text className="text-text-muted text-sm text-center mb-2">
          Step 1 of 2
        </Text>

        <View className="mb-8">
          <Text className="text-primary text-3xl font-bold text-center">
            Set Up Your Farm Profile
          </Text>
          <Text className="text-text-secondary text-base text-center mt-2">
            Help Shamba AI personalize your experience
          </Text>
        </View>

        <View className="items-center mb-6">
          <TouchableOpacity
            className="items-center justify-center border-2 border-dashed border-primary rounded-full"
            style={{ width: 100, height: 100 }}
            onPress={() =>
              Alert.alert(
                "Feature Coming Soon",
                "Photo upload will be available soon!",
              )
            }
          >
            <Ionicons name="camera-outline" size={32} color="#1B4332" />
            <Text className="text-primary text-xs mt-1">Add Photo</Text>
          </TouchableOpacity>
        </View>

         <View className="mb-6">
          <Input
            label="Farm Name"
            placeholder="e.g., Mensah Family Farm"
            value={farmName}
            onChangeText={setFarmName}
            icon="leaf-outline"
            error={errors.farmName}
          />

          <Input
            label="Farm Location"
            placeholder="e.g., Kumasi, Ashanti Region"
            value={location}
            onChangeText={setLocation}
            icon="location-outline"
            error={errors.location}
          />

          {/* Farm Size with Unit Toggle */}
          <Text className="text-text-primary font-semibold text-sm mb-2">
            Farm Size
          </Text>
          <View className="flex-row items-center mb-4">
            <View className="flex-1 mr-2">
              <Input
                label=""
                placeholder="e.g., 5"
                value={farmSize}
                onChangeText={setFarmSize}
                keyboardType="numeric"
                error={errors.farmSize}
              />
            </View>

            {/* Unit Toggle */}
            <View className="flex-row border border-border rounded-xl overflow-hidden" style={{ height: 56 }}>
              <TouchableOpacity
                className={`px-4 items-center justify-center ${
                  unit === "acres" ? "bg-primary" : "bg-surface"
                }`}
                onPress={() => setUnit("acres")}
                style={{ width: 80 }}
              >
                <Text
                  className={`font-semibold text-sm ${
                    unit === "acres" ? "text-white" : "text-text-primary"
                  }`}
                >
                  Acres
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`px-4 items-center justify-center ${
                  unit === "hectares" ? "bg-primary" : "bg-surface"
                }`}
                onPress={() => setUnit("hectares")}
                style={{ width: 80 }}
              >
                <Text
                  className={`font-semibold text-sm ${
                    unit === "hectares" ? "text-white" : "text-text-primary"
                  }`}
                >
                  Hectares
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-text-primary font-semibold text-sm mb-3">
            Primary Crops
          </Text>
          <Text className="text-text-secondary text-xs mb-3">
            Select all crops you currently grow
          </Text>

          <View className="flex-row flex-wrap gap-2">
            {Crops.map((crop) => (
              <TouchableOpacity key={crop} onPress={() => toggleCrop(crop)} className={`px-4 py-3 rounded-full border ${
                  selectedCrops.includes(crop)
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
                }`}>
                <Text className={`font-semibold text-sm ${
                    selectedCrops.includes(crop)
                      ? "text-white"
                      : "text-text-primary"
                  }`}>
                  {crop}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {errors.crops && (
            <Text className="text-error text-xs mt-2 ml-1">{errors.crops}</Text>
          )}
        </View>
          
          <Button label="Continue" onPress={() => router.push("/auth/experiencSetup")} className="mt-4" />
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

export default farmSetup;
