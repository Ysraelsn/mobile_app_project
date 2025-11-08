import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firebaseAuth, firebaseDB } from "./config";

type LoginData = {
  userId: string;
  email: string;
  name: string;
  photoURL?: string | null;
};

type LoginResult =
  | { ok: true; data: LoginData }
  | { ok: false; errorMessage: string };

export const loginWithEmailAndPassword = async (
  email: string,
  password: string,
): Promise<LoginResult> => {
  try {
    const { user } = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    );

    return {
      ok: true,
      data: {
        userId: user.uid,
        email,
        name: user.displayName!,
        photoURL: user.photoURL,
      },
    };
  } catch (error) {
    return {
      ok: false,
      errorMessage: mapFirebaseAuthError(error, { context: "signin" }),
    };
  }
};

export const logoutFirebase = async () => {
  return await firebaseAuth.signOut();
};

export const registerWithEmailAndPassword = async (
  email: string,
  password: string,
  name: string,
): Promise<LoginResult> => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    );

    // Update display name
    await updateProfile(firebaseAuth.currentUser!, { displayName: name });

    // Save additional user data to Firestore
    await setDoc(doc(firebaseDB, "users", user.uid), {
      uid: user.uid,
      name: name,
      role: "user",
      email: email,
      photoURL: user.photoURL,
      createdAt: new Date(),
    });

    return {
      ok: true,
      data: {
        userId: user.uid,
        email,
        name: name,
        photoURL: user.photoURL,
      },
    };
  } catch (error) {
    return {
      ok: false,
      errorMessage: mapFirebaseAuthError(error, { context: "signup" }),
    };
  }
};

export const getUserData = async () => {
  try {
    const user = firebaseAuth.currentUser;
    if (!user) return null;

    const docRef = doc(firebaseDB, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
      userId: user.uid,
      email: user.email!,
      name: docSnap.data().name,
      role: docSnap.data().role,
      photoURL: user.photoURL,
    };
  } catch (error) {
    console.log("Error fetching user data:", (error as Error).message);
    return null;
  }
};

export const mapFirebaseAuthError = (
  err: any,
  opts?: { context?: "signin" | "signup" | "other" },
) => {
  const code = err?.code ?? "";

  const specific = {
    "auth/invalid-email": "El correo no es válido.",
    "auth/user-disabled": "La cuenta ha sido deshabilitada. Contacta soporte.",
    "auth/user-not-found": "No existe una cuenta con ese correo.",
    "auth/wrong-password": "Contraseña incorrecta.",
    "auth/email-already-in-use": "Ya existe una cuenta con ese correo.",
    "auth/weak-password": "La contraseña es demasiado débil.",
    "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
  } as Record<string, string>;

  if (opts?.context === "signin") {
    if (
      code === "auth/wrong-password" ||
      code === "auth/user-not-found" ||
      code === "auth/invalid-email"
    ) {
      return "Email o contraseña incorrectos.";
    }
    if (code === "auth/user-disabled") return specific[code];
    if (code === "auth/too-many-requests") return specific[code];
  }

  if (specific[code]) return specific[code];

  if (code === "permission-denied")
    return "No tienes permiso para acceder a esos datos.";
  if (code === "unavailable")
    return "Servicio no disponible. Intenta más tarde.";

  return "Ocurrió un error. Intenta de nuevo.";
};
