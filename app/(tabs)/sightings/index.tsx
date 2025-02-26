import { StyleSheet, Text, View } from "react-native";

const style = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 16
  }
});

export default function SightingsIndex() {
    return (
        <View style={style.view}>
            <Text>Sightings Index</Text>
        </View>
    )
}
