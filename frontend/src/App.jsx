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
import Settings from "./pages/SettingsPages/Settings";
import AdminSettings from "./pages/SettingsPages/AdminSettings";
import SettingsLayout from "./layout/SettingsLayout";
import Inventory from "./pages/Inventory/Inventory";
import Property from "./pages/Inventory/Property";
import InventoryLayout from "./layout/InventoryLayout";
import Attributes from "./pages/Inventory/Attributes";
import Inventory_Request from "./pages/Inventory/Inventory_Request";
import Procurement from "./pages/Inventory/Procurement";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    <>
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

        <Route element={<PrivateRoute route={"Inventory"} />}>
          <Route path="/Inventory" element={<InventoryLayout />}>
            <Route index element={<Inventory />} />
            <Route element={<PrivateRoute route={"Property"} />}>
              <Route path="Property" element={<Property />} />
            </Route>
            <Route element={<PrivateRoute route={"InventoryAttributes"} />}>
              <Route path="Attributes" element={<Attributes />} />
            </Route>
            <Route element={<PrivateRoute route={"InventoryRequest"} />}>
              <Route path="Request" element={<Inventory_Request />} />
            </Route>
            <Route element={<PrivateRoute route={"Procurement"} />}>
              <Route path="Procurement" element={<Procurement />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<MissingPage />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
