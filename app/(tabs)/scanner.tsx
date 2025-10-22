import { StyleSheet, Text, View } from "react-native";

export default function TabScannerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla del Scanner</Text>
      <Text style={styles.mock}>Aquí va la cámara (scanner) </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  mock: {
    marginVertical: 30,
    height: 1,
    width: "80%",
    backgroundColor: "#eee",
  },
});
