import { Dimensions, StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  listPhotos: {
    flex: 1,
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
  photoContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    padding: 10,
  },
  photo: {
    width: "100%",
    height: "80%",
    borderRadius: 10,
  },
  backGalleryButton: {
    position: "absolute",
    left: 20,
    top: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    padding: 10,
  },
  deleteImageGallery: {
    position: "absolute",
    right: 20,
    top: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    padding: 10,
  },
  metadata: {
    flex: 1,
    flexDirection: "column",
    padding: 10,
    backgroundColor: "rgb(100, 150, 184)",
    borderRadius: 10,
    marginTop: 10,
  },
  metadataText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});
