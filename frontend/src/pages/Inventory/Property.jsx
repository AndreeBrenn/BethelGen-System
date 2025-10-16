import InventoryAddModal from "../../modals/InventoryModal/InventoryAddModal";
import { useState } from "react";
import DeleteConfirmationModal from "../../modals/reuseable/DeleteConfirmationModal";

export default function Property() {
  const [activeTab, setActiveTab] = useState("all-assets");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [assets, setAssets] = useState([
    {
      id: 1,
      itemName: "Dell Laptop XPS 15",
      category: "Electronics",
      subCategory: "Computers",
      classification: "Fixed Asset",
      serialNumber: "DL2024-001",
      quantity: 5,
      branch: "Main Office",
      dateAdded: "2024-01-15",
    },
    {
      id: 2,
      itemName: "Office Chair Ergonomic",
      category: "Furniture",
      subCategory: "Seating",
      classification: "Fixed Asset",
      serialNumber: "OC2024-045",
      quantity: 20,
      branch: "Branch A",
      dateAdded: "2024-02-20",
    },
    {
      id: 3,
      itemName: "Printer HP LaserJet",
      category: "Electronics",
      subCategory: "Printing",
      classification: "Fixed Asset",
      serialNumber: "HP2024-012",
      quantity: 3,
      branch: "Main Office",
      dateAdded: "2024-03-10",
    },
  ]);

  const [documents, setDocuments] = useState([
    {
      id: 1,
      itemName: "Property Insurance Policy",
      category: "Documents",
      subCategory: "Insurance",
      classification: "Returnable",
      serialNumber: "INS-2024-001",
      quantity: 1,
      branch: "Main Office",
      dateAdded: "2024-01-05",
    },
    {
      id: 2,
      itemName: "Equipment Purchase Agreement",
      category: "Documents",
      subCategory: "Contracts",
      classification: "Returnable",
      serialNumber: "EPA-2024-023",
      quantity: 1,
      branch: "Main Office",
      dateAdded: "2024-02-15",
    },
  ]);

  const currentData = activeTab === "all-assets" ? assets : documents;
  const setCurrentData = activeTab === "all-assets" ? setAssets : setDocuments;

  const filteredData = currentData.filter((item) =>
    Object.values(item).some((val) =>
      val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddItem = (newItem) => {
    const item = {
      id: currentData.length + 1,
      ...newItem,
    };
    setCurrentData([...currentData, item]);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setCurrentData(currentData.filter((item) => item.id !== selectedItem.id));
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

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
                      Serial Number
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
                  {filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.itemName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.subCategory}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            item.classification === "Fixed Asset"
                              ? "bg-blue-100 text-blue-800"
                              : item.classification === "Consumable"
                              ? "bg-green-100 text-green-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {item.classification}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                        {item.serialNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.branch}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.dateAdded}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            className="text-gray-600 hover:text-gray-700 p-2 rounded hover:bg-gray-100"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50"
                            title="Delete"
                          >
                            🗑️
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

      {/* Modals */}
      <InventoryAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
