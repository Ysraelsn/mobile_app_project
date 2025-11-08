import { useAuth } from "@/hooks/useAuth";
import React, { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

// Importa los nuevos hooks
import { useAttendance } from "../../../hooks/useAttendance";
import { useScannerPermissions } from "../../../hooks/useScannerPermissions";

// Importa los nuevos componentes de UI
import { ScannerCameraView } from "../../../components/scanner/ScannerCameraView";
import { ScannerLoadingView } from "../../../components/scanner/ScannerLoadingView";
import { ScannerPermissionView } from "../../../components/scanner/ScannerPermissionView";

import * as notificationService from "../../../services/notificationService";

export default function TabScannerScreen() {
  // Estado local de la UI
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isScannerActive, setIsScannerActive] = useState(true);
  const isProcessingRef = useRef(false);
  const { isLoggedIn } = useAuth();

  const {
    permission,
    loading: permissionLoading,
    requestCameraPermission,
  } = useScannerPermissions();

  const {
    registerAttendance,
    isLoading: isRegistering,
    error: registrationError,
    successData,
    reset: resetAttendanceState,
  } = useAttendance();

  useEffect(() => {
    if (successData) {
      notificationService.schedulePushNotification(
        "✅ Asistencia registrada",
        `Empleado: ${successData.employeeName}`,
      );
      resetAttendanceState();
    }
  }, [successData, resetAttendanceState]);

  useEffect(() => {
    if (registrationError) {
      Alert.alert("Error", registrationError.message);
      resetAttendanceState();
    }
  }, [registrationError, resetAttendanceState]);

  // --- Handlers ---

  const handleBarcodeScanned = async (result: any) => {
    if (isProcessingRef.current || !isScannerActive) return;

    isProcessingRef.current = true;
    setIsScannerActive(false);
    setScannedData(result.data);

    Alert.alert(
      "Confirmar asistencia",
      `¿Registrar asistencia para: ${result.data}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => handleRescan(),
        },
        {
          text: "Registrar",
          onPress: async () => {
            await registerAttendance(result.data);
            isProcessingRef.current = false;
          },
        },
      ],
      { cancelable: false },
    );
  };

  const handleRescan = () => {
    setIsScannerActive(true);
    setScannedData(null);
    isProcessingRef.current = false;
  };

  // --- Render Logic ---

  // if (!isLoggedIn) {
  //   return <Redirect href={"/(auth)/login"} />;
  // }

  if (permissionLoading) {
    return <ScannerLoadingView text="Solicitando permisos de cámara..." />;
  }

  if (isRegistering) {
    return <ScannerLoadingView text="Registrando asistencia..." />;
  }

  if (permission === "denied") {
    return <ScannerPermissionView onRetry={requestCameraPermission} />;
  }

  return (
    <ScannerCameraView
      isScannerActive={isScannerActive}
      scannedData={scannedData}
      onBarcodeScanned={handleBarcodeScanned}
      onRescan={handleRescan}
    />
  );
}
