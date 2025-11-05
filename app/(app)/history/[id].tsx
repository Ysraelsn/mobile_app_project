import { useAttendanceRecord } from "@/hooks/useAttendanceRecord";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function AttendanceDetailScreen() {
  //  Usar useLocalSearchParams para obtener el 'id' de la URL
  const { id } = useLocalSearchParams();
  const recordId = Array.isArray(id) ? id[0] : id; // Asegurarnos que id es un string
  const router = useRouter();

  const { record, isLoading, isDeleting, error, deleteRecord } =
    useAttendanceRecord(recordId);

  const handleDelete = async () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Seguro que quieres eliminar este registro? Esta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRecord();
              router.back();
            } catch (err) {
              Alert.alert("Error", (err as Error).message);
            }
          },
        },
      ],
    );
  };

  // --- Lógica de Renderizado ---

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!record) {
    return (
      <View style={styles.centered}>
        <Text>No hay datos disponibles para este registro.</Text>
      </View>
    );
  }

  // Formatear la fecha para que sea más legible en el detalle
  const formattedDate = record.timestamp
    ? new Date(record.timestamp.seconds * 1000).toLocaleString("es-MX", {
        dateStyle: "full",
        timeStyle: "short",
      })
    : "Fecha no disponible";

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Detalle de Asistencia" }} />

      <View style={styles.card}>
        <Text style={styles.title}>Nombre de Empleado</Text>
        <Text style={styles.data}>{record.employeeName}</Text>

        <Text style={styles.title}>ID de Empleado</Text>
        <Text style={styles.data}>{record.employeeId}</Text>

        <Text style={styles.title}>Fecha y Hora</Text>
        <Text style={styles.data}>{formattedDate}</Text>

        <Text style={styles.title}>ID del Documento</Text>
        <Text style={styles.data}>{recordId}</Text>
      </View>
      <View style={styles.deleteButtonContainer}>
        <Button
          title={isDeleting ? "Eliminando..." : "Eliminar Registro"}
          color="#e11d48"
          onPress={handleDelete}
          disabled={isDeleting}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3a542",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f3f4f6",
  },
  errorText: {
    color: "#e11d48",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#ffffff",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6b7280",
    marginTop: 12,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  data: {
    fontSize: 18,
    color: "#111827",
    padding: 10,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
  },
  deleteButtonContainer: {
    marginHorizontal: 16,
    marginVertical: 10,
    paddingBottom: 20,
  },
});
