import { StyleSheet } from "react-native";

export default StyleSheet.create({
  containerPermission: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  textPermission: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },

  buttonPermission: {
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 50,
    borderRadius: 5,
    backgroundColor: "#007AFF",
  },

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
    right: 32,
    borderRadius: 32,
    padding: 16,
  },

  toggleButton: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    bottom: 32,
    left: 32,
    borderRadius: 32,
    padding: 16,
  },
});
