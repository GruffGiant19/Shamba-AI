import { View, Text } from 'react-native';

export default function LogsScreen() {
  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center">
        <Text style={{ fontSize: 48 }}>📓</Text>
        <Text className="text-primary font-bold text-2xl mt-4">Farm Logs</Text>
      </View>
    </View>
  );
}