import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";

import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAyK5T4IDeDbzW66UJpAnhnaTUT2TqCQJg",
  authDomain: "bee-on-time-67e0b.firebaseapp.com",
  projectId: "bee-on-time-67e0b",
  storageBucket: "bee-on-time-67e0b.firebasestorage.app",
  messagingSenderId: "242879760001",
  appId: "1:242879760001:web:f88250832b426a624f2f80",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const firebaseDB = getFirestore(firebaseApp);

// ** Este proyecto es de prueba, no usar estas credenciales en producción, en producción usar variables de entorno u otro método seguro para manejar credenciales **
