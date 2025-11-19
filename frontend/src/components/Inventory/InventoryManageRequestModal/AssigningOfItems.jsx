import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";
import usePrivateAxios from "../../../hooks/useProtectedAxios";
import LottieAnimation from "../../../utils/LottieAnimation";

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
  setItemState,
}) => {
  const [loading, setLoading] = useState(false);
  const axiosPrivate = usePrivateAxios();
  const fetchedPositionsRef = useRef(new Map()); // Track what's been fetched
  useEffect(() => {
    const get_item = async () => {
      const promises = itemData.Item_value.map((data, index) => {
        return get_item_filtered(
          data.Item_category,
          data.Item_subcategory,
          data.Item_classification,
          index
        );
      });

      const temp = await Promise.all(promises);
      const NameOfItems = temp.flat();

      const newItemState = itemData.Item_value.map((data, index) => {
        const data_ID = NameOfItems.find(
          (fil) => fil.Item_name === data.Item_name
        );

        return {
          policy_code: data_ID?.policy_code,
          position: index,
          item_ID: data_ID.ID,
          method: 1,
          itemName: data_ID.Item_name,
          quantity: data.Item_quantity,
          Item_document_category: data?.Item_document_category,
        };
      });

      // Set state once with all items
      setItemState(newItemState);
    };
    get_item();
  }, []);

  // This will run every time itemState changes
  useEffect(() => {
    const get_serial = async () => {
      // Check if item needs fetching by comparing position + item_ID
      const itemsToFetch = itemState.filter((item) => {
        if (item.method !== 3) return false;

        const cached = fetchedPositionsRef.current.get(item.position);
        // Fetch if not cached OR if item_ID changed
        return !cached || cached !== item.item_ID;
      });

      if (itemsToFetch.length === 0) return;
      setLoading(true);

      try {
        const promises = itemsToFetch.map((item) => {
          // Mark with position + item_ID
          fetchedPositionsRef.current.set(item.position, item.item_ID);

          return axiosPrivate
            .get("/inventory/get-serial-automatic", {
              params: {
                Item_ID: item.item_ID,
                limit: item.quantity,
                Item_document_category: item.Item_document_category,
              },
            })
            .then((res) => ({
              position: item.position,
              serials: res.data.map((data) => data.Item_serial),
            }));
        });

        const results = await Promise.all(promises);
        console.log("Fetched serials:", results);

        setItemState((prev) =>
          prev.map((item) => {
            const result = results.find((r) => r.position === item.position);
            if (result) {
              return {
                ...item,
                serials: result.serials,
              };
            }
            return item;
          })
        );
      } catch (error) {
        console.error("Error fetching serials:", error);
        // Remove failed items from ref so they can be retried
        itemsToFetch.forEach((item) => {
          fetchedPositionsRef.current.delete(item.position);
        });
      } finally {
        setLoading(false); // Move setLoading here
      }
    };

    if (itemState && itemState.length > 0) {
      get_serial();
    }
  }, [itemState, axiosPrivate]);
  return (
    <>
      {loading && (
        <div className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl flex items-center justify-center flex-col p-6 max-w-sm mx-4 text-center">
            <LottieAnimation
              animationPath="/lottie/Searching.json"
              loop={true}
              style={{ width: 300, height: 300 }}
            />
            <h3 className="text-lg font-semibold text-gray-800 ">
              Finding Serial Numbers
            </h3>
            <p className="text-sm text-gray-600">
              This may take a moment for large quantities. Please wait...
            </p>
          </div>
        </div>
      )}
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
                    Item Request
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
                    Item Property
                  </label>
                  <select
                    disabled={itemData.Item_value.some(
                      (som) => som.Item_subcategory == "Documents"
                    )}
                    onChange={(e) =>
                      handleChangeDropDown(
                        index,
                        e.target.value,
                        e.target.selectedOptions[0].dataset.itemname,
                        data.Item_quantity,
                        data.Item_document_category
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
                      itemState.filter((fil) => fil.position == index)[0]
                        ?.item_ID
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Item
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
                <input
                  onChange={(e) => handleChangeRadio(index, 3)}
                  checked={
                    itemState.filter(
                      (fil) => fil.method == 3 && fil.position == index
                    ).length != 0
                  }
                  disabled={
                    itemState.filter((fil) => fil.position == index).length == 0
                  }
                  type="radio"
                />{" "}
                <span className="text-sm font-medium text-gray-700 mx-2">
                  Automatic Serial Finder
                </span>
              </div>

              {/* TEXT AREA MANUAL ENCODING */}
              {itemState.filter(
                (fil) => fil.position == index && fil.method == 1
              ).length != 0 && (
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

              {itemState.filter(
                (fil) => fil.position == index && fil.method == 2
              ).length != 0 && (
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
              {itemState.filter(
                (fil) => fil.position == index && fil.method == 3
              ).length != 0 && (
                <div className="overflow-x-auto max-h-[12rem] overflow-y-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Serial Number
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(() => {
                        const currentItem = itemState.find(
                          (fil) => fil.position === index
                        );
                        const serials = currentItem?.serials || [];

                        if (serials.length === 0) {
                          return (
                            <tr>
                              <td
                                colSpan={2}
                                className="px-4 py-8 text-center text-red-600 bg-red-50"
                              >
                                No available serial numbers
                              </td>
                            </tr>
                          );
                        }

                        return serials.map((data, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {idx + 1}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-gray-700">
                              <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                                {data}
                              </code>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
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
    </>
  );
};

export default AssigningOfItems;
