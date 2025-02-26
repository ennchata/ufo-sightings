import { Stack } from "expo-router";

export default function SightingsLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "All Sightings"}} />
            <Stack.Screen name="[sighting]" options={{ title: "Sighting Details" }} />
        </Stack>
    )
}