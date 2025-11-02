import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";

import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBdzB8GfYy3e6Zhgsz_k1789GgzP8dtvIs",
  authDomain: "beeontime-81605.firebaseapp.com",
  projectId: "beeontime-81605",
  storageBucket: "beeontime-81605.firebasestorage.app",
  messagingSenderId: "46329225461",
  appId: "1:46329225461:web:51fc823acbaae6173be5bc",
  measurementId: "G-ML2G9CKH3M",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const firebaseDB = getFirestore(firebaseApp);

// ** Este proyecto es de prueba, no usar estas credenciales en producción, en producción usar variables de entorno u otro método seguro para manejar credenciales **
