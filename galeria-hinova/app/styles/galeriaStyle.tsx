import { Dimensions, StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    maxWidth: Dimensions.get("window").width,
  },
  listPhotos: {
    flex: 1,
    flexDirection: "row",
  },
  item: {
    width: Dimensions.get("window").width / 3.1,
    height: Dimensions.get("window").width / 3,
    margin: 1,
    borderRadius: 10,
    resizeMode: "cover",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
});