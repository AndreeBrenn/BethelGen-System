import axios from "axios";
import React from "react";
import { useState } from "react";
import { FaUser, FaLock, FaEye } from "react-icons/fa";
import { useAuth } from "../zustand/Auth";

const Login = () => {
  const [inputFields, setInputFields] = useState({
    Username: "",
    Password: "",
  });

  const { loginUser, loginLoading, error, errorMessage } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    loginUser(inputFields.Username, inputFields.Password);
  };

  const errorHandler = () => {
    if (error) {
      if (
        errorMessage?.response?.status === 404 &&
        errorMessage?.response?.data?.message === "User doesn't exist"
      ) {
        return errorMessage?.response?.data?.message;
      }

      if (
        errorMessage?.response?.status === 403 &&
        errorMessage?.response?.data?.message === "Credentials are invalid"
      ) {
        return errorMessage?.response?.data?.message;
      }

      return;
    }
    return;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <FaUser className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Please sign in to your account</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  onChange={(e) =>
                    setInputFields({ ...inputFields, Username: e.target.value })
                  }
                  value={inputFields.Username}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  onChange={(e) =>
                    setInputFields({ ...inputFields, Password: e.target.value })
                  }
                  value={inputFields.Password}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your password"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FaEye className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-200"
            >
              Sign In
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up
              </a>
            </p>
          </div>
          <div className="w-full text-red-600 text-center mt-4">
            <span>{errorHandler()}</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
