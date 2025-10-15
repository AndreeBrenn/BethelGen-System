import React from "react";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

const InventorySubcategory = ({
  setToggleStates,
  toggleStates,
  setShowModal,
  items,
  setShowDeleteModal,
}) => {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors ml-2 rounded">
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={() =>
            setToggleStates((prev) => {
              if (toggleStates.subcategories.some((som) => som == items.ID)) {
                return {
                  ...prev,
                  subcategories: toggleStates.subcategories.filter(
                    (fil) => fil != items.ID
                  ),
                };
              } else {
                return {
                  ...prev,
                  subcategories: [...toggleStates.subcategories, items.ID],
                };
              }
            })
          }
          className="text-gray-600 hover:text-gray-900 text-lg"
        >
          {toggleStates.subcategories.some((som) => som == items.ID) ? (
            <MdOutlineKeyboardArrowDown />
          ) : (
            <MdOutlineKeyboardArrowRight />
          )}
        </button>
        <span className="text-xl">📁</span>
        <span className="font-medium text-gray-800">
          {items.Subcategory_name}
        </span>
        <span className="text-sm text-gray-500">
          ({items.Classification.length} Classification)
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            setShowModal({
              purpose: "AddClassification",
              type: "create_classification",
              data: items.Classification,
              subcategoryID: items.ID,
              show: true,
            })
          }
          className="text-green-600 hover:text-green-700 p-2 rounded hover:bg-green-50"
          title="Add Classification"
        >
          +
        </button>
        <button
          onClick={() =>
            setShowModal({
              purpose: "EditSubcategory",
              data: items,
              type: "update_subcategory",
              show: true,
            })
          }
          className="text-gray-600 hover:text-gray-700 p-2 rounded hover:bg-gray-100"
          title="Edit"
        >
          ✏️
        </button>
        <button
          onClick={(e) =>
            setShowDeleteModal({
              e: e,
              data: items,
              type: "subcategory",
            })
          }
          className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default InventorySubcategory;
