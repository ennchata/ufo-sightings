import { StyleSheet, Text, View } from "react-native";

const style = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 16
  },
  bold: {
    fontWeight: "bold"
  }
})

export default function Index() {
  return (
    <View style={style.view}>
      <Text style={style.bold}>Welcome to the Sightings app!</Text>
    </View>
  );
}
