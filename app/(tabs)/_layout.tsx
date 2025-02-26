import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => <Ionicons name="home" color={color} size={18} />
                }}
            />
            <Tabs.Screen
                name="sightings"
                options={{
                    title: "Sightings",
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Ionicons name="eye" color={color} size={18} />
                }}
            />
        </Tabs>
    );
}
