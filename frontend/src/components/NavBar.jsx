import React, { useState } from "react";
import { GiExitDoor } from "react-icons/gi";
import { RxDashboard } from "react-icons/rx";
import { MdManageAccounts } from "react-icons/md";
import { BiSolidHelpCircle } from "react-icons/bi";
import { FiChevronDown } from "react-icons/fi";
import { useAuth } from "../zustand/Auth";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { logoutUser, user } = useAuth();
  const navigate = useNavigate();

  const decoded = jwtDecode(user);

  const getInitials = (name) => {
    if (!name) return "";
    const words = name
      .trim()
      .split(" ")
      .filter((word) => word.length > 0);
    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  return (
    <div className="fixed w-full top-0 left-0 z-50 shadow-md">
      {/* Main Navbar */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">BG</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-semibold text-lg tracking-tight">
                    BETHEL GEN
                  </span>
                  <span className="text-slate-400 text-xs">
                    Insurance and Surety Corporation
                  </span>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-1">
                <button
                  onClick={() => navigate("/")}
                  className="cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-lg text-white bg-slate-700 hover:bg-slate-600 transition-colors"
                >
                  <RxDashboard className="text-lg" />
                  <span className="text-sm font-medium">Dashboard</span>
                </button>
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Help Button */}
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                <BiSolidHelpCircle className="text-xl" />
                <span className="hidden sm:inline text-sm font-medium">
                  Help
                </span>
              </button>

              {/* Settings Button */}
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                <MdManageAccounts className="text-xl" />
                <span className="hidden sm:inline text-sm font-medium">
                  Settings
                </span>
              </button>

              {/* User Menu Dropdown */}
              <div className="relative ml-2">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {getInitials(decoded.FullName)}
                    </span>
                  </div>
                  <FiChevronDown
                    className={`text-slate-300 transition-transform ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1">
                    <div className="px-4 py-3 border-b border-slate-200">
                      <p className="text-sm font-semibold text-slate-800">
                        {decoded.FullName}
                      </p>
                      <p className="text-xs text-slate-500">{decoded.Email}</p>
                    </div>
                    <button
                      onClick={() => logoutUser()}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <GiExitDoor className="text-lg text-red-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
