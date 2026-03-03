import React, { useRef, useState } from "react";
import { View, Text } from "react-native";
import PhoneNumberInput from "react-native-phone-number-input";

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeText,
  label,
  placeholder = "Phone number",
  error,
}) => {
  const phoneInput = useRef<PhoneNumberInput>(null);
  const [countryCode, setCountryCode] = useState<any>("GH");  // ✅ Use 'any' as workaround

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-text-primary font-semibold text-sm mb-2">
          {label}
        </Text>
      )}
      <PhoneNumberInput
        ref={phoneInput}
        defaultValue={value}
        defaultCode="GH"  // ✅ Just hardcode it here
        layout="second"
        onChangeText={onChangeText}
        onChangeCountry={(country) => setCountryCode(country.cca2)}
        placeholder={placeholder}
        containerStyle={{
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: error ? "#E05C2D" : "#E5E7EB",
          width: "100%",
          height: 56,
        }}
        textContainerStyle={{
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
        }}
        textInputStyle={{
          fontSize: 16,
          color: "#1A1A1A",
        }}
        codeTextStyle={{
          fontSize: 16,
          color: "#1A1A1A",
        }}
      />
      {error && (
        <Text className="text-error text-xs mt-1 ml-1">
          {error}
        </Text>
      )}
    </View>
  );
};

export default PhoneInput;