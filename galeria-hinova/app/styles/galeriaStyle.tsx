import { Dimensions, StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  listPhotos: {
    flex: 1,
    flexDirection: "row",
  },
  item: {
    width: Dimensions.get("window").width / 3,
    height: Dimensions.get("window").width / 3 - 10,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  }
});