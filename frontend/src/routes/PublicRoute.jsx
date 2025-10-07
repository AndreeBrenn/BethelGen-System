import { useAuth } from "../zustand/Auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PublicRoute = () => {
  const { user, isLoading } = useAuth();
  const routeData = localStorage.getItem("route");
  const location = useLocation();

  const BlockingPage = () => {
    return (
      <div className="w-screen bg-white h-screen fixed top-0 left-0 z-[999]" />
    );
  };
  return isLoading ? (
    <BlockingPage />
  ) : !user ? (
    <Outlet />
  ) : routeData ? (
    <Navigate to={routeData} state={{ from: location }} replace />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default PublicRoute;
