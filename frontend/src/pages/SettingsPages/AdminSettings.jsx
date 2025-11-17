import React, { useCallback, useEffect, useState } from "react";
import { MdPeople, MdEdit, MdDelete, MdAdd, MdSearch } from "react-icons/md";
import { FaUserShield, FaUserTie, FaUser, FaSearch } from "react-icons/fa";
import CreateUserModal from "../../modals/SettingsModal/CreateUserModal";
import usePrivateAxios from "../../hooks/useProtectedAxios";
import { handleApiError } from "../../utils/HandleError";
import moment from "moment";
import EditUserModal from "../../modals/SettingsModal/EditUserModal";
import React_Paginate from "../../utils/React_Paginate";

const AdminSettings = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const axiosPrivate = usePrivateAxios();
  const [users, setUsers] = useState([]);
  const [appliedSearch, setAppliedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemPerPage] = useState(5);
  const [itemOffset, setItemOffset] = useState(0);
  const [count, setCount] = useState(0);

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axiosPrivate.get(`/users/get-users`, {
        params: {
          search: appliedSearch,
          itemsPerPage,
          offset: itemOffset,
        },
      });

      setUsers(res.data.rows);
      setCount(res.data.count);
    } catch (error) {
      handleApiError(error);
    }
  }, [itemOffset, itemsPerPage, appliedSearch]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedSearch(searchTerm);
    setItemOffset(0);
    setCurrentPage(0);
  };

  const getRoleIcon = (role) => {
    if (role === "Administrator")
      return <FaUserShield className="text-red-500" />;
    if (role === "HR Manager") return <FaUserTie className="text-blue-500" />;
    return <FaUser className="text-slate-500" />;
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <MdPeople className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                User Management
              </h1>
              <p className="text-slate-500 mt-1">
                Manage user accounts and permissions
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors shadow-md font-medium"
          >
            <MdAdd className="text-xl" />
            <span>Create User</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">
            Total Users
          </div>
          <div className="text-2xl font-bold text-slate-800">{count}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">
            Active Users
          </div>
          <div className="text-2xl font-bold text-green-600">
            {users.filter((u) => u.status === "Active").length}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">
            Administrators
          </div>
          <div className="text-2xl font-bold text-red-600">
            {users.filter((u) => u.role === "Administrator").length}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">
            Departments
          </div>
          <div className="text-2xl font-bold text-slate-800">8</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 shadow-sm">
        <form onSubmit={handleSearch} className="relative flex">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
          <input
            type="text"
            placeholder="Search by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-r-lg"
          >
            <FaSearch />
          </button>

          <button
            type="button"
            onClick={() => {
              setAppliedSearch("");
              setSearchTerm("");
            }}
            className="bg-red-600 text-white px-3 rounded-lg ml-3 cursor-pointer"
          >
            Clear
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Department
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Date Created
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => {
                const FullName = user.LastName + " " + user.FirstName;
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {FullName.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">
                            {FullName}
                          </div>
                          <div className="text-sm text-slate-500">
                            {user.Email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(user.Role)}
                        <span className="text-sm font-medium text-slate-700">
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {user.Department}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {moment(user.createdAt).format("MMM-DD-YYYY")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <MdEdit
                            onClick={() => setShowEditModal(user)}
                            className="text-lg cursor-pointer"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <React_Paginate
        itemsPerPage={itemsPerPage}
        count={count}
        setItemOffset={setItemOffset}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          setShowCreateModal={setShowCreateModal}
          setUsers={setUsers}
        />
      )}
      {/* Edit User Modal */}
      {showEditModal && (
        <EditUserModal
          setShowEditModal={setShowEditModal}
          showEditModal={showEditModal}
          setUsers={setUsers}
        />
      )}
    </div>
  );
};

export default AdminSettings;
