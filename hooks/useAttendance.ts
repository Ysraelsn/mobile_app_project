import { useAuth } from "@/hooks/useAuth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useCallback, useState } from "react";
import { firebaseDB } from "../firebase/config";

interface SuccessData {
  employeeName: string;
}

export const useAttendance = () => {
  const { userId } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  const registerAttendance = useCallback(
    async (employeeId: string) => {
      setIsLoading(true);
      setError(null);
      setSuccessData(null);

      if (!userId) {
        setError(new Error("Acceso denegado. Se requiere autenticación."));
        setIsLoading(false);
        return;
      }

      try {
        const employeeRef = doc(firebaseDB, "employees", employeeId);
        const employeeSnap = await getDoc(employeeRef);

        if (!employeeSnap.exists()) {
          throw new Error(
            `Empleado con ID ${employeeId} no encontrado en la base`,
          );
        }

        const employeeData = employeeSnap.data();
        const employeeName = employeeData.name;

        await addDoc(collection(firebaseDB, "attendance"), {
          employeeId,
          employeeName,
          userId: userId,
          timestamp: serverTimestamp(),
          // TODO: En futuras issues, implementar la lógica para alternar entre 'Entrada' y 'Salida'.
          type: "De entrada",
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
    },
    [userId],
  );

  const reset = useCallback(() => {
    setError(null);
    setSuccessData(null);
  }, []);

  return { registerAttendance, isLoading, error, successData, reset };
};
