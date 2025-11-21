import React, { useCallback, useEffect, useState } from "react";
import { FaSearch, FaTrash, FaCog } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import { handleApiError } from "../../utils/HandleError";
import usePrivateAxios from "../../hooks/useProtectedAxios";
import React_Paginate from "../../utils/React_Paginate";
import InventoryManageRequestModal from "../../modals/InventoryModal/InventoryManageRequestModal";
import InventoryPending from "../../components/Inventory/InventoryPending";
import { decodedUser } from "../../utils/GlobalVariables";
import { IoPrintSharp } from "react-icons/io5";
import { generate } from "@pdfme/generator";
import {
  text,
  multiVariableText,
  image,
  barcodes,
  line,
  rectangle,
  ellipse,
  svg,
  table,
  select,
  date,
  time,
  dateTime,
  radioGroup,
  checkbox,
} from "@pdfme/schemas";
import { getBranchName, useBranches } from "../../zustand/Branches";

const Procurement = () => {
  const [activeTab, setActiveTab] = useState("all"); // 'all' or 'pending'
  const [searchText, setSearchText] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [showManageModal, setShowManageModal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  const [inventoryRequests, setInventoryRequest] = useState([]);
  const branches = useBranches();

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemPerPage] = useState(5);
  const [itemOffset, setItemOffset] = useState(0);
  const [count, setCount] = useState(0);

  const axiosPrivate = usePrivateAxios();

  const user = decodedUser();

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedSearch(searchText);
    setCurrentPage(0);
    setItemOffset(0);
  };

  const handleClearSearch = () => {
    setAppliedSearch("");
    setSearchText("");
    setCurrentPage(0);
    setItemOffset(0);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchText("");
    setAppliedSearch("");
    setCurrentPage(0);
    setItemOffset(0);
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
      case "Received":
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
      const endpoint =
        activeTab === "pending"
          ? "/inventory/pending-for-me"
          : "/inventory/get-all-request";

      const res = await axiosPrivate.get(endpoint, {
        params: {
          search: appliedSearch,
          limit: itemsPerPage,
          offset: itemOffset,
          userId: user.ID,
        },
      });

      setCount(res.data.count || res.data.pagination?.total || 0);
      setInventoryRequest(res.data.rows || res.data.data || []);
    } catch (error) {
      handleApiError(error);
    }
  }, [activeTab, appliedSearch, itemOffset, itemsPerPage, axiosPrivate]);

  useEffect(() => {
    get_all_request();
  }, [get_all_request]);

  const generate_PDF = async (e, data) => {
    e.preventDefault();

    try {
      const res = await axiosPrivate.get("/Documents/get-single-document", {
        params: { ID: 1 },
      });

      const tableData = data.Item_value.map((item) => [
        String(item.Item_quantity),
        String(item.Item_name),
        String(item.Item_amount),
        String(parseInt(item.Item_amount) * parseInt(item.Item_quantity)),
      ]);

      const signatoriesObject = data.Item_signatories.reduce(
        (acc, signatory, index) => {
          acc[`signatory${index + 1}`] = signatory.Name;
          return acc;
        },
        {}
      );

      const inputs = [
        {
          field1: JSON.stringify(tableData),
          ...signatoriesObject,
        },
      ];

      const font = {
        Roboto: {
          data: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf",
          fallback: true,
        },
      };

      const pdf = await generate({
        template: res.data.Schema,
        inputs: inputs,
        plugins: {
          text, // ← Required for text fields (signatories)
          table, // ← Required for table field
        },
        options: {
          font: font, // ← Add fonts
        },
      });

      const blob = new Blob([pdf.buffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      handleApiError(error);
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => handleTabChange("all")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === "all"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>All Requests</span>
                {activeTab === "all" && count > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {count}
                  </span>
                )}
              </div>
              {activeTab === "all" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>

            <button
              onClick={() => handleTabChange("pending")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === "pending"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>Pending Signatories</span>
                {activeTab === "pending" && count > 0 && (
                  <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    {count}
                  </span>
                )}
              </div>
              {activeTab === "pending" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 shadow-sm">
          <div className="relative flex">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
              placeholder={
                activeTab === "pending"
                  ? "Search pending requests..."
                  : "Search by request number, item name, or requester"
              }
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

        {/* Info Banner for Pending Tab */}
        {activeTab === "pending" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <span className="text-yellow-600 text-2xl">⏳</span>
              <div>
                <h3 className="text-sm font-semibold text-yellow-800">
                  Your Turn to Sign
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  These requests are waiting for your approval. All previous
                  signatories have approved.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {inventoryRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">
                {activeTab === "pending" ? "✅" : "📋"}
              </div>
              <p className="text-gray-500 text-lg font-medium">
                {activeTab === "pending"
                  ? "No pending requests requiring your signature"
                  : "No inventory requests found"}
              </p>
              {activeTab === "pending" && (
                <p className="text-gray-400 text-sm mt-2">
                  All caught up! Check back later for new requests.
                </p>
              )}
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
                      Branch
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
                      className={`hover:bg-gray-50 transition-colors ${
                        activeTab === "pending" ? "bg-yellow-50/30" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.ID}
                        {activeTab === "pending" && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Your Turn
                          </span>
                        )}
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
                        {getBranchName(branches, item.Item_branch)}
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
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                        <div className="flex items-center justify-start gap-2">
                          <button
                            onClick={() => setShowManageModal(item)}
                            className="text-blue-600 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition-colors"
                            title="Manage"
                          >
                            <FaCog className="text-lg" />
                          </button>

                          {item.Item_status == "Received" && (
                            <button
                              onClick={(e) => generate_PDF(e, item)}
                              className="text-green-600 hover:text-green-700 p-1 rounded hover:bg-green-50 transition-colors"
                            >
                              <IoPrintSharp className="text-lg" />{" "}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {activeTab === "all" && <InventoryPending />}
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
          trigger={get_all_request}
        />
      )}
    </div>
  );
};

export default Procurement;
