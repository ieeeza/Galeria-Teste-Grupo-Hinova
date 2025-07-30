import Ionicons from "@expo/vector-icons/Ionicons";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { photoProps } from "../../types/galeriaTypes";
import styles from "../styles/galeriaStyle";

const Photo = ({ file, onPress }: photoProps) => (
  <TouchableOpacity onPress={onPress}>
    <Image
      source={{ uri: `${FileSystem.documentDirectory}fotos/${file}` }}
      style={styles.item}
    />
  </TouchableOpacity>
);

export default function Galeria() {
  const [files, setFiles] = useState<{ id: string }[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<{ id: string }>();

  useEffect(() => {
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
  }, []);

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
                onPress={() => {
                  setSelectedPhoto(item);
                  console.log(selectedPhoto);
                }}
              />
            )}
            keyExtractor={(item) => item.id}
            numColumns={3}
          />
        ) : (
          <View style={styles.photoContainer}>
            <Image
              source={{
                uri: `${FileSystem.documentDirectory}fotos/${selectedPhoto.id}`,
              }}
              style={styles.photo}
            />
            <TouchableOpacity
              style={styles.backGalleryButton}
              onPress={() => setSelectedPhoto(undefined)}
            >
              <Ionicons name="arrow-back-outline" size={32} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
