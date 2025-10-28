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
    </Stack>
  );
};

export default AppLayout;
