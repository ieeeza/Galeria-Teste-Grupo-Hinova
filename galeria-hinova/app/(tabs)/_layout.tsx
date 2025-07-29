import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { JSX } from "react";

function CameraTabIcon(): JSX.Element {
  return <Ionicons name="camera-outline" size={24} />;
}

function GaleriaTabIcon(): JSX.Element {
  return <Ionicons name="images-outline" size={24} />;
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="camera" options={{
        title: "Camera",
        tabBarIcon: CameraTabIcon
      }} />
      <Tabs.Screen name="galeria" options={{
        title: "Galeria",
        tabBarIcon: GaleriaTabIcon
       }} />
    </Tabs>
  );
}
