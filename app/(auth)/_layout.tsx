import { Stack } from "expo-router";

import { useAuth } from "@/hooks";

export const AuthLayout = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Stack>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
};

export default AuthLayout;
