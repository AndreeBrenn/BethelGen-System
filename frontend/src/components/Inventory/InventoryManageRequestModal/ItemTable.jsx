import React from "react";

const ItemTable = ({
  itemData,
  setTempAmount,
  tempAmount,
  handleAmountSave,
  setEditingIndex,
  editingIndex,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Requested Items
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subcategory
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Classification
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {itemData.Item_value.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">
                  {item.Item_category}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {item.Item_subcategory}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {item.Item_classification}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {item.Item_name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {item.Item_quantity}
                </td>

                {/* Editable Amount column */}
                <td className="px-4 py-3 text-sm text-gray-900">
                  {editingIndex === index ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={tempAmount}
                        onChange={(e) => setTempAmount(e.target.value)}
                        className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring focus:ring-blue-300"
                      />
                      <button
                        onClick={() => handleAmountSave(index)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <span
                      onClick={() => {
                        setEditingIndex(index);
                        setTempAmount(item.Item_amount || "");
                      }}
                      className="cursor-pointer text-blue-600 hover:underline"
                      title="Click to edit"
                    >
                      {item.Item_amount ?? "—"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900" colSpan={5}>
                Total:
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 font-bold">
                {(
                  itemData.Item_value.reduce(
                    (a, b) => parseFloat(a) + parseFloat(b.Item_amount),
                    0
                  ) || 0
                ).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemTable;
