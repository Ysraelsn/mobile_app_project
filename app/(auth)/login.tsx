import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { Button, Loader, Text, TextInput } from "@/components/atoms";
import { useAuth } from "@/hooks";

export const LoginScreen = () => {
  const { startLogin, status, errorMessage } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await startLogin(email, password);
      router.replace("/(app)/(tabs)/history");
    } catch (error) {
      console.log("Login failed:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <Text>Please log in with your email and password.</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />

      {status === "failed" && errorMessage ? (
        <Text style={{ color: "red" }}>{errorMessage}</Text>
      ) : null}

      <Button onPress={handleLogin} disabled={status === "loading"}>
        {status === "loading" ? (
          <Loader color="white" />
        ) : (
          <Text align="center">Log In</Text>
        )}
      </Button>
    </View>
  );
};

export default LoginScreen;
