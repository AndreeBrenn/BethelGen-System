import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import InventorySidebar from "../components/Inventory/InventorySidebar";

const InventoryLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <InventorySidebar />
        {/* Main Content Area */}
        <main className="flex-1 ml-20 mt-16 p-6 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InventoryLayout;
