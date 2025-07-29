import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  captureButton: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    bottom: 32,
    left: 32,
    borderRadius: 32,
    padding: 16,
  },
  toggleButton: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    bottom: 32,
    right: 32,
    borderRadius: 32,
    padding: 16,
  },
});
