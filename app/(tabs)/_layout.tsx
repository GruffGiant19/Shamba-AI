import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type IconName = keyof typeof Ionicons.glyphMap;

interface TabIconProps {
  name: IconName;
  focused: boolean;
  label: string;
}

function TabIcon({ name, focused, label }: TabIconProps) {
  return (
    <View style={styles.iconContainer}>
      <Ionicons
        name={focused ? name : (`${name}-outline` as IconName)}
        size={24}
        color={focused ? "#1B4332" : "#9CA3AF"}
      />
      {focused && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home" focused={focused} label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="logs"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="journal" focused={focused} label="Logs" />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="stats-chart" focused={focused} label="Reports" />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          // tabBarStyle: {display: 'none'},
          tabBarIcon: ({ focused }) => (
            <TabIcon name="chatbubbles" focused={focused} label="AI" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person" focused={focused} label="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 24,
    marginHorizontal: 24,
    borderRadius: 999,
    height: 70,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingTop: 5,
    minWidth: 60,
  },
  label: {
    fontSize: 11,
    color: "#1B4332",
    fontWeight: "700",
  },
});

export default TabLayout;
