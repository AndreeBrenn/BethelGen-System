import React from "react";

const InventoryClassification = ({
  items,
  setShowModal,
  setShowDeleteModal,
}) => {
  return (
    <div className="pl-10 pb-2">
      {items.Classification?.map((part) => (
        <div
          key={part.ID}
          className="flex items-center justify-between p-2 hover:bg-gray-50 transition-colors ml-2 rounded mt-1"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">📄</span>
            <span className="text-gray-700">{part.Classification_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setShowModal({
                  purpose: "EditClassification",
                  data: { part, ...items },
                  show: true,
                  type: "update_subcategory",
                  subcategoryID: items.ID,
                })
              }
              className="text-gray-600 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
              title="Edit"
            >
              ✏️
            </button>
            <button
              className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
              title="Delete"
              onClick={(e) =>
                setShowDeleteModal({
                  e: e,
                  data: { items, part },
                  type: "classification",
                })
              }
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryClassification;
