import { CameraView } from "expo-camera";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { styles } from "./scanner.styles"; // Importa los estilos

interface Props {
  isScannerActive: boolean;
  scannedData: string | null;
  onBarcodeScanned: (result: any) => void;
  onRescan: () => void;
}

export const ScannerCameraView = ({
  isScannerActive,
  scannedData,
  onBarcodeScanned,
  onRescan,
}: Props) => {
  return (
    <View style={styles.cameraContainer}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["code128", "ean13"],
        }}
        onBarcodeScanned={isScannerActive ? onBarcodeScanned : undefined}
      />

      {/* Overlays visuales */}
      <View style={styles.overlayBox}>
        <View style={styles.laserLine} />
      </View>
      <Text style={styles.overlayText}>Apunta al código de barras</Text>

      {/* Overlay de resultado y botón de re-escanear */}
      {scannedData && !isScannerActive && (
        <View style={styles.overlay}>
          <Text style={styles.resultText}>Empleado: {scannedData}</Text>
          <Button title="Escanear de nuevo" onPress={onRescan} />
        </View>
      )}
    </View>
  );
};
