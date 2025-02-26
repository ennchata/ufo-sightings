import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

const style = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 16
  }
});

export default function SightingsDetail() {
    const { sighting } = useLocalSearchParams();

    return (
        <View style={style.view}>
            Sighting {sighting}
        </View>
    )
}