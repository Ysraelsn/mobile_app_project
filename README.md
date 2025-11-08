# 🐝 BeeonTime

> **BeeonTime** es una aplicación móvil desarrollada con **Expo 54** y **React Native**, diseñada para optimizar el **registro de asistencia laboral** mediante el escaneo de **códigos de barras en gafetes**.  
> Además, integra **notificaciones push** y una **base de datos en Firebase** para ofrecer una experiencia fluida, segura y en tiempo real.

---

## 🚀 Características principales

- 📸 **Escaneo de gafetes** mediante la cámara del dispositivo utilizando [`expo-camera`](https://docs.expo.dev/versions/latest/sdk/camera/).  
- 🔔 **Notificaciones push** para avisos y recordatorios, implementadas con [`expo-notifications`](https://docs.expo.dev/versions/latest/sdk/notifications/).  
- 🔐 **Autenticación de usuarios** con **Firebase Authentication**.  
- ☁️ **Base de datos en tiempo real** con **Firebase Firestore** para almacenar registros de asistencia.  
- ⚡️ Construida con **Expo SDK 54** y **React Native**, compatible con Android y iOS.  

---

## 🧠 Tecnologías utilizadas

| Categoría        | Tecnología / Librería           |
|------------------|---------------------------------|
| Framework móvil  | [Expo 54](https://expo.dev/)    |
| UI / Core        | [React Native](https://reactnative.dev/) |
| Cámara           | [expo-camera](https://docs.expo.dev/versions/latest/sdk/camera/) |
| Notificaciones   | [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) |
| Backend / Auth   | [Firebase Authentication](https://firebase.google.com/docs/auth) |
| Base de datos    | [Cloud Firestore](https://firebase.google.com/docs/firestore) |
| Lenguaje         |  TypeScript |

---

## ⚙️ Instalación y configuración

1. **Clona el repositorio**

   ```bash
   git clone https://github.com/Ysraelsn/BeeOnTime.git
   cd BeeonTime
2. **Instala las dependencias**

   ```bash
   npm install
3. **Configura Firebase**
   Crea un proyecto en [Firebase Console](https://console.firebase.google.com/u/0/)
   y copia tus credenciales al archivo:
   ```bash
   /firebase/config.ts

   ```
   Ejemplo:
   ```bash
   export const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "XXXXXXXXXXX",
    appId: "1:XXXXXXXXXXX:web:XXXXXXXXXXXXXX"
    };
5. **Ejecuta el proyecto**
   ```bash
   npm expo start
   ```
   Escanea el código QR con la app **Expo Go** o ejecuta en un emulador
   

## 🔒 Permisos requeridos
Para el correcto funcionamiento, la app solicita los siguientes permisos:

- Acceso a la cámara para el escaneo de códigos.
- Permiso de notificaciones para recibir alertas.
- Acceso a internet para sincronizar con Firebase.

## 🧪 Próximas mejoras
- 👤 Sistema para usuarios
- 🎨 Mejora de interfaz y experiencia de usuario

## 🤝 Contribución

¿Quieres contribuir? ¡Toda ayuda es bienvenida!
  1. Haz un fork del repositorio.
  2. Crea una nueva rama:
     ```bash
     git checkout -b feature/nueva-funcionalidad
  3. Envía un Pull Request describiendo tus cambios.

## 🐝 Autores

BeeonTime es desarrollado por:
- [Axel García](https://github.com/System-Garcia)
- [Angel Alvarez](https://github.com/AngelAlvarez52)
- [Gabriel Vaca](https://github.com/gabrielvaca)
- [Israel Sánchez](https://github.com/Ysraelsn)
- [Karolina Arvizu](https://github.com/Karolinarvizu)

