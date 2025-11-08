import { AttendanceItem } from "@/components/attendance/AttendanceItem";
import { useAttendanceHistory } from "@/hooks/useAttendanceHistory";
import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/services/auth.service";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function TabHistoryScreen() {
  const { isLoggedIn } = useAuth();
  const { attendanceList, isLoading, error } = useAttendanceHistory();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
  };

  // Renderizado condicional del CONTENIDO principal
  const renderContent = () => {
    if (!isLoggedIn) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.centeredContent}>
            <Text style={styles.emptyText}>
              Debes iniciar sesión para ver el historial.
            </Text>
            {/* Botón que lleva al modal de login de forma segura */}
            <View style={{ marginTop: 20 }}>
              <Button
                title="Iniciar Sesión"
                onPress={() => router.push("/(auth)/login")}
                color={"#E3A542"}
              />
            </View>
          </View>
        </SafeAreaView>
      );
    }

    if (isLoading) {
      return (
        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" color="#111827" />
          <Text style={styles.loadingText}>Cargando historial...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centeredContent}>
          <Text style={styles.errorText}>Error: {error.message}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={attendanceList}
        renderItem={({ item }) => <AttendanceItem item={item} />}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.centeredContent}>
            <Text style={styles.emptyText}>No hay registros.</Text>
          </View>
        }
      />
    );
  };

  // ESTRUCTURA BASE ESTABLE
  // Siempre renderizamos el mismo contenedor externo.
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Historial</Text>

          {/* Ajusté el botón para que quepa en el header */}
          <View style={styles.logout}>
            <Button title="Salir" onPress={handleLogout} color={"red"} />
          </View>
        </View>

        {/* El contenido cambia, pero el contenedor padre es estable */}
        <View style={styles.contentContainer}>{renderContent()}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E3A542", // Color del header para el área segura superior
  },
  logout: {
    width: "30%",
    alignContent: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: "#E3A542",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  contentContainer: {
    flex: 1,
  },
  centeredContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1, // Asegura que el EmptyComponent se pueda centrar
  },
  loadingText: { marginTop: 10, color: "#52525b" },
  errorText: { color: "#e11d48", fontSize: 16, fontWeight: "600" },
  emptyText: { fontSize: 16, color: "#71717a" },
});
