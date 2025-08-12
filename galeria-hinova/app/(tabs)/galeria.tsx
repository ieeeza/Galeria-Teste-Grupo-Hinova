import Ionicons from "@expo/vector-icons/Ionicons";
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { PhotoMetadata, PhotoProps } from "../../types/galeriaTypes";
import styles from "../styles/galeriaStyle";

const Photo = ({ file, onPress }: PhotoProps) => (
  <TouchableOpacity onPress={onPress}>
    <Image
      source={{ uri: `${FileSystem.documentDirectory}fotos/${file}` }}
      style={styles.item}
    />
  </TouchableOpacity>
);

export default function Galeria() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const [files, setFiles] = useState<{ id: string }[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string>("");
  const [selectedPhotoMetadata, setSelectedPhotoMetadata] =
    useState<PhotoMetadata | null>(null);

  async function fetchPhotos(): Promise<void> {
    const folder = FileSystem.documentDirectory + "fotos/";
    const folderInfo = await FileSystem.getInfoAsync(folder);

    if (!folderInfo.exists) {
      setFiles([]);
      return;
    }

    const fileList = await FileSystem.readDirectoryAsync(folder);
    const formattedFiles = fileList.map((file) => ({
      id: file,
    }));

    setFiles(formattedFiles);
  }

  useFocusEffect(
    useCallback(() => {
      fetchPhotos();
    }, [])
  );

  async function loadPhotoMetadados(id: string): Promise<void> {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const metadadosPath =
        FileSystem.documentDirectory +
        "metadados/" +
        id.replace(".jpg", ".json");

      const json = await FileSystem.readAsStringAsync(metadadosPath);
      const meta: PhotoMetadata = JSON.parse(json);
      setSelectedPhotoMetadata(meta);
    } catch (error: any) {
      setSelectedPhotoMetadata(null);
      Alert.alert(
        "Erro ao carregar metadados da Imagem",
        "Não foi possível carregar os metadados da imagem selecionada."
      );
      console.log(error);
    }
  }

  function handlePhotoPress(id: string): void {
    setSelectedPhoto(id);
    loadPhotoMetadados(id);
  }

  async function handleDeletePhoto(id: string): Promise<void> {
    const uri = `${FileSystem.documentDirectory}fotos/${id}`;

    await FileSystem.deleteAsync(uri, { idempotent: true });
    await FileSystem.deleteAsync(uri.replace(".jpg", ".json"), {
      idempotent: true,
    });

    setTimeout(() => {
      handleBackPress();
    }, 100);
  }

  async function deletePhoto(id: string): Promise<void> {
    try {
      Alert.alert(
        "Excluir Foto",
        "Tem certeza que deseja excluir esta foto?",
        [
          {
            text: "Cancelar",
          },
          {
            text: "Excluir",
            onPress: () => {
              handleDeletePhoto(id);
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error: any) {
      alert("Erro ao excluir a foto: " + error.message);
      console.error("Erro ao excluir a foto:", error);
    }
  }

  function handleBackPress(): void {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSelectedPhoto("");
      fetchPhotos();
    });
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {!selectedPhoto ? (
          <FlatList
            style={styles.listPhotos}
            data={files}
            renderItem={({ item }) => (
              <Photo file={item.id} onPress={() => handlePhotoPress(item.id)} />
            )}
            keyExtractor={(item) => item.id}
            numColumns={3}
          />
        ) : (
          <Animated.View
            style={[
              styles.container,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <View style={styles.photoContainer}>
              <Image
                source={{
                  uri: `${FileSystem.documentDirectory}fotos/${selectedPhoto}`,
                }}
                style={styles.photo}
              />
              <TouchableOpacity
                style={styles.backGalleryButton}
                onPress={() => handleBackPress()}
              >
                <Ionicons name="arrow-back-outline" size={32} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteImageGallery}
                onPress={() => deletePhoto(selectedPhoto)}
              >
                <Ionicons name="trash-outline" size={32} color="white" />
              </TouchableOpacity>
              <View style={styles.metadata}>
                <Text style={styles.metadataText}>
                  Data e hora:{" "}
                  {selectedPhotoMetadata ? selectedPhotoMetadata.date : ""}
                </Text>
                <Text style={styles.metadataText}>
                  Latitude: {selectedPhotoMetadata?.latitude?.toFixed(6) ?? ""}
                </Text>
                <Text style={styles.metadataText}>
                  Longitude:{" "}
                  {selectedPhotoMetadata?.longitude?.toFixed(6) ?? ""}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
