import React, { useCallback, useEffect, useState } from "react";
import { FaSearch, FaTrash, FaCog } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import { handleApiError } from "../../utils/HandleError";
import usePrivateAxios from "../../hooks/useProtectedAxios";
import React_Paginate from "../../utils/React_Paginate";
import InventoryManageRequestModal from "../../modals/InventoryModal/InventoryManageRequestModal";

const Procurement = () => {
  const [searchText, setSearchText] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [showManageModal, setShowManageModal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  // Sample data
  const [inventoryRequests, setInventoryRequest] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemPerPage] = useState(5);
  const [itemOffset, setItemOffset] = useState(0);
  const [count, setCount] = useState(0);

  const axiosPrivate = usePrivateAxios();

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedSearch(searchText);
  };

  const handleClearSearch = () => {
    setAppliedSearch("");
    setSearchText("");
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Done":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const get_all_request = useCallback(async () => {
    try {
      const res = await axiosPrivate.get("/inventory/get-all-request", {
        params: {
          search: appliedSearch,
          limit: itemsPerPage,
          offset: itemOffset,
        },
      });

      setCount(res.data.count);
      setInventoryRequest(res.data.rows);
    } catch (error) {
      handleApiError(error);
    }
  }, [appliedSearch, itemOffset, itemsPerPage]);

  useEffect(() => {
    get_all_request();
  }, [get_all_request]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Procurement</h1>
              <p className="text-gray-600 mt-1">
                View and manage all inventory requests
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 shadow-sm">
          <div className="relative flex">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
              placeholder="Search by request number, item name, or requester"
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700 transition-colors"
            >
              <FaSearch />
            </button>

            <button
              onClick={handleClearSearch}
              className="bg-red-600 text-white px-3 rounded-lg ml-3 cursor-pointer hover:bg-red-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {inventoryRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">📋</div>
              <p className="text-gray-500">No inventory requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request #
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requester
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventoryRequests.map((item) => (
                    <tr
                      key={item.ID}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.ID}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.Item_userID.FirstName +
                          " " +
                          item.Item_userID.LastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.Item_userID.Department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            item.Item_status
                          )}`}
                        >
                          {item.Item_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setShowManageModal(item)}
                            className="text-blue-600 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition-colors"
                            title="Manage"
                          >
                            <FaCog className="text-lg" />
                          </button>
                          <button
                            onClick={() => setShowDeleteModal(item.ID)}
                            className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <FaTrash className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <React_Paginate
        itemsPerPage={itemsPerPage}
        count={count}
        setItemOffset={setItemOffset}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {showManageModal && (
        <InventoryManageRequestModal
          requestData={showManageModal}
          onClose={() => setShowManageModal(null)}
        />
      )}
    </div>
  );
};

export default Procurement;
