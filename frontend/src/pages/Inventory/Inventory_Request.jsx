import { useCallback, useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { FaSearch, FaEye, FaTrash } from "react-icons/fa";
import DeleteConfirmationModal from "../../modals/reuseable/DeleteConfirmationModal";
import InventoryAddRequestModal from "../../modals/InventoryModal/InventoryAddRequestModal";
import usePrivateAxios from "../../hooks/useProtectedAxios";
import { decodedUser } from "../../utils/GlobalVariables";
import { handleApiError } from "../../utils/HandleError";
import moment from "moment";
import React_Paginate from "../../utils/React_Paginate";
import ViewRequestModal from "../../modals/InventoryModal/ViewRequestModal";

const Item_Request = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showAddRequest, setShowAddRequest] = useState(false);

  const [viewRequestModal, setViewRequestModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemPerPage] = useState(5);
  const [itemOffset, setItemOffset] = useState(0);
  const [count, setCount] = useState(0);

  const [searchText, setSearchText] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const axiosPrivate = usePrivateAxios();
  const user = decodedUser();

  // Sample data - replace with actual data

  const [itemRequests, setItemRequest] = useState([]);

  const handleView = (item) => {
    // Add your view logic here
    console.log("View item:", item);
    alert(`Viewing request: ${item.request_number}`);
  };

  const handleDelete = (item) => {
    // Add your delete logic here
    console.log("Delete item:", item);
    setShowDeleteModal(null);
  };

  const get_personal_request = useCallback(async () => {
    try {
      const res = await axiosPrivate.get("/inventory/get-personal-request", {
        params: {
          ID: user.ID,
          offset: itemOffset,
          limit: itemsPerPage,
          search: appliedSearch,
        },
      });

      setItemRequest(res.data.rows);
      setCount(res.data.count);
    } catch (error) {
      handleApiError(error);
    }
  }, [itemsPerPage, itemOffset, appliedSearch]);

  useEffect(() => {
    get_personal_request();
  }, [get_personal_request]);

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedSearch(searchText);
    setItemOffset(0);
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Item Requests
              </h1>
              <p className="text-gray-600 mt-1">
                View and manage all item requests
              </p>
            </div>
            <button
              onClick={() => setShowAddRequest(!showAddRequest)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="text-xl">+</span>
              Add Request
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="bg-white border border-slate-200 rounded-lg p-4 mb-4 shadow-sm"
        >
          <div className="relative flex">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by request number, item name, or requester"
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700 transition-colors"
            >
              <FaSearch />
            </button>

            <button
              type="button"
              onClick={() => {
                setAppliedSearch("");
                setSearchText("");
                get_personal_request();
              }}
              className="bg-red-600 text-white px-3 rounded-lg ml-3 cursor-pointer hover:bg-red-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </form>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {itemRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">📋</div>
              <p className="text-gray-500">No item requests found.</p>
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
                  {itemRequests.map((item) => (
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
                        {moment(item.createdAt).format("MM/DD/YYYY - hh:mm A")}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                          {item.Item_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setViewRequestModal(item)}
                            className="text-blue-600 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition-colors"
                            title="View"
                          >
                            <FaEye className="text-lg" />
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

      {viewRequestModal && (
        <ViewRequestModal
          requestData={viewRequestModal}
          setViewRequestModal={setViewRequestModal}
        />
      )}

      {showAddRequest && (
        <InventoryAddRequestModal
          setShowAddRequest={setShowAddRequest}
          trigger={get_personal_request}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(null)}
          onConfirm={async () => {
            try {
              await axiosPrivate.delete(
                `/inventory/delete-personal-request/${showDeleteModal}`
              );

              alert("Data Deleted");
              get_personal_request();
              setShowDeleteModal(null);
            } catch (error) {
              handleApiError(error);
            }
          }}
        />
      )}
    </div>
  );
};

export default Item_Request;
