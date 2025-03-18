import { Stack } from 'expo-router';
import { Tabs } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "Back" }} />

      <Stack.Screen name="details" options={{ title: 'Sighting Details' }} />
    </Stack>
  );
}
