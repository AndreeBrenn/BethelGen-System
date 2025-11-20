import React, { useCallback, useState } from "react";
import { MdAdd, MdDelete, MdEdit, MdPeople, MdSearch } from "react-icons/md";
import { BsBuildingsFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import AddBranchModal from "../../modals/SettingsModal/AddBranchModal";
import usePrivateAxios from "../../hooks/useProtectedAxios";
import { handleApiError, toastObjects } from "../../utils/HandleError";
import { useEffect } from "react";
import React_Paginate from "../../utils/React_Paginate";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import EditBranchModal from "../../modals/SettingsModal/EditBranchModal";
import DeleteConfirmationModal from "../../modals/reuseable/DeleteConfirmationModal";
import { toast } from "react-toastify";

const BranchSettings = () => {
  const [branchData, setBranchData] = useState([]);
  const [branchModal, setBranchModal] = useState(false);
  const [branchEditModal, setBranchEditModal] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  //SEARCH STATES
  const [searchTerm, setSearchTerm] = useState(null);
  const [appliedSearch, setAppliedSearch] = useState("");

  const axiosPrivate = usePrivateAxios();

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemPerPage] = useState(5);
  const [itemOffset, setItemOffset] = useState(0);
  const [count, setCount] = useState(0);

  const get_all_branch = useCallback(async () => {
    try {
      const res = await axiosPrivate.get("/branch/get-branch", {
        params: {
          search: appliedSearch,
          offset: itemOffset,
          itemsPerPage,
        },
      });

      setBranchData(res.data.rows);
      setCount(res.data.count);
    } catch (error) {
      handleApiError(error);
    }
  }, [appliedSearch, itemOffset, itemsPerPage]);

  useEffect(() => {
    get_all_branch();
  }, [get_all_branch]);

  //SEARCH FUNCTION

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedSearch(searchTerm);
    setItemOffset(0);
    setCurrentPage(0);
  };
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <BsBuildingsFill className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Branches</h1>
              <p className="text-slate-500 mt-1">Add or Delete a Branch</p>
            </div>
          </div>
          <button
            onClick={() => setBranchModal(!branchModal)}
            className="flex items-center space-x-2 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors shadow-md font-medium"
          >
            <MdAdd className="text-xl" />
            <span>Create Branch</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 shadow-sm">
        <form onSubmit={handleSearch} className="relative flex">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
          <input
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            placeholder="Search by name, email, or department..."
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

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  ID branch
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Branch Name
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {branchData.map((data) => (
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{data.ID}</span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">
                      {data.Branch_name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => setBranchEditModal(data)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <MdEdit className="text-lg cursor-pointer" />
                      </button>
                      <button
                        onClick={() => setDeleteItem(data.ID)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <MdDelete className="text-lg text-red-600 cursor-pointer" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
      {branchModal && (
        <AddBranchModal
          setBranchModal={setBranchModal}
          trigger={get_all_branch}
        />
      )}
      {branchEditModal && (
        <EditBranchModal
          trigger={get_all_branch}
          branchData={branchEditModal}
          setBranchEditModal={setBranchEditModal}
        />
      )}

      <DeleteConfirmationModal
        isOpen={deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={async (e) => {
          e.preventDefault();

          try {
            const res = await axiosPrivate.delete(
              `/branch/delete-branch/${deleteItem}`
            );

            get_all_branch();
            toast.success("Branch deleted", toastObjects);
            setDeleteItem(null);
          } catch (error) {
            handleApiError(error);
          }
        }}
      />
    </div>
  );
};

export default BranchSettings;
