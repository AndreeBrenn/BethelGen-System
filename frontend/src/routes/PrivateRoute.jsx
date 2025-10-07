import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../zustand/Auth";

const PrivateRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    localStorage.setItem("route", location.pathname);
  }

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
