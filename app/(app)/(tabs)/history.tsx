import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
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
  const { isLoggedIn, userId, userRole, startLogout } = useAuth() as any;

  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [screenTitle, setScreenTitle] = useState("Mi Historial de Asistencia");

  const handleLogout = useCallback(() => {
    startLogout();
  }, [startLogout]);

  // -------------------------------------------------------------------
  // Lógica de Obtención de Datos (onSnapshot Condicional por Rol)
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!isLoggedIn || !userId) {
      setIsLoading(false);
      return;
    }

    const db = getFirestore();
    const attendanceCollection = collection(db, "attendance");
    let historyQuery = query(attendanceCollection);

    if (userRole === "admin") {
      setScreenTitle("Historial General de Asistencia");
    } else {
      setScreenTitle("Mi Historial de Asistencia");
      historyQuery = query(attendanceCollection, where("userId", "==", userId));
    }

    historyQuery = query(historyQuery, orderBy("timestamp", "desc"));

    const unsubscribe: Unsubscribe = onSnapshot(
      historyQuery,
      (snapshot) => {
        setError(null);

        try {
          const historyData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as AttendanceRecord[];

          setAttendance(historyData);
        } catch (e) {
          console.error("Error en onSnapshot:", e);
          setError("Error al cargar los datos en tiempo real.");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Error en el listener de Firestore:", error);
        setError("Error de conexión con la base de datos.");
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [isLoggedIn, userId, userRole]);
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
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{screenTitle}</Text>

      {attendance.length === 0 ? (
        <Text style={styles.mock}>
          No hay registros de asistencia para mostrar.
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
    paddingTop: 80,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logoutButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#ff4d4d",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    zIndex: 10,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
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
