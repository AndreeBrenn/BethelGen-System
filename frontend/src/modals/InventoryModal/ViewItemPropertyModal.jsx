import React, { useState, useEffect, useCallback } from "react";
import { handleApiError } from "../../utils/HandleError";
import usePrivateAxios from "../../hooks/useProtectedAxios";
import React_Paginate from "../../utils/React_Paginate";
import { MdSearch } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { getBranchName, useBranches } from "../../zustand/Branches";

const ViewItemPropertyModal = ({ ID_data, setView }) => {
  const [serialData, setSerialData] = useState([]);
  const axiosPrivate = usePrivateAxios();

  const [searchText, setSearchText] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [dropdownFilter, setDropDownFilter] = useState({
    branch: "",
    status: "",
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemPerPage] = useState(5);
  const [itemOffset, setItemOffset] = useState(0);
  const [count, setCount] = useState(0);

  const branches = useBranches();
  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedSearch(searchText);
    setItemOffset(0);
    setCurrentPage(0);
  };

  const get_stocks = useCallback(async () => {
    try {
      const res = await axiosPrivate.get("/inventory/get-stocks", {
        params: {
          Item_ID: ID_data.ID,
          search: appliedSearch,
          offset: itemOffset,
          limit: itemsPerPage,
          branch: dropdownFilter.branch,
          status: dropdownFilter.status,
        },
      });

      setSerialData(res.data.rows);
      setCount(res.data.count);
    } catch (error) {
      handleApiError(error);
    }
  }, [itemsPerPage, itemOffset, appliedSearch, dropdownFilter]);

  useEffect(() => {
    get_stocks();
  }, [get_stocks]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {ID_data.name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Inventory Stock Details
            </p>
          </div>
          <button
            onClick={() => setView(null)}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="bg-white rounded-lg p-4 mb-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative flex mb-4">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
            <input
              type="text"
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              placeholder="Search Item Serial or Branch"
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-r-lg"
            >
              <FaSearch />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                setSearchText("");
                setAppliedSearch("");
                get_stocks();
                setDropDownFilter({
                  status: "",
                  branch: "",
                });
              }}
              type="button"
              className="bg-red-600 text-white px-3 rounded-lg ml-3 cursor-pointer"
            >
              Clear
            </button>
          </form>

          {/* Filter Dropdowns */}
          <div className="flex gap-4">
            {/* Status Filter */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
                Filter by Status
              </label>
              <select
                onChange={(e) =>
                  setDropDownFilter({
                    ...dropdownFilter,
                    status: e.target.value,
                  })
                }
                value={dropdownFilter.status}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>

            {/* Branch Filter */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
                Filter by Branch
              </label>
              <select
                onChange={(e) =>
                  setDropDownFilter({
                    ...dropdownFilter,
                    branch: e.target.value,
                  })
                }
                value={dropdownFilter.branch}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch.ID} value={branch.ID}>
                    {branch.Branch_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {serialData && serialData.length > 0 ? (
            <div>
              {/* Column Headers */}
              <div className="flex justify-between items-center py-3 px-6 bg-gray-100 border-b border-gray-200">
                <div className="flex-1">
                  <span className="text-xs font-semibold text-gray-600 uppercase">
                    Serial Number
                  </span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs font-semibold text-gray-600 uppercase">
                    Branch
                  </span>
                </div>
                {ID_data.Item_subcategory == "Documents" && (
                  <div className="flex-1 text-center">
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      Generated By:
                    </span>
                  </div>
                )}
              </div>

              {/* Stock Items */}
              <div className="divide-y divide-gray-100">
                {serialData.map((stock, index) => (
                  <div
                    key={stock.ID || index}
                    className="flex justify-between items-center py-3 px-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <span className="font-mono text-sm text-gray-700">
                        {stock.Item_serial}
                      </span>
                    </div>
                    <div className="flex-1 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          stock.Item_status === "Available"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {stock.Item_status}
                      </span>
                    </div>
                    <div className="flex-1 text-center text-sm text-gray-600">
                      {getBranchName(branches, stock.Item_branch) || "N/A"}
                    </div>
                    {ID_data.Item_subcategory == "Documents" && (
                      <div className="flex-1 text-center text-sm text-gray-600">
                        {stock.Item_document_category || "Not assigned"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No stock records found
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
          <span className="text-sm text-gray-600">
            Total: <span className="font-semibold">{count || 0}</span> items
          </span>

          <React_Paginate
            itemsPerPage={itemsPerPage}
            count={count}
            setItemOffset={setItemOffset}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          <button
            onClick={() => setView(null)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewItemPropertyModal;
