import { jwtDecode } from "jwt-decode";
import { useAuth } from "../zustand/Auth";

export const decodedUser = () => {
  const { user } = useAuth();
  return jwtDecode(user);
};
