import Ionicons from "@expo/vector-icons/Ionicons";
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
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
  const [files, setFiles] = useState<{ id: string }[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMetadata | null>(
    null
  );

  useFocusEffect(
    useCallback(() => {
      async function fetchPhotos() {
        const folder = FileSystem.documentDirectory + "fotos/";
        const folderInfo = await FileSystem.getInfoAsync(folder);

        if (!folderInfo.exists) return [];

        const fileList = await FileSystem.readDirectoryAsync(folder);
        const formattedFiles = fileList.map((file) => ({
          id: file,
        }));

        setFiles(formattedFiles);
      }

      fetchPhotos();
    }, [])
  );

  async function loadPhotoMetadados(id: string): Promise<void> {
    try {
      const metadadosPath =
        FileSystem.documentDirectory +
        "metadados/" +
        id.replace(".jpg", ".json");

      const json = await FileSystem.readAsStringAsync(metadadosPath);
      const meta: PhotoMetadata = JSON.parse(json);
      setSelectedPhoto(meta);
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {!selectedPhoto ? (
          <FlatList
            style={styles.listPhotos}
            data={files}
            renderItem={({ item }) => (
              <Photo
                file={item.id}
                onPress={() => loadPhotoMetadados(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            numColumns={3}
          />
        ) : (
          <View style={styles.photoContainer}>
            <Image
              source={{
                uri: `${selectedPhoto.uri}`,
              }}
              style={styles.photo}
            />
            <TouchableOpacity
              style={styles.backGalleryButton}
              onPress={() => setSelectedPhoto(null)}
            >
              <Ionicons name="arrow-back-outline" size={32} color="white" />
            </TouchableOpacity>
            <View style={styles.metadata}>
              <Text>Data e hora: {selectedPhoto.date}</Text>
              <Text>Latitude: {selectedPhoto.latitude.toFixed(6)}</Text>
              <Text>Longitude: {selectedPhoto.longitude.toFixed(6)}</Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
