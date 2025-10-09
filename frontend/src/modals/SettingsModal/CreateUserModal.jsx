import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { handleApiError } from "../../utils/HandleError";
import usePrivateAxios from "../../hooks/useProtectedAxios";

const CreateUserModal = ({ setShowCreateModal }) => {
  const [inputFields, setInputFields] = useState({
    FirstName: "",
    LastName: "",
    Username: "",
    Password: "",
    Role: "",
    Department: "",
    Access: [],
  });
  const [loading, setLoading] = useState(false);
  const axiosPrivate = usePrivateAxios();

  const permissionGroups = [
    {
      name: "Settings",
      children: ["AdminSettings"],
    },
  ];

  const AddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { FirstName, LastName, ...rest } = inputFields;
    try {
      await axiosPrivate.post("/users/create-users", {
        ...rest,
        FullName: FirstName + " " + LastName,
      });

      alert("User Created");

      setInputFields({
        FirstName: "",
        LastName: "",
        Username: "",
        Password: "",
        Role: "",
        Department: "",
        Access: [],
      });
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <MdAdd className="text-xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Create New User
              </h2>
              <p className="text-sm text-slate-500">
                Add a new user to the system
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(false)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <MdClose className="text-2xl text-slate-600" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <form onSubmit={AddUser} className="space-y-5">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Juan"
                    onChange={(e) =>
                      setInputFields({
                        ...inputFields,
                        FirstName: e.target.value,
                      })
                    }
                    value={inputFields.FirstName}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    onChange={(e) =>
                      setInputFields({
                        ...inputFields,
                        LastName: e.target.value,
                      })
                    }
                    value={inputFields.LastName}
                    required
                    placeholder="Dela Cruz"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Account Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Account Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    onChange={(e) =>
                      setInputFields({
                        ...inputFields,
                        Username: e.target.value,
                      })
                    }
                    value={inputFields.Username}
                    required
                    placeholder="Username"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    onChange={(e) =>
                      setInputFields({ ...inputFields, Email: e.target.value })
                    }
                    value={inputFields.Email}
                    required
                    placeholder="juan.delacruz@bethelgen.com"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    onChange={(e) =>
                      setInputFields({
                        ...inputFields,
                        Password: e.target.value,
                      })
                    }
                    value={inputFields.Password}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Role & Department Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Role & Department
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    onChange={(e) =>
                      setInputFields({ ...inputFields, Role: e.target.value })
                    }
                    value={inputFields.Role}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option hidden selected value="">
                      Select Role
                    </option>
                    <option value="0">Administrator</option>
                    <option value="1">President</option>
                    <option value="2">Executive Vice President</option>
                    <option value="3">Vice President</option>
                    <option value="4">Department Head</option>
                    <option value="5">Rank and File</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    onChange={(e) =>
                      setInputFields({
                        ...inputFields,
                        Department: e.target.value,
                      })
                    }
                    value={inputFields.Department}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option hidden selected value="">
                      Select Department
                    </option>
                    <option value="it">IT Department</option>
                    <option value="hr">Human Resources</option>
                    <option value="underwriting">Underwriting</option>
                    <option value="claims">Claims Department</option>
                    <option value="sales">Sales & Marketing</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Permissions Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Access Permissions
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {permissionGroups.map((group, index) => (
                  <div key={index} className="bg-slate-50 p-4 rounded-lg">
                    <label className="flex items-center space-x-3 cursor-pointer mb-3">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setInputFields((prev) => {
                            let newAccess;
                            if (isChecked) {
                              newAccess = [...prev.Access, group.name];
                            } else {
                              newAccess = prev.Access.filter(
                                (name) => name !== group.name
                              );
                            }
                            return {
                              ...prev,
                              Access: newAccess,
                            };
                          });
                        }}
                        checked={inputFields.Access.some(
                          (som) => som == group.name
                        )}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-semibold text-slate-800">
                        {group.name}
                      </span>
                    </label>
                    {group.children.length > 0 && (
                      <div className="ml-7 space-y-2 pl-4 border-l-2 border-slate-300">
                        {group.children.map((child, childIndex) => (
                          <label
                            key={childIndex}
                            className="flex items-center space-x-3 cursor-pointer"
                          >
                            <input
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                setInputFields((prev) => {
                                  let newAccess;
                                  if (isChecked) {
                                    newAccess = [...prev.Access, child];
                                  } else {
                                    newAccess = prev.Access.filter(
                                      (name) => name !== child
                                    );
                                  }
                                  return {
                                    ...prev,
                                    Access: newAccess,
                                  };
                                });
                              }}
                              checked={inputFields.Access.some(
                                (som) => som == child
                              )}
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm text-slate-700">
                              {child}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium shadow-md disabled:cursor-not-allowed disabled:bg-gray-600"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
