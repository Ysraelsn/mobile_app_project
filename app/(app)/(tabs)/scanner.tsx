import { Camera } from "expo-camera";
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
    } catch (e) {
      setPermission("denied");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.info}>Solicitando permisos de cámara...</Text>
      </View>
    );
  }

  if (permission === "denied") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Permiso de cámara denegado</Text>
        <Text style={styles.error}>
          Necesitamos acceso a la cámara para escanear códigos. Por favor
          permita el acceso.
        </Text>
        <Button title="Reintentar" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Permisos Concedidos, listo para la cámara
      </Text>
      <Text style={styles.mock}>Aquí iría la vista de la cámara</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  mock: {
    marginTop: 20,
    height: 1,
    width: "80%",
    backgroundColor: "#eee",
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
