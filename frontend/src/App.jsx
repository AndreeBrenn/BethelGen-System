import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import SuperUser from "./pages/SuperUser";
import Login from "./pages/Login";
import PublicRoute from "./routes/PublicRoute";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import { useAuth } from "./zustand/Auth";
import { useEffect } from "react";

function App() {
  const { refreshToken } = useAuth();

  useEffect(() => {
    refreshToken();
  }, []);
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/7039" element={<SuperUser />} />
        <Route exact path="/login" element={<Login />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
