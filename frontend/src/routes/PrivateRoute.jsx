import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../zustand/Auth";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ route }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // const BlockingPage = () => {
  //   return (
  //     <div className="w-screen bg-white h-screen fixed top-0 left-0 z-[999]" />
  //   );
  // };

  // if (isLoading) {
  //   return <BlockingPage />;
  // }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  localStorage.setItem("route", location.pathname);

  let decode = null;
  try {
    decode = jwtDecode(user);
  } catch (error) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (route) {
    const hasAccess = decode?.Access?.some((access) => access === route);

    if (!hasAccess) {
      return <Navigate to="*" replace />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;
