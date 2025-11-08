import { ActivityIndicator, View } from "react-native";

interface LoaderProps {
  size?: "small" | "large";
  color?: string;
}

export const Loader = ({ size = "large", color = "#E3A542" }: LoaderProps) => {
  return (
    <View>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loader;
