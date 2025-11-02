import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";

/**
 * Solicita permisos para notificaciones push.
 * Muestra alertas si es denegado o si no es un dispositivo físico.
 */
export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.warn(
      "Debe usar un dispositivo físico para las Notificaciones Push",
    );
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert(
      "Permiso denegado",
      "No se pudo obtener el permiso para notificaciones.",
    );
    return;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
}

/**
 * Dispara una notificación push local de forma inmediata.
 * @param title - El título de la notificación.
 * @param body - El cuerpo (mensaje) de la notificación.
 */
export async function schedulePushNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
    },
    trigger: null, // Disparar inmediatamente
  });
}
