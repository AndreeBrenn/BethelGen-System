import React from "react";
import { FaTruck } from "react-icons/fa";

const ShippedItems = ({ itemData, inventory }) => {
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
            {itemData.Inv_request.map((data, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
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
          Total Items: {itemData.Inv_request.length}
        </span>
      </div>
    </div>
  );
};

export default ShippedItems;
