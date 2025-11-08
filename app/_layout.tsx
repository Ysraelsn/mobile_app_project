import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen"; // <-- Para controlar el splash
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react"; // <-- Hooks necesarios
import { View } from "react-native"; // <-- Importante: Importar View
import "react-native-reanimated";
import { enableFreeze } from "react-native-screens";

import { store } from "@/store";
import * as Notifications from "expo-notifications";
import { Provider } from "react-redux";

// Evita que el splash se oculte automáticamente al inicio
SplashScreen.preventAutoHideAsync();

// Configuración para manejar las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Desactiva la congelación experimental para evitar crashes en Android
enableFreeze(false);

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Espera artificial de 2 segundos
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Indica que la app está lista para renderizarse
        setIsAppReady(true);
      }
    }

    prepare();
  }, []);

  // Oculta el splash nativo una vez que nuestra UI está lista
  useEffect(() => {
    if (isAppReady) {
      SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!isAppReady) {
    // Muestra una View del color del splash mientras se carga la app.
    // Esto ayuda a evitar el crash 'addViewAt' en Android.
    return <View style={{ flex: 1, backgroundColor: "#E3A542" }} />;
  }

  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false, presentation: "modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </Provider>
  );
}
