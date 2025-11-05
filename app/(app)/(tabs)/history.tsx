import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface AttendanceRecord {
  id: string;
  employeeId: string;
  timestamp: any;
  employeeName: string;
  type?: "Entrada" | "Salida";
}

export default function TabHistoryScreen() {
  const { isLoggedIn, userId } = useAuth();

  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -------------------------------------------------------------------
  // Lógica de Obtención de Datos (Consulta Única y Directa)
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!isLoggedIn || !userId) {
      setIsLoading(false);
      return;
    }

    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      const db = getFirestore();

      try {
        const historyQuery = query(
          collection(db, "attendance"),
          where("userId", "==", userId),
          orderBy("timestamp", "desc"),
        );
        const historySnapshot = await getDocs(historyQuery);

        const historyData = historySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as AttendanceRecord[];

        setAttendance(historyData);
      } catch (e) {
        console.error("Error al obtener historial:", e);
        setError("Error al cargar el historial. Intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [isLoggedIn, userId]);
  // -------------------------------------------------------------------

  if (!isLoggedIn) {
    return <Redirect href={"/(auth)/login"} />;
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Cargando historial...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: "red" }]}>{error}</Text>
        <Text style={styles.mock}>
          Verifica la conexión o contacta a soporte.
        </Text>
      </View>
    );
  }

  const renderItemCrudo = ({ item }: { item: AttendanceRecord }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Nombre: **{item.employeeName}**</Text>
      <Text style={styles.itemText}>Tipo: {item.type || "N/A"}</Text>
      <Text style={styles.itemText}>
        Fecha/Hora: {item.timestamp?.toDate().toLocaleString() || "Cargando..."}
      </Text>
      <View style={styles.separator} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Historial de Asistencia</Text>

      {attendance.length === 0 ? (
        <Text style={styles.mock}>
          No hay registros de asistencia para tu cuenta.
        </Text>
      ) : (
        <FlatList
          data={attendance}
          renderItem={renderItemCrudo}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  list: {
    width: "100%",
    paddingHorizontal: 20,
  },
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  itemText: {
    fontSize: 16,
    lineHeight: 24,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 5,
  },
  mock: {
    marginTop: 30,
    color: "#666",
    fontSize: 16,
  },
});
