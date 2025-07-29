import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";
import { FlatList, Image, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/galeriaStyle";

type ItemProps = {
  title: string;
};

const Item = ({ title }: ItemProps) => (
  <View style={styles.item}>
    <Image
      source={{ uri: `${FileSystem.documentDirectory}fotos/${title}` }}
      style={{ width: 100, height: 100 }}
    />
  </View>
);

export default function Galeria() {
  const [files, setFiles] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    async function fetchPhotos() {
      const folder = FileSystem.documentDirectory + "fotos/";
      const folderInfo = await FileSystem.getInfoAsync(folder);

      if (!folderInfo.exists) return [];

      const fileList = await FileSystem.readDirectoryAsync(folder);
      const formattedFiles = fileList.map((file) => ({
        id: file,
        title: file,
      }));
      setFiles(formattedFiles);
    }

    fetchPhotos();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.listPhotos}
          data={files}
          renderItem={({ item }) => <Item title={item.title} />}
          keyExtractor={(item) => item.id}
          numColumns={3}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
