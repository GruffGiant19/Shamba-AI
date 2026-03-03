import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface InputProps {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  label: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  icon,
  autoCapitalize = 'sentences'
}: InputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = secureTextEntry;
  const showPassword = isPassword && isPasswordVisible;

  return (
    <View className='w-full mb-4'>
      <Text className='text-text-primary font-semibold text-sm mb-2'>
        {label}
      </Text>
      
      <View 
        className={`
          flex-row items-center bg-surface border rounded-xl px-4 h-14
          ${isFocused ? 'border-primary' : error ? 'border-error' : 'border-border'}
        `}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? '#1B4332' : '#9CA3AF'}  // Inline hex values
            style={{ marginRight: 12 }}
          />
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor='#9CA3AF'  // Inline hex value
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 text-text-primary"
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color='#9CA3AF'  // Inline hex value
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className='text-error text-xs mt-1 ml-1'>
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;