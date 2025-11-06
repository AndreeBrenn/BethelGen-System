import React from "react";
import { FaBoxOpen } from "react-icons/fa";

const AssigningOfItems = ({
  itemData,
  handleChangeDropDown,
  get_item_filtered,
  itemState,
  dropDownAssign,
  countQuantity,
  handleChangeSerial,
  handleChangeTextArea,
  handleChangeRadio,
  errors,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FaBoxOpen className="text-blue-600" />
        Assign Items
      </h3>
      <div className="space-y-3">
        {itemData.Item_value?.map((data, index) => (
          <>
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
            >
              {/* ASSIGNING OF ITEM */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={data.Item_name}
                  disabled
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Item ID Selector */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign to Item ID
                </label>
                <select
                  onChange={(e) =>
                    handleChangeDropDown(
                      index,
                      e.target.value,
                      e.target.selectedOptions[0].dataset.itemname
                    )
                  }
                  onClick={() =>
                    get_item_filtered(
                      data.Item_category,
                      data.Item_subcategory,
                      data.Item_classification,
                      index
                    )
                  }
                  value={
                    itemState.filter((fil) => fil.position == index)[0]?.item_ID
                  }
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Item ID
                  </option>

                  {(dropDownAssign[index] || []).map((item) => (
                    <option
                      key={item.ID}
                      value={item.ID}
                      data-itemname={item.Item_name}
                    >
                      {item.Item_name}
                    </option>
                  ))}

                  {/* Add your actual item IDs here */}
                </select>
              </div>
            </div>
            <div className="flex">
              <input
                onChange={(e) => handleChangeRadio(index, 1)}
                checked={
                  itemState.filter(
                    (fil) => fil.method == 1 && fil.position == index
                  ).length != 0
                }
                disabled={
                  itemState.filter((fil) => fil.position == index).length == 0
                }
                type="radio"
              />{" "}
              <span className="text-sm font-medium text-gray-700 mx-2">
                Manual Encoding
              </span>
              <input
                onChange={(e) => handleChangeRadio(index, 2)}
                checked={
                  itemState.filter(
                    (fil) => fil.method == 2 && fil.position == index
                  ).length != 0
                }
                disabled={
                  itemState.filter((fil) => fil.position == index).length == 0
                }
                type="radio"
              />{" "}
              <span className="text-sm font-medium text-gray-700 mx-2">
                Serial range
              </span>
            </div>

            {/* TEXT AREA MANUAL ENCODING */}
            {itemState.filter((fil) => fil.position == index && fil.method == 1)
              .length != 0 && (
              <textarea
                onChange={(e) => handleChangeTextArea(index, e.target.value)}
                value={
                  itemState.filter(
                    (fil) => fil.position == index && fil.method == 1
                  )[0]?.inputText
                }
                className="w-full border border-gray-300 rounded px-3 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                placeholder="Enter serials..."
              />
            )}

            {itemState.filter((fil) => fil.position == index && fil.method == 2)
              .length != 0 && (
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Serial Start
                  </label>
                  <input
                    onChange={(e) =>
                      handleChangeSerial(index, "start", e.target.value)
                    }
                    value={
                      itemState.filter(
                        (fil) => fil.position == index && fil.method == 2
                      )[0]?.serialStart
                    }
                    type="text"
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Serial End
                  </label>
                  <input
                    onChange={(e) =>
                      handleChangeSerial(index, "end", e.target.value)
                    }
                    value={
                      itemState.filter(
                        (fil) => fil.position == index && fil.method == 2
                      )[0]?.serialEnd
                    }
                    type="text"
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
            <div>
              {(() => {
                const result = countQuantity(index, data.Item_quantity);
                return (
                  <span
                    className={`font-medium ${
                      result.status === "exact"
                        ? "text-green-600"
                        : result.status === "insufficient"
                        ? "text-yellow-600"
                        : result.status === "excess"
                        ? "text-orange-600"
                        : "text-red-600"
                    }`}
                  >
                    {result.message}
                  </span>
                );
              })()}
            </div>
          </>
        ))}
      </div>
      {errors && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-600 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-800 mb-2">
                {errors.message}
              </h4>
              <div className="space-y-2">
                {errors.items.map((data, index) => (
                  <div
                    key={index}
                    className="bg-white border border-red-200 rounded-md p-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded">
                          Item
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {itemState.filter(
                            (fil) => fil.item_ID == data.Item_ID
                          )[0]?.itemName || "Unknown Item"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          Serial
                        </span>
                        <span className="text-sm font-mono text-gray-900">
                          {data.Item_serial}
                        </span>
                      </div>
                    </div>
                    {data.message && (
                      <p className="text-xs text-red-600 mt-2">
                        {data.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssigningOfItems;
