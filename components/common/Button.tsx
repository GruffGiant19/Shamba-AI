import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface ButtonProps {
  variant?: "primary" | "ghost" | "outline" | "accent";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onPress: () => void;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

const Button = ({
  variant = "primary",
  loading = false,
  disabled = false,
  fullWidth = true,
  onPress,
  label,
  icon,
}: ButtonProps) => {
  const baseClasses =
    "h-16 rounded-2xl flex-row items-center justify-center px-6";

  const variantClasses = {
    primary: "bg-primary",
    ghost: "bg-transparent border-2 border-primary",
    outline: "bg-transparent border border-border",
    accent: "bg-accent",
  };

  const textClasses = {
    primary: "text-white font-bold text-xl",
    ghost: "text-primary font-bold text-xl",
    outline: "text-text-primary font-semibold text-xl",
    accent: "text-white font-bold text-xl",
  };

  const opacityClass = disabled || loading ? "opacity-50" : "opacity-100";
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${opacityClass} ${widthClass}`}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "primary" || variant === "accent" ? "#fff" : "#1B4332"
          }
          size="small"
        />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon && icon}
          <Text className={textClasses[variant]}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
