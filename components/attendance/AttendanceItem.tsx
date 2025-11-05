import { AttendanceRecord } from "@/hooks/useAttendanceHistory";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

// El componente acepta la prop 'item'
interface Props {
  item: AttendanceRecord;
}

export const AttendanceItem = ({ item }: Props) => {
  //  Formatear el timestamp de Firebase a fecha y hora legibles
  const formattedDate = item.timestamp
    ? new Date(item.timestamp.seconds * 1000).toLocaleString("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // Para formato AM/PM
      })
    : "Fecha no disponible";

  return (
    <View style={styles.itemContainer}>
      {/* employeeId de forma destacada */}
      <Text style={styles.itemTitle}>{item.employeeId}</Text>

      {/* Mostramos el nombre como info secundaria, que es más legible */}
      <Text style={styles.itemSubtitle}>{item.employeeName}</Text>

      {/* Fecha formateada */}
      <Text style={styles.itemTimestamp}>{formattedDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "#e3a542",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemTitle: {
    // AC3: Estilo destacado
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    fontFamily: "monospace", // (Opcional) Buena idea para IDs
  },
  itemSubtitle: {
    fontSize: 16,
    color: "#2f2f2f",
    marginTop: 4,
    fontWeight: "600",
  },
  itemTimestamp: {
    // AC4: Estilo de fecha
    fontSize: 14,
    color: "#fcf6ec",
    marginTop: 8,
    textAlign: "right",
    fontWeight: "600",
  },
});
