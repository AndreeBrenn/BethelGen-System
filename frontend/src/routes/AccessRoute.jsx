import { jwtDecode } from "jwt-decode";
import { useAuth } from "../zustand/Auth";
import { Navigate, Outlet } from "react-router-dom";

const AccessRoute = ({ route }) => {
  const { user } = useAuth();
  const decode = user == null ? null : jwtDecode(user);

  return decode?.Access?.some((som) => som == route) ? (
    <Outlet />
  ) : (
    <Navigate to="*" />
  );
};

export default AccessRoute;
