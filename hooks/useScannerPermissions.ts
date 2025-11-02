import { Camera } from "expo-camera";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";

type PermissionState = "unknown" | "granted" | "denied";

export const useScannerPermissions = () => {
  const [permission, setPermission] = useState<PermissionState>("unknown");
  const [loading, setLoading] = useState<boolean>(true);

  const requestCameraPermission = async () => {
    setLoading(true);
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission(status === "granted" ? "granted" : "denied");
    } catch {
      setPermission("denied");
    } finally {
      setLoading(false);
    }
  };

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.warn("Permisos de notificación no concedidos");
    }
  };

  useEffect(() => {
    // Pedir permisos de cámara
    requestCameraPermission();

    // Configurar notificaciones
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

    // Pedir permisos de notificación
    requestNotificationPermission();
  }, []);

  return { permission, loading, requestCameraPermission };
};
