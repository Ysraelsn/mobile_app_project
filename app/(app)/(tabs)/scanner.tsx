import { Camera, CameraView } from "expo-camera";
import * as Notifications from "expo-notifications";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { firebaseDB } from "../../../firebase/config";

import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";

type PermissionState = "unknown" | "granted" | "denied";

export default function TabScannerScreen() {
  const [permission, setPermission] = useState<PermissionState>("unknown");
  const [loading, setLoading] = useState<boolean>(true);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isScannerActive, setIsScannerActive] = useState(true);
  const isProcessingRef = useRef(false);

  const handleRegisterAttendance = async (employeeId: string) => {
    return new Promise<void>((resolve) => {
      Alert.alert(
        "Confirmar asistencia",
        `¿Registrar asistencia para: ${employeeId}?`,
        [
          {
            text: "Cancelar",
            style: "cancel",
            onPress: () => {
              setIsScannerActive(true); // reactivar escáner
              resolve();
            },
          },
          {
            text: "Registrar",
            onPress: async () => {
              try {
                await addDoc(collection(firebaseDB, "attendance"), {
                  employeeId,
                  timestamp: serverTimestamp(),
                });

                Alert.alert("Listo", "Asistencia registrada correctamente.");
              } catch (error) {
                console.error("Error guardando asistencia:", error);
                Alert.alert(
                  "Error",
                  "No se pudo guardar la asistencia. Intentá de nuevo.",
                );
              } finally {
                setIsScannerActive(true);
                setScannedData(null);
                resolve();
              }
            },
          },
        ],
        { cancelable: false },
      );
    });
  };

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

    // Configura el comportamiento de las notificaciones en primer plano
    Notifications.setNotificationHandler({
      handleNotification:
        async (): Promise<Notifications.NotificationBehavior> => {
          return {
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
          };
        },
    });

    // Solicita permisos de notificación
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permisos de notificación no concedidos");
      }
    };

    requestNotificationPermission();
  }, []);

  const handleBarcodeScanned = async (result: any) => {
    if (isProcessingRef.current || !isScannerActive) return;

    isProcessingRef.current = true;

    setIsScannerActive(false);
    setScannedData(result.data);

    await handleRegisterAttendance(result.data);
    isProcessingRef.current = false;
  };

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
        barcodeScannerSettings={{
          barcodeTypes: ["code128", "ean13"],
        }}
        onBarcodeScanned={isScannerActive ? handleBarcodeScanned : undefined}
      />

      <View style={styles.overlayBox}>
        <View style={styles.laserLine} />
      </View>
      <Text style={styles.overlayText}>Apunta al código de barras</Text>

      {scannedData && !isScannerActive && (
        <View style={styles.overlay}>
          <Text style={styles.resultText}>Empleado: {scannedData}</Text>

          <Button
            title="Escanear de nuevo"
            onPress={() => {
              setIsScannerActive(true);
              setScannedData(null);
            }}
          />
        </View>
      )}
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

  overlay: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    alignItems: "center",
  },
  resultText: {
    fontSize: 18,
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
  },

  overlayBox: {
    position: "absolute",
    top: "35%", // aproximadamente en el centro
    left: "10%",
    width: "80%",
    height: 150,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
    backgroundColor: "rgba(0,0,0,0.2)", // semitransparente
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  laserLine: {
    position: "absolute",
    top: "50%", // centro vertical del recuadro
    width: "100%",
    height: 2,
    backgroundColor: "red",
  },

  overlayText: {
    position: "absolute",
    top: "40%", // ajusta según dónde está el recuadro
    marginTop: 160, // un poco debajo del recuadro de 150px de alto
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    width: "100%",
  },
});
