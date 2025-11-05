import { useAttendanceRecord } from "@/hooks/useAttendanceRecord";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { doc, getFirestore, Timestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AttendanceDetailScreen() {
  //  Usar useLocalSearchParams para obtener el 'id' de la URL
  const { id } = useLocalSearchParams();
  const recordId = Array.isArray(id) ? id[0] : id; // Asegurarnos que id es un string
  const router = useRouter();

  const { record, isLoading, isDeleting, error, deleteRecord } =
    useAttendanceRecord(recordId) as any;

  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [localEmployeeId, setLocalEmployeeId] = useState("");
  const [localEmployeeName, setLocalEmployeeName] = useState("");
  const [localTimestampString, setLocalTimestampString] = useState("");

  useEffect(() => {
    if (record) {
      setLocalEmployeeId(record.employeeId || "");
      setLocalEmployeeName(record.employeeName || "");

      const date = record.timestamp
        ? new Date(record.timestamp.seconds * 1000)
        : new Date();
      setLocalTimestampString(
        date.toISOString().slice(0, 19).replace("T", " "),
      );
    }
  }, [record]);

  const handleUpdate = async () => {
    if (!recordId || isUpdating) return;

    if (!localEmployeeId || !localTimestampString || !localEmployeeName) {
      Alert.alert("Error", "Los campos no pueden estar vacíos.");
      return;
    }

    try {
      setIsUpdating(true);

      const parsedDate = new Date(localTimestampString.replace(" ", "T"));
      if (isNaN(parsedDate.getTime())) {
        throw new Error(
          "Formato de fecha u hora inválido. Usa YYYY-MM-DD HH:MM:SS.",
        );
      }
      const newTimestamp = Timestamp.fromDate(parsedDate);

      const db = getFirestore();
      const recordRef = doc(db, "attendance", recordId);

      await updateDoc(recordRef, {
        employeeId: localEmployeeId,
        employeeName: localEmployeeName,
        timestamp: newTimestamp,
      });

      Alert.alert("Éxito", "Registro actualizado correctamente.");
      setIsEditing(false);
    } catch (err) {
      Alert.alert(
        "Error",
        "No se pudo guardar la actualización: " + (err as Error).message,
      );
    } finally {
      setIsUpdating(false);
    }
  };

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

  if (isLoading || !record) {
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
        {!isEditing ? (
          <Button title="Editar Registro" onPress={() => setIsEditing(true)} />
        ) : (
          <Button
            title="Cancelar Edición"
            onPress={() => setIsEditing(false)}
            color="#ffc107"
          />
        )}

        {isEditing ? (
          <View>
            <Text style={styles.title}>Nombre de Empleado</Text>
            <TextInput
              style={styles.inputEditable}
              value={localEmployeeName}
              onChangeText={setLocalEmployeeName}
              placeholder="Nombre Completo"
            />

            <Text style={styles.title}>ID de Empleado</Text>
            <TextInput
              style={styles.inputEditable}
              value={localEmployeeId}
              onChangeText={setLocalEmployeeId}
              placeholder="ID Empleado (EMP00X)"
            />

            <Text style={styles.title}>Fecha y Hora (YYYY-MM-DD HH:MM:SS)</Text>
            <TextInput
              style={styles.inputEditable}
              value={localTimestampString}
              onChangeText={setLocalTimestampString}
              placeholder="Ej: 2025-11-05 12:00:00"
            />
          </View>
        ) : (
          <View>
            <Text style={styles.title}>Nombre de Empleado</Text>
            <Text style={styles.data}>{record.employeeName}</Text>

            <Text style={styles.title}>ID de Empleado</Text>
            <Text style={styles.data}>{record.employeeId}</Text>

            <Text style={styles.title}>Fecha y Hora</Text>
            <Text style={styles.data}>{formattedDate}</Text>
          </View>
        )}

        <Text style={styles.title}>ID del Documento</Text>
        <Text style={styles.data}>{recordId}</Text>

        {isEditing && (
          <View style={styles.saveButtonContainer}>
            <Button
              title={isUpdating ? "Guardando..." : "Guardar Cambios"}
              onPress={handleUpdate}
              disabled={isUpdating}
              color="#4CAF50"
            />
          </View>
        )}
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
  container: { flex: 1, backgroundColor: "#f3f4f6" },
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
  inputEditable: {
    fontSize: 18,
    color: "#000000",
    padding: 10,
    borderWidth: 1,
    borderColor: "#3b82f6",
    backgroundColor: "#e0f2fe",
    borderRadius: 8,
  },
  inputStatic: {
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
  saveButtonContainer: { marginTop: 20 },
});
