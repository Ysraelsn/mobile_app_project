import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { styles } from "./scanner.styles"; // Importa los estilos

export const ScannerLoadingView = ({ text = "Cargando..." }) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#E3A542" />
    <Text style={styles.info}>{text}</Text>
  </View>
);
