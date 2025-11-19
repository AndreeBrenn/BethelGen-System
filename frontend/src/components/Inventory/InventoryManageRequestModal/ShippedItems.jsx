import React, { useCallback, useEffect, useState } from "react";
import { FaTruck } from "react-icons/fa";
import React_Paginate from "../../../utils/React_Paginate";
import { handleApiError } from "../../../utils/HandleError";
import usePrivateAxios from "../../../hooks/useProtectedAxios";

const ShippedItems = ({ itemData }) => {
  const [shippedItem, setShippedItem] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemPerPage] = useState(5);
  const [itemOffset, setItemOffset] = useState(0);
  const [count, setCount] = useState(0);

  const axiosPrivate = usePrivateAxios();

  const get_stocks_shipped = useCallback(async () => {
    try {
      const res = await axiosPrivate.get(
        "/inventory/get-stocks-for-ship-or-received",
        {
          params: {
            offset: itemOffset,
            limit: itemsPerPage,
            request_ID: itemData.ID,
          },
        }
      );

      setShippedItem(res.data.rows);
      setCount(res.data.count);
    } catch (error) {
      handleApiError(error);
    }
  }, [itemsPerPage, itemOffset]);

  useEffect(() => {
    get_stocks_shipped();
  }, [get_stocks_shipped]);

  const get_shipped_items = useCallback(async () => {
    try {
      const res = await axiosPrivate.post("/inventory/get-shipped-items", {
        ids: [...new Set(shippedItem.map((data) => data.Item_ID))],
      });

      setInventory(res.data);
    } catch (error) {
      handleApiError(error);
    }
  }, [shippedItem]);

  useEffect(() => {
    get_shipped_items();
  }, [get_shipped_items]);
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FaTruck className="text-blue-600" />
        Shipped Items
      </h3>
      <div className="overflow-x-auto max-h-[12rem] overflow-y-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serial Number
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branch
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shippedItem.map((data, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500">
                  {itemOffset + index + 1}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {inventory.filter((fil) => fil.ID == data.Item_ID)[0]
                    ?.Item_name || "Unknown item"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                    {data.Item_serial}
                  </code>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {data.Item_branch}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
        <span className="text-sm font-medium text-gray-700">
          Total Items: {count}
        </span>
      </div>
      <React_Paginate
        itemsPerPage={itemsPerPage}
        count={count}
        setItemOffset={setItemOffset}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ShippedItems;
