import {
  getUserData,
  loginWithEmailAndPassword,
  logoutFirebase,
  registerWithEmailAndPassword,
} from "@/firebase/providers";

export const login = async (email: string, password: string) => {
  return await loginWithEmailAndPassword(email, password);
};

export const fetchUserData = async () => {
  return await getUserData();
};

export const registerUser = async (
  email: string,
  password: string,
  name: string,
) => {
  return await registerWithEmailAndPassword(email, password, name);
};

export const logoutUser = async () => {
  return await logoutFirebase();
};
