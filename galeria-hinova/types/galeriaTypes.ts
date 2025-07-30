export interface PhotoProps {
  file: string;
  onPress: () => void;
};

export type PhotoMetadata = {
  uri: string;
  date: string;
  latitude: number;
  longitude: number;
};
