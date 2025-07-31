import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Photo } from "../../types/cameraTypes";
import styles from "../styles/cameraStyle";

export default function Camera() {
  const isFocused = useIsFocused();
  const cameraRef = useRef<CameraView>(null);

  const [photo, setPhoto] = useState<Photo>();
  const [facing, setFacing] = useState<CameraType>("back");
  const [location, setLocation] = useState<Location.LocationObject>();
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    async function requestPermissionAndGetLocation(): Promise<void> {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Não foi possível acessar a localização."
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    requestPermissionAndGetLocation();
  }, []);

  useEffect(() => {
    requestPermission().catch((error: any) =>
      Alert.alert(
        "Erro",
        "Não foi possível solicitar permissão para a câmera: " + error.message
      )
    );
  }, [requestPermission]);

  if (!permission?.granted) {
    return (
      <View style={styles.containerPermission}>
        <Text style={styles.textPermission}>
          Permissão para câmera é necessária
        </Text>
        <TouchableOpacity
          style={styles.buttonPermission}
          onPress={requestPermission}
        >
          <Text>Permitir</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function toggleCameraFacing(): Promise<void> {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture(): Promise<void> {
    if (!location) {
      Alert.alert("Aguarde", "Obtendo localização...");
      return;
    }

    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        exif: true,
        skipProcessing: true,
      });
      const date = `${new Date().toLocaleDateString(
        "pt-BR"
      )} ${new Date().toLocaleTimeString("pt-BR")}`;
      setPhoto({
        id: `Hinova-${Date.now()}.jpg`,
        uri: photo.uri,
        date,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  }

  async function savePicture(): Promise<void> {
    try {
      if (photo) {
        const folderPhotos = `${FileSystem.documentDirectory}fotos/`;
        const folderInfo = await FileSystem.getInfoAsync(folderPhotos);
        const fileUri = folderPhotos + photo.id;

        if (!folderInfo.exists) {
          await FileSystem.makeDirectoryAsync(folderPhotos, {
            intermediates: true,
          });
        }

        await FileSystem.copyAsync({
          from: photo.uri,
          to: fileUri,
        });

        const metadata = {
          id: photo.id,
          uri: fileUri,
          latitude: photo.latitude,
          longitude: photo.longitude,
          date: photo.date,
        };

        const metadataFolder = FileSystem.documentDirectory + "metadados/";
        const metadataPath = `${metadataFolder}${photo.id.replace(".jpg", ".json")}`;

        const metadataFolderInfo =
          await FileSystem.getInfoAsync(metadataFolder);

        if (!metadataFolderInfo.exists) {
          await FileSystem.makeDirectoryAsync(metadataFolder);
        }

        await FileSystem.writeAsStringAsync(
          metadataPath,
          JSON.stringify(metadata)
        );

        Alert.alert(
          "Notificação",
          `A foto foi salva com sucesso! Verifique sua galeria para mais informações`,
          [
            {
              text: "OK",
              onPress: () => setPhoto(undefined),
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Ocorreu um erro",
        `Não foi possível salvar a foto: ${error.message}`
      );
      console.log(error);
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {!photo ? (
          isFocused && (
            <View style={styles.cameraContainer}>
              <CameraView
                style={styles.camera}
                ref={cameraRef}
                facing={facing}
              />
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
              >
                <Ionicons name="camera-outline" size={64} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={toggleCameraFacing}
              >
                <Ionicons
                  name="camera-reverse-outline"
                  size={64}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          )
        ) : (
          <View style={styles.cameraContainer}>
            <Image style={styles.camera} source={{ uri: photo.uri }} />
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setPhoto(undefined)}
            >
              <Ionicons name="refresh-outline" size={64} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={savePicture}
            >
              <Ionicons name="save-outline" size={64} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
