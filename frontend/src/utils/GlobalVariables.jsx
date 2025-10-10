import { jwtDecode } from "jwt-decode";
import { useAuth } from "../zustand/Auth";

export const decodedUser = () => {
  const { user } = useAuth();
  return jwtDecode(user);
};

// FOR CREATE AND EDIT USER MODAL
export const permissionGroups = [
  {
    name: "Settings",
    children: ["Admin Settings"],
  },
];
