import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 16
  },
  bold: {
    fontWeight: "bold"
  },
  listItem: {
    paddingLeft: 8,
    paddingRight: 8
  },
  link: {
    color: "blue",
    textDecorationColor: "blue",
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
  },
  horizontalRule: {
    paddingBottom: 6,
    marginBottom: 6,
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  image: {
    width: 256,
    height: 256,
    resizeMode: "cover"
  }
});

export default style;
