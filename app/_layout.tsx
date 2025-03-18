import { Stack } from 'expo-router';
import { Tabs } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen name="details" options={{ title: 'Sighting Details' }} />

      <Stack.Screen name="add-sighting" options={{ title: 'Add Sighting' }} />
    </Stack>
  );
}
