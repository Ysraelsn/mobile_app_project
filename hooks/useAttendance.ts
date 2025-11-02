import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useCallback, useState } from "react";
import { firebaseDB } from "../firebase/config"; // Asegúrate que la ruta sea correcta

interface SuccessData {
  employeeName: string;
}

export const useAttendance = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  const registerAttendance = useCallback(async (employeeId: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessData(null);

    try {
      // 1️⃣ Buscar nombre del empleado en Firestore
      const employeeRef = doc(firebaseDB, "employees", employeeId);
      const employeeSnap = await getDoc(employeeRef);

      if (!employeeSnap.exists()) {
        throw new Error(
          `Empleado con ID ${employeeId} no encontrado en la base`,
        );
      }

      const employeeData = employeeSnap.data();
      const employeeName = employeeData.name;

      // 2️⃣ Guardar asistencia con nombre
      await addDoc(collection(firebaseDB, "attendance"), {
        employeeId,
        employeeName,
        timestamp: serverTimestamp(),
      });

      setSuccessData({ employeeName });
    } catch (err) {
      console.error("Error guardando asistencia:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("No se pudo guardar la asistencia. Intentá de nuevo."),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setSuccessData(null);
  }, []);

  return { registerAttendance, isLoading, error, successData, reset };
};
