import { Stack } from "expo-router";

import { LoaderScreen } from "@/components/screens";
import { useAuth } from "@/hooks/useAuth";

export const AppLayout = () => {
  const { status } = useAuth();

  if (status === "checking") {
    return <LoaderScreen />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="history/[id]" // Esta es la ruta al archivo (app)/history/[id].tsx
        options={{
          headerShown: true,
          title: "Detalle de Asistencia",
          headerBackTitle: "Historial", // Para un botón "Atrás" más claro en iOS
        }}
      />
    </Stack>
  );
};

export default AppLayout;
