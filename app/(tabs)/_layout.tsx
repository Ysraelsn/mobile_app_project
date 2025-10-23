import { Tabs } from "expo-router";
import React from "react";

import FontAwesome from "@expo/vector-icons/FontAwesome";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#111826",
      }}
    >
      <Tabs.Screen
        name="scanner"
        options={{
          title: "Escanear",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="camera-retro" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Historial",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="list-alt" color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
