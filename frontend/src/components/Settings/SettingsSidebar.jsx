import React from "react";
import { NavLink } from "react-router-dom";
import { MdAdminPanelSettings, MdBusiness, MdSecurity } from "react-icons/md";
import { decodedUser } from "../../utils/GlobalVariables";
import { LuLibrary } from "react-icons/lu";

const SettingsSidebar = () => {
  const decode = decodedUser();
  const menuItems = [
    {
      title: "Admin",
      icon: MdAdminPanelSettings,
      path: "/Settings/admin",
      access: "Admin Settings",
    },
    {
      title: "Documents",
      icon: LuLibrary,
      path: "/Settings/Documents",
      access: "Document Settings",
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
                <span className="text-xs font-medium">{item.title}</span>
              </NavLink>
            );
          })}
      </nav>
    </div>
  );
};

export default SettingsSidebar;
