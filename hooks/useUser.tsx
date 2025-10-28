import { useAppSelector } from "@/store/hooks";

export const useUser = () => {
  const userState = useAppSelector((state) => state.user);

  return {
    userId: userState.userId,
    name: userState.name,
    email: userState.email,
    role: userState.role,
    photoURL: userState.photoURL,
  };
};
