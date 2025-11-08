import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { firebaseDB } from "../firebase/config";

// 1. Definimos la estructura del documento en Firestore
interface AttendanceDoc {
  employeeId: string;
  employeeName: string;

  timestamp: Timestamp;
  userId: string;
}

// 2. Definimos el tipo de dato que usará el componente (con el ID)
export type AttendanceRecord = AttendanceDoc & { id: string };

export const useAttendanceHistory = () => {
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Se define la colección "attendance" par hacer fetch
    const attendanceColRef = collection(firebaseDB, "attendance");

    // Query para ordenar los resultados por fecha
    const q = query(attendanceColRef, orderBy("timestamp", "desc"));

    // onSnapsot para actualizar datos en tiempo real
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const records: AttendanceRecord[] = [];
        querySnapshot.forEach((doc) => {
          records.push({
            id: doc.id,
            ...(doc.data() as AttendanceDoc),
          });
        });
        setAttendanceList(records);
        setIsLoading(false);
      },
      (err) => {
        // Manejo de errores
        console.error("Error fetching attendance history:", err);
        setError(new Error("No se pudo cargar el historial."));
        setIsLoading(false);
      },
    );

    // Función de limpieza que se llama al desmontar el componente
    return () => unsubscribe();
  }, []); // El array vacío asegura que se ejecute solo una vez

  return { attendanceList, isLoading, error };
};
