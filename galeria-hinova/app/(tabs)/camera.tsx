import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { useEffect, useRef, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import styles from "../styles/cameraStyle";

export default function Camera() {
  const cameraRef = useRef<CameraView>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    requestPermission().catch((error) =>
      Alert.alert(
        "Erro",
        "Não foi possível solicitar permissão para a câmera: " + error.message
      )
    );
  }, [requestPermission]);

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text>Permissão para câmera é necessária</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Permitir</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function toggleCameraFacing(): Promise<void> {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture(): Promise<void> {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo.uri);
    }
  }

  async function savePicture(): Promise<void> {
    if (photo) {
      const folder = FileSystem.documentDirectory + "fotos/";
      const photoName = `Hinova-${Date.now()}.jpg`;
      const fileUri = folder + photoName;

      const folderInfo = await FileSystem.getInfoAsync(folder);
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(folder);
      }

      await FileSystem.copyAsync({
        from: photo,
        to: fileUri,
      });

      Alert.alert("Foto salva", `Foto salva em: ${fileUri}`, [
        {
          text: "OK",
          onPress: () => setPhoto(null),
        },
      ]);
    } else {
      Alert.alert("Erro", "Nenhuma foto para salvar.");
    }
  }

  return (
    <View style={styles.container}>
      {!photo ? (
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} ref={cameraRef} facing={facing} />
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Ionicons name="camera-outline" size={64} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={toggleCameraFacing}
          >
            <Ionicons name="camera-reverse-outline" size={64} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <Image style={styles.camera} source={{ uri: photo }} />
          <TouchableOpacity
            style={styles.captureButton}
            onPress={() => setPhoto(null)}
          >
            <Ionicons name="refresh-outline" size={64} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleButton} onPress={savePicture}>
            <Ionicons name="save-outline" size={64} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
