import { Camera, CameraView } from "expo-camera";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";

type PermissionState = "unknown" | "granted" | "denied";

export default function TabScannerScreen() {
  const [permission, setPermission] = useState<PermissionState>("unknown");
  const [loading, setLoading] = useState<boolean>(true);

  const requestPermission = async () => {
    setLoading(true);
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission(status === "granted" ? "granted" : "denied");
    } catch {
      // ✅ SOLUCIÓN: Captura el error sin declararlo, eliminando la advertencia.
      setPermission("denied");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  // 1. Vista de Carga
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E3A542" />
        <Text style={styles.info}>Solicitando permisos de cámara...</Text>
      </View>
    );
  }

  // 2. Vista de Permiso Denegado
  if (permission === "denied") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Permiso de cámara denegado</Text>
        <Text style={styles.error}>
          Necesitamos acceso a la cámara para escanear códigos. Por favor
          permita el acceso.
        </Text>
        <Button
          title="Reintentar"
          onPress={requestPermission}
          color="#cc0000"
        />
      </View>
    );
  }

  // 3. Vista de Permiso Concedido: Muestra la cámara
  return (
    <View style={styles.cameraContainer}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        // La lógica de escaneo se añade aquí en la siguiente fase (onBarcodeScanned)
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  cameraContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "black",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  info: {
    marginTop: 12,
    fontSize: 16,
  },
  error: {
    marginBottom: 16,
    textAlign: "center",
    color: "#cc0000",
  },
});
