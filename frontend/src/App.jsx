import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import SuperUser from "./pages/SuperUser";
import Login from "./pages/Login";
import PublicRoute from "./routes/PublicRoute";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./zustand/Auth";
import { useEffect } from "react";
import MissingPage from "./pages/MissingPage";
import PrivateRoute from "./routes/PrivateRoute";
import Settings from "./pages/Settings";
import AdminSettings from "./pages/AdminSettings";
import SettingsLayout from "./layout/SettingsLayout";

function App() {
  const { refreshToken, isLoading } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await refreshToken(); // Wait for refresh to complete
      setIsInitialized(true);
    };
    initialize();
  }, [refreshToken]);

  // Show loading screen until initialization is complete
  if (!isInitialized) {
    return (
      <div className="w-screen bg-white h-screen fixed top-0 left-0 z-[999]" />
    );
  }

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/7039" element={<SuperUser />} />
        <Route exact path="/login" element={<Login />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Dashboard />} />
      </Route>

      <Route element={<PrivateRoute route={"Settings"} />}>
        <Route path="/Settings" element={<SettingsLayout />}>
          <Route index element={<Settings />} />
          <Route element={<PrivateRoute route={"Admin Settings"} />}>
            <Route path="Admin" element={<AdminSettings />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<MissingPage />} />
    </Routes>
  );
}

export default App;
