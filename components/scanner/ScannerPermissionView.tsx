import React from "react";
import { Button, Text, View } from "react-native";
import { styles } from "./scanner.styles"; // Importa los estilos

interface Props {
  onRetry: () => void;
}

export const ScannerPermissionView = ({ onRetry }: Props) => (
  <View style={styles.container}>
    <Text style={styles.title}>Permiso de cámara denegado</Text>
    <Text style={styles.error}>
      Necesitamos acceso a la cámara para escanear códigos. Por favor permita el
      acceso.
    </Text>
    <Button title="Reintentar" onPress={onRetry} color="#cc0000" />
  </View>
);
