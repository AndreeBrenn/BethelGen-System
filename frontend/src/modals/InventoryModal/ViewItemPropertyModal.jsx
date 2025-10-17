import React, { useState, useEffect } from "react";
import { handleApiError } from "../../utils/HandleError";
import usePrivateAxios from "../../hooks/useProtectedAxios";

const ViewItemPropertyModal = ({ ID_data, setView }) => {
  const [serialData, setSerialData] = useState([]);
  const axiosPrivate = usePrivateAxios();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const get_stocks = async () => {
      try {
        const res = await axiosPrivate.get("/inventory/get-stocks", {
          params: {
            Item_ID: ID_data.ID,
          },
        });

        setSerialData(res.data);
      } catch (error) {
        handleApiError(error);
      }
    };

    get_stocks();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  console.log(serialData);

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
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
                <div className="flex-1 text-right">
                  <span className="text-xs font-semibold text-gray-600 uppercase">
                    Branch
                  </span>
                </div>
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
                    <div className="flex-1 text-right text-sm text-gray-600">
                      {stock.Item_branch || "N/A"}
                    </div>
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
            Total:{" "}
            <span className="font-semibold">{serialData?.length || 0}</span>{" "}
            items
          </span>
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
