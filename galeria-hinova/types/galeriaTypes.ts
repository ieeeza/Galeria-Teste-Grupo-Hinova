export interface PhotoProps {
  file: string;
  onPress: () => void;
};

export type PhotoMetadata = {
  id: string;
  uri: string;
  date: string;
  latitude: number;
  longitude: number;
};
