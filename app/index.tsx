import { Redirect } from "expo-router";

export default function RootIndex() {
  // Redirige del root (/) a tu pantalla principal (el scanner)
  // Asegúrate de que la ruta sea la correcta según tu (tabs) layout
  return <Redirect href="/(app)/(tabs)/scanner" />;
}
