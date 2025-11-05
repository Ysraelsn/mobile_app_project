import { deleteDoc, doc, getDoc, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firebaseDB } from "../firebase/config";

// Interfaz del documento
export interface AttendanceDoc {
  employeeId: string;
  employeeName: string;
  timestamp: Timestamp;
  userId: string;
}

export const useAttendanceRecord = (recordId: string | undefined) => {
  const [record, setRecord] = useState<AttendanceDoc | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Efecto para BUSCAR el registro
  useEffect(() => {
    if (!recordId) {
      setError("ID de registro no proporcionado.");
      setIsLoading(false);
      return;
    }

    const fetchRecord = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const docRef = doc(firebaseDB, "attendance", recordId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRecord(docSnap.data() as AttendanceDoc);
        } else {
          setError("No se encontró el registro.");
        }
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("No se pudo cargar el registro.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecord();
  }, [recordId]); // Depende del ID

  // Función para ELIMINAR el registro
  const deleteRecord = async () => {
    if (!recordId) {
      throw new Error("No hay ID de registro para eliminar.");
    }

    setIsDeleting(true);
    try {
      // Llama a deleteDoc
      const docRef = doc(firebaseDB, "attendance", recordId);
      await deleteDoc(docRef);
    } catch (err) {
      console.error("Error deleting document:", err);
      // Lanzamos el error para que el componente lo maneje
      throw new Error("No se pudo eliminar el registro.");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    // Estado
    record,
    isLoading,
    isDeleting,
    error,
    // Métodos
    deleteRecord,
  };
};
