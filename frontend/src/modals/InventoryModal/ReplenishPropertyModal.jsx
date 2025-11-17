import { useState } from "react";
import { handleApiError } from "../../utils/HandleError";
import usePrivateAxios from "../../hooks/useProtectedAxios";

const ReplenishPropertyModal = ({ data, setReplenish, trigger }) => {
  const [radioButton, setRadioButton] = useState(1);
  const [stocksData, setStocksData] = useState({
    quantity: 0,
    serial_num: [],
  });
  const [serialRange, setSerialRange] = useState({
    start: 0,
    end: 0,
  });
  const [generatedBy, setGeneratedBy] = useState(null);
  const axiosPrivate = usePrivateAxios();

  const replenish_data = async (e) => {
    e.preventDefault();

    try {
      if (radioButton == 1) {
        if (stocksData.quantity != stocksData.serial_num.length) {
          alert("Invalid Input");
          return;
        }

        const manualInput_stocksData = stocksData.serial_num.map((item) => {
          return {
            ...item,
            Item_document_category: generatedBy,
            Item_serial:
              data.policy_code + item.Item_serial.toString().padStart(7, "0"),
          };
        });

        const res = await axiosPrivate.post(
          "/inventory/replenish-stocks",
          manualInput_stocksData
        );

        setStocksData({
          quantity: 0,
          serial_num: [],
        });
      }

      if (radioButton == 2) {
        if (
          serialRange.start > serialRange.end ||
          serialRange.start.toString().trim() == "" ||
          serialRange.end.toString().trim() == ""
        ) {
          alert("Invalid Range");
          return;
        }

        const stocksData = [
          ...Array(
            Math.max(
              0,
              parseInt(serialRange.end) - parseInt(serialRange.start) + 1
            )
          ).keys(),
        ].map((i) => ({
          Item_serial:
            data.policy_code +
            (parseInt(serialRange.start) + i).toString().padStart(7, "0"),
          Item_branch: null,
          Item_status: "Available",
          Item_ID: data.ID,
          Item_document_category: generatedBy,
        }));

        const res = await axiosPrivate.post(
          "/inventory/replenish-stocks",
          stocksData
        );

        setSerialRange({
          start: 0,
          end: 0,
        });
      }

      alert("Data submitted");
      setReplenish(null);
      trigger();
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 bg-opacity-50 backdrop-blur-sm">
      <form
        onSubmit={replenish_data}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Replenish {data.Item_name}
          </h2>
          <button
            type="button"
            onClick={() => setReplenish(null)}
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
          <div className="flex mt-0">
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
                  required
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
                  required
                  onChange={(e) =>
                    setStocksData({
                      ...stocksData,
                      serial_num: e.target.value.split(",").map((item) => {
                        return {
                          Item_serial: item,
                          Item_status: "Available",
                          Item_branch: null,
                          Item_ID: data.ID,
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
                    required
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
                    required
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
                      required
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

          {data.Item_subcategory == "Documents" && (
            <div className="my-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Generated by:
              </label>
              <select
                required
                value={generatedBy}
                onChange={(e) => setGeneratedBy(e.target.value)}
                name="classification"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option selected value="">
                  Select an option
                </option>
                <option value="INLIS">INLIS</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
          )}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setReplenish(null)}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReplenishPropertyModal;
