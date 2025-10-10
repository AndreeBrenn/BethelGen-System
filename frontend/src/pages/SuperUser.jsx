import React from "react";
import { useState, useEffect } from "react";
import { FaShieldAlt, FaUser, FaEnvelope, FaLock, FaKey } from "react-icons/fa";
import axios from "axios";
import { handleApiError } from "../utils/HandleError";
import { useNavigate } from "react-router-dom";

const SuperUser = () => {
  const [inputFields, setInputFields] = useState({
    LastName: "Administrator",
    FirstName: "admin",
    Username: "",
    Password: "",
    Email: "",
    Role: 0,
    Access: ["Settings", "Admin Settings"],
    Department: "IT",
    ConfirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const detect_superUser = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_AXIOS_URL + "/users/detect-superuser"
        );

        if (res.data.count == 1) {
          navigate("/login");
        }

        return;
      } catch (error) {
        handleApiError(error);
      }
    };

    detect_superUser();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const create_superuser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (inputFields.Password !== inputFields.ConfirmPassword) {
        alert("Password doesn't match!");
        return;
      }

      const res = await axios.post(
        import.meta.env.VITE_AXIOS_URL + "/users/create-super-user",
        inputFields
      );

      console.log(res.data);
      alert("Superuser created!");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Card */}
        <div className="bg-white rounded-t-2xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <FaShieldAlt className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">
            SuperUser Registration
          </h1>
          <p className="text-center text-slate-600 text-sm">
            Create the first administrator account for your system
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-b-2xl p-8 shadow-2xl">
          <form onSubmit={create_superuser} className="space-y-5">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  required
                  type="text"
                  onChange={(e) =>
                    setInputFields({ ...inputFields, Username: e.target.value })
                  }
                  value={inputFields.Username}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter username"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  required
                  type="email"
                  onChange={(e) =>
                    setInputFields({ ...inputFields, Email: e.target.value })
                  }
                  value={inputFields.Email}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  required
                  type="password"
                  onChange={(e) =>
                    setInputFields({ ...inputFields, Password: e.target.value })
                  }
                  value={inputFields.Password}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter secure password"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaKey className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  required
                  type="password"
                  onChange={(e) =>
                    setInputFields({
                      ...inputFields,
                      ConfirmPassword: e.target.value,
                    })
                  }
                  value={inputFields.ConfirmPassword}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <FaShieldAlt className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Administrator Privileges</p>
                  <p className="text-blue-700">
                    This account will have full system access and administrative
                    rights.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              Create SuperUser Account
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-slate-300 text-sm">
            Secure your system with a strong password
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperUser;
