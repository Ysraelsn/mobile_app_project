import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";

import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDCtMa52byvLLUxlcbk9EsVWhow2fP1RTA",
  authDomain: "testeo-6dfe6.firebaseapp.com",
  projectId: "testeo-6dfe6",
  storageBucket: "testeo-6dfe6.firebasestorage.app",
  messagingSenderId: "18058417470",
  appId: "1:18058417470:web:8790f23349af9f8725886f",
  measurementId: "G-G3SCMYHSKK",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const firebaseDB = getFirestore(firebaseApp);

// ** Este proyecto es de prueba, no usar estas credenciales en producción, en producción usar variables de entorno u otro método seguro para manejar credenciales **
