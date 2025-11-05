// (app)/(tabs)/history.tsx
import { Button } from "@/components/atoms";
import { useAuth } from "@/hooks/useAuth";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAttendanceHistory } from "@/hooks/useAttendanceHistory";

import { AttendanceItem } from "@/components/attendance/AttendanceItem";
import { logoutUser } from "@/services/auth.service";
import { Redirect } from "expo-router";

export default function TabHistoryScreen() {
  const { isLoggedIn } = useAuth();

  // Usamos el hook para obtener los datos
  const { attendanceList, isLoading, error } = useAttendanceHistory();

  // Handler para cerrar sesión
  const handleLogout = async () => {
    await logoutUser();
    // El listener onAuthStateChanged en tu useAuth se encargará de
    // actualizar el estado de Redux y provocar la redirección.
  };

  // Verifica si el usuario está autenticado
  if (!isLoggedIn) {
    return <Redirect href={"/(auth)/login"} />;
  }

  // Estado de Carga
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#111827" />
        <Text style={styles.loadingText}>Cargando historial...</Text>
      </View>
    );
  }

  // Estado de Error
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  // Estado con Datos
  return (
    <View style={styles.container}>
      {/* Encabezado con título y botón de logout */}
      <View style={styles.header}>
        <Text style={styles.title}>Historial de Asistencia</Text>
      </View>

      {/*  FlatList para mostrar los registros */}
      <FlatList
        data={attendanceList}
        renderItem={({ item }) => <AttendanceItem item={item} />}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.centeredEmpty}>
            <Text style={styles.emptyText}>
              No hay registros de asistencia.
            </Text>
          </View>
        }
      />
      <View style={styles.logout}>
        <Button label="Cerrar Sesión" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
  },
  centeredEmpty: {
    marginTop: 50,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#52525b",
  },
  emptyText: {
    fontSize: 16,
    color: "#71717a",
  },
  errorText: {
    color: "#e11d48",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    backgroundColor: "#E3A542",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  list: {
    flex: 1,
  },
  logout: {
    display: "flex",
    width: "50%",
    alignSelf: "flex-end",
    margin: 16,
  },
});
