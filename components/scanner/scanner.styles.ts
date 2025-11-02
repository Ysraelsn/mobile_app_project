import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  cameraContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "black",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  info: {
    marginTop: 12,
    fontSize: 16,
  },
  error: {
    marginBottom: 16,
    textAlign: "center",
    color: "#cc0000",
  },

  overlay: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    alignItems: "center",
  },
  resultText: {
    fontSize: 18,
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
  },

  overlayBox: {
    position: "absolute",
    top: "35%",
    left: "10%",
    width: "80%",
    height: 150,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  laserLine: {
    position: "absolute",
    top: "50%",
    width: "100%",
    height: 2,
    backgroundColor: "red",
  },

  overlayText: {
    position: "absolute",
    top: "40%",
    marginTop: 160,
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    width: "100%",
  },
});
