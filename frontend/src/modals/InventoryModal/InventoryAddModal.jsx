import React, { useState } from "react";
import { useEffect } from "react";
import { handleApiError } from "../../utils/HandleError";
import usePrivateAxios from "../../hooks/useProtectedAxios";
import { decodedUser } from "../../utils/GlobalVariables";

const InventoryAddModal = ({ isOpen, onClose }) => {
  const [inputFields, setInputFields] = useState({
    Item_name: "",
    Item_category: { ID: "", name: "" },
    Item_subcategory: { ID: "", name: "" },
    Item_classification: "",
  });
  const [dropDownData, setDropDownData] = useState([]);
  const [stocksData, setStocksData] = useState({
    quantity: 0,
    serial_num: [],
  });
  const [radioButton, setRadioButton] = useState(1);
  const [serialRange, setSerialRange] = useState({
    start: 0,
    end: 0,
  });

  const user = decodedUser();
  const axiosPrivate = usePrivateAxios();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const get_categories = async () => {
      try {
        const res = await axiosPrivate.get("/inventory/get-all-category", {
          signal: controller.signal,
        });

        setDropDownData(res.data);
      } catch (error) {
        handleApiError(error);
      }
    };

    get_categories();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const submit_data = async (e) => {
    e.preventDefault();

    try {
      if (radioButton == 1) {
        if (stocksData.quantity != stocksData.serial_num.length) {
          alert("Invalid Input");
          return;
        }

        const data = {
          item_name: inputFields.Item_name,
          item_category: inputFields.Item_category.name,
          item_subcategory: inputFields.Item_subcategory.name,
          item_classification: inputFields.Item_classification,
          item_origin_branch: user.Branch,
          serials: stocksData.serial_num,
        };

        const res = await axiosPrivate.post("/inventory/create-item", data);
        console.log(res);
      }

      if (radioButton == 2) {
        if (serialRange.start > serialRange.end) {
          alert("Invalid Range");
          return;
        }

        const data = {
          item_name: inputFields.Item_name,
          item_category: inputFields.Item_category.name,
          item_subcategory: inputFields.Item_subcategory.name,
          item_classification: inputFields.Item_classification,
          item_origin_branch: user.Branch,
          serials: [
            ...Array(
              Math.max(0, serialRange.end - serialRange.start + 1)
            ).keys(),
          ].map((i) => ({
            Item_serial: serialRange.start + i,
            Item_branch: null,
            Item_status: "Available",
          })),
        };

        const res = await axiosPrivate.post("/inventory/create-item", data);
      }

      alert("Data is Submitted");
    } catch (error) {
      handleApiError(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Item</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                onChange={(e) =>
                  setInputFields({ ...inputFields, Item_name: e.target.value })
                }
                required
                value={inputFields.Item_name}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter item name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                onChange={(e) =>
                  setInputFields({
                    ...inputFields,
                    Item_category: {
                      ID: e.target.selectedOptions[0].dataset.id,
                      name: e.target.selectedOptions[0].dataset.name,
                    },
                    Item_subcategory: { ID: "", name: "" },
                    Item_classification: "",
                  })
                }
                value={inputFields.Item_category.name}
                name="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option hidden defaultValue="">
                  Select a category
                </option>
                {dropDownData.map((data) => (
                  <>
                    <option
                      value={data.Category_name}
                      data-id={data.ID}
                      data-name={data.Category_name}
                    >
                      {data.Category_name}
                    </option>
                  </>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub-Category <span className="text-red-500">*</span>
              </label>
              <select
                disabled={inputFields.Item_category.ID == ""}
                onChange={(e) =>
                  setInputFields({
                    ...inputFields,
                    Item_subcategory: {
                      ID: e.target.selectedOptions[0].dataset.id,
                      name: e.target.selectedOptions[0].dataset.name,
                    },
                    Item_classification: "",
                  })
                }
                value={inputFields.Item_subcategory.name}
                name="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option hidden defaultValue="">
                  Select a Subcategory
                </option>
                {dropDownData
                  .filter((fil) => fil.ID == inputFields.Item_category.ID)[0]
                  ?.inv_subcat.map((data) => (
                    <>
                      <option
                        value={data.Subcategory_name}
                        data-id={data.ID}
                        data-name={data.Subcategory_name}
                      >
                        {data.Subcategory_name}
                      </option>
                    </>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Classification <span className="text-red-500">*</span>
              </label>
              <select
                disabled={
                  inputFields.Item_subcategory.ID == "" ||
                  inputFields.Item_category.ID == ""
                }
                onChange={(e) =>
                  setInputFields({
                    ...inputFields,
                    Item_classification: e.target.value,
                  })
                }
                value={inputFields.Item_classification}
                name="classification"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option hidden defaultValue="">
                  Select a Classification
                </option>
                {dropDownData
                  .filter((fil) => fil.ID == inputFields.Item_category.ID)[0]
                  ?.inv_subcat.filter(
                    (fil) => fil.ID == inputFields.Item_subcategory.ID
                  )[0]
                  ?.Classification.map((data) => (
                    <>
                      <option value={data.Classification_name}>
                        {data.Classification_name}
                      </option>
                    </>
                  ))}
              </select>
            </div>
          </div>
          <div className="flex mt-4">
            <input
              onChange={() => setRadioButton(1)}
              value={radioButton}
              checked={radioButton == 1}
              type="radio"
            />
            <span className="text-sm font-medium text-gray-700 mx-2">
              Manual Quantity
            </span>

            <input
              onChange={() => setRadioButton(2)}
              value={radioButton}
              checked={radioButton == 2}
              type="radio"
            />
            <span className="text-sm font-medium text-gray-700 mx-2">
              Serial Number Range
            </span>

            <input
              onChange={() => setRadioButton(3)}
              value={radioButton}
              checked={radioButton == 3}
              type="radio"
            />
            <span className="text-sm font-medium text-gray-700 mx-2">
              Upload Via Excel
            </span>
          </div>

          <div className="">
            {radioButton == 1 ? (
              <div className="flex flex-col mt-3">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </span>
                <input
                  onChange={(e) =>
                    setStocksData({ ...stocksData, quantity: e.target.value })
                  }
                  value={stocksData.quantity}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <span className="block text-sm font-medium text-gray-700 mb-1 mt-2">
                  Serial Numbers (comma separated)
                </span>
                <textarea
                  onChange={(e) =>
                    setStocksData({
                      ...stocksData,
                      serial_num: e.target.value.split(",").map((data) => {
                        return {
                          Item_serial: data,
                          Item_status: "Available",
                          Item_branch: null,
                        };
                      }),
                    })
                  }
                  placeholder="e.g., ABC-123, DEF-456, GHI-789"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : radioButton == 2 ? (
              <div className="flex mt-3">
                <div className="flex flex-col">
                  <span className="block text-sm font-medium text-gray-700 mb-1">
                    Serial Start
                  </span>
                  <input
                    type="number"
                    onChange={(e) => {
                      setSerialRange({ ...serialRange, start: e.target.value });
                    }}
                    value={serialRange.start}
                    className="w-[95%] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="block text-sm font-medium text-gray-700 mb-1">
                    Serial End
                  </span>
                  <input
                    type="number"
                    onChange={(e) => {
                      setSerialRange({ ...serialRange, end: e.target.value });
                    }}
                    value={serialRange.end}
                    className="w-[95%] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </span>
                  <input
                    value={Math.max(0, serialRange.end - serialRange.start + 1)}
                    className="w-[95%] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                  />
                </div>
              </div>
            ) : radioButton == 3 ? (
              <div>
                <div className="flex flex-col mt-3">
                  <span className="block text-sm font-medium text-gray-700 mb-1">
                    Excel File
                  </span>
                  <div class="relative">
                    <input
                      type="file"
                      id="fileInput"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                  </div>

                  <p class="mt-1 text-sm text-gray-500">
                    Supported formats: PDF, PNG, JPG (Max 10MB)
                  </p>
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={(e) => submit_data(e)}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Add Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryAddModal;
