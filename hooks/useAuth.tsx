import { firebaseAuth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

import { fetchUserData } from "@/services/auth.service";
import { loginUser, logout, setAuth } from "@/store/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearUser, setUser } from "@/store/user";

export const useAuth = () => {
  const authState = useAppSelector((state) => state.auth);
  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const startCheckingAuth = async () => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        dispatch(logout());
        dispatch(clearUser());
        return;
      }

      const userData = await fetchUserData();

      if (!userData) {
        dispatch(logout());
        dispatch(clearUser());
        return;
      }

      dispatch(
        setUser({
          userId: user.uid,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          photoURL: user.photoURL,
        }),
      );
      dispatch(setAuth({ userId: user.uid }));
    });

    return unsubscribe;
  };

  const startLogin = async (email: string, password: string) => {
    return dispatch(loginUser({ email, password })).unwrap();
  };

  return {
    // Properties
    userId: authState.userId,
    status: authState.status,
    isLoggedIn: authState.isLoggedIn,
    errorMessage: authState.errorMessage,
    userRole: userState.role,

    // Methods
    startCheckingAuth,
    startLogin,
    startLogout: () => dispatch(logout()),
  };
};
