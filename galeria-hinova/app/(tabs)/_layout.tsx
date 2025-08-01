import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { JSX } from "react";
import { Easing } from "react-native";

function CameraTabIcon(): JSX.Element {
  return <Ionicons name="camera-outline" size={24} />;
}

function GaleriaTabIcon(): JSX.Element {
  return <Ionicons name="images-outline" size={24} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "fade",
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "#808080",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderWidth: 2,
          borderColor: "#000",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="camera"
        options={{
          title: "Camera",
          tabBarIcon: CameraTabIcon,
          transitionSpec: {
            animation: "timing",
            config: {
              duration: 300,
              easing: Easing.inOut(Easing.ease),
            },
          },
        }}
      />
      <Tabs.Screen
        name="galeria"
        options={{
          title: "Galeria",
          tabBarIcon: GaleriaTabIcon,
          transitionSpec: {
            animation: "timing",
            config: {
              duration: 300,
              easing: Easing.inOut(Easing.ease),
            },
          },
        }}
      />
    </Tabs>
  );
}
