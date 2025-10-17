import InventoryAddModal from "../../modals/InventoryModal/InventoryAddModal";
import { useState, useRef } from "react";
import DeleteConfirmationModal from "../../modals/reuseable/DeleteConfirmationModal";
import { useEffect } from "react";
import { handleApiError } from "../../utils/HandleError";
import usePrivateAxios from "../../hooks/useProtectedAxios";
import moment from "moment";
import { MdMoreVert, MdRemoveRedEye } from "react-icons/md";
import { FiEdit, FiTrash2, FiPackage } from "react-icons/fi";
import ViewItemPropertyModal from "../../modals/InventoryModal/ViewItemPropertyModal";
import EditPropertyModal from "../../modals/InventoryModal/EditPropertyModal";
import ReplenishPropertyModal from "../../modals/InventoryModal/ReplenishPropertyModal";

export default function Property() {
  const [activeTab, setActiveTab] = useState("all-assets");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const axiosPrivate = usePrivateAxios();

  const [assets, setAssets] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [actions, setActions] = useState(null);
  const [view, setView] = useState(null);
  const [edit, setEdit] = useState(null);
  const [replenish, setReplenish] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const menuRef = useRef(null);

  const currentData = activeTab === "all-assets" ? assets : documents;
  const setCurrentData = activeTab === "all-assets" ? setAssets : setDocuments;

  const filteredData = currentData.filter((item) =>
    Object.values(item).some((val) =>
      val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const get_items = async () => {
      try {
        const res = await axiosPrivate.get("/inventory/get-items", {
          signal: controller.signal,
        });

        setAssets(res.data);
      } catch (error) {
        handleApiError(error);
      }
    };

    get_items();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActions(null); // Close the dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setActions]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Property Inventory
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your assets and documents
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="text-xl">+</span>
              Add New Item
            </button>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab("all-assets")}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "all-assets"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                All Assets ({assets.length})
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "documents"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Documents ({documents.length})
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Items List or Empty State */}
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">📦</div>
              <p className="text-gray-500">
                {searchTerm
                  ? "No items found matching your search."
                  : "No items yet. Create your first inventory item."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sub-Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Classification
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Branch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Added
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assets.map((item) => (
                    <tr
                      key={item.ID}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.Item_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.Item_category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.Item_subcategory}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800`}
                        >
                          {item.Item_classification}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.available_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.Item_origin_branch}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {moment(item.createdAt).format("MM/DD/YYYY - hh:mm A ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="">
                          <button
                            onClick={() =>
                              setActions(item.ID == actions ? null : item.ID)
                            }
                            className="text-gray-600 hover:text-gray-700 p-2 rounded hover:bg-gray-100 transition-colors"
                            title="More actions"
                          >
                            <MdMoreVert className="text-xl" />
                          </button>

                          {item.ID == actions && (
                            <div
                              ref={menuRef}
                              className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                            >
                              <button
                                onClick={() =>
                                  setView({ ID: item.ID, name: item.Item_name })
                                }
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <MdRemoveRedEye className="text-lg text-blue-600" />
                                <span>View Details</span>
                              </button>

                              <button
                                onClick={() => setEdit(item)}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <FiEdit className="text-lg text-green-600" />
                                <span>Edit</span>
                              </button>

                              <button
                                onClick={() => setReplenish(item)}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <FiPackage className="text-lg text-purple-600" />
                                <span>Replenish Stock</span>
                              </button>

                              <div className="border-t border-gray-100 my-1"></div>

                              <button
                                onClick={() => setDeleteItem(item.ID)}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <FiTrash2 className="text-lg" />
                                <span>Delete</span>
                              </button>
                            </div>
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
      </div>

      {/* Modals */}

      {view && <ViewItemPropertyModal ID_data={view} setView={setView} />}
      {edit && <EditPropertyModal data={edit} setEdit={setEdit} />}
      {replenish && (
        <ReplenishPropertyModal data={replenish} setReplenish={setReplenish} />
      )}

      <InventoryAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <DeleteConfirmationModal
        isOpen={deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={async (e) => {
          e.preventDefault();
          try {
            const res = await axiosPrivate.delete(
              `/inventory/delete-item/${deleteItem}`
            );

            alert("Data Deleted!");
          } catch (error) {
            handleApiError(error);
          }
        }}
      />
    </div>
  );
}
