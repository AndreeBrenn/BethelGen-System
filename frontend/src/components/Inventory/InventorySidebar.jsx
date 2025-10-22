import React from "react";
import { decodedUser } from "../../utils/GlobalVariables";
import { MdInventory, MdCategory } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { IoMdPaper } from "react-icons/io";

const InventorySidebar = () => {
  const decode = decodedUser();
  const menuItems = [
    {
      title: "Property",
      icon: MdInventory,
      path: "/Inventory/Property",
      access: "Property",
    },
    {
      title: "Inventory Attributes",
      icon: MdCategory,
      path: "/Inventory/Attributes",
      access: "InventoryAttributes",
    },
    {
      title: "Inventory Request",
      icon: IoMdPaper,
      path: "Request",
      access: "InventoryRequest",
    },
  ];
  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-20 bg-white border-r border-slate-200 shadow-sm z-40">
      <nav className="p-2 space-y-2">
        {menuItems
          .filter((fil) => decode.Access.includes(fil.access))
          .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center p-3 rounded-lg transition-all group relative ${
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                <Icon className="text-2xl mb-1" />
                <span className="text-xs font-medium text-center">
                  {item.title}
                </span>
              </NavLink>
            );
          })}
      </nav>
    </div>
  );
};

export default InventorySidebar;
