import React from "react";
import { useAuth } from "../zustand/Auth";

const Dashboard = () => {
  const { logoutUser } = useAuth();
  return (
    <div>
      <button onClick={() => logoutUser()}>Logout</button>
    </div>
  );
};

export default Dashboard;
