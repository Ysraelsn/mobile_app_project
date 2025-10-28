import { createAsyncThunk } from "@reduxjs/toolkit";

import { fetchUserData, login } from "@/services/auth.service";
import { setUser } from "@/store/user";

export const loginUser = createAsyncThunk<
  { userId: string },
  { email: string; password: string },
  { rejectValue: string }
>("auth/startLogin", async (payload, thunkAPI) => {
  // Call login service
  const res = await login(payload.email, payload.password);

  if (!res.ok) {
    return thunkAPI.rejectWithValue(res.errorMessage);
  }

  const { data } = res;

  const userData = await fetchUserData();

  if (!userData) {
    console.error("loginUser: No user data found after login");
    return thunkAPI.rejectWithValue(
      "Ocurrió un error al cargar el perfil. Intenta de nuevo más tarde.",
    );
  }

  // Fill in user data in user slice
  thunkAPI.dispatch(
    setUser({
      userId: data.userId,
      email: data.email,
      name: data.name,
      role: userData.role,
      photoURL: data.photoURL,
    }),
  );

  // Return userId for auth slice
  return { userId: data.userId };
});
