import React, { useEffect, useState } from "react";
import { decodedUser } from "../../utils/GlobalVariables";
import usePrivateAxios from "../../hooks/useProtectedAxios";
import { handleApiError } from "../../utils/HandleError";

const InventoryAddRequestModal = ({ setShowAddRequest, trigger }) => {
  const [inputFields, setInputFields] = useState({
    Item_name: "",
    Item_category: { ID: "", name: "" },
    Item_subcategory: { ID: "", name: "" },
    Item_classification: "",
    Item_description: "",
    Item_quantity: 0,
    Item_status: "Pending",
  });
  const [dropDownData, setDropDownData] = useState([]);

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

  const submit_request = async (e) => {
    e.preventDefault();

    try {
      const submittedData = {
        ...inputFields,
        Item_category: inputFields.Item_category.name,
        Item_subcategory: inputFields.Item_subcategory.name,
        Item_branch: user.Branch,
        USER_ID: user.ID,
      };
      const res = await axiosPrivate.post(
        "/inventory/create-request",
        submittedData
      );

      alert("Data Submitted");
      trigger();
      setShowAddRequest(null);
      setInputFields({
        Item_name: "",
        Item_category: { ID: "", name: "" },
        Item_subcategory: { ID: "", name: "" },
        Item_classification: "",
        Item_description: "",
        Item_quantity: 0,
        Item_status: "Pending",
      });
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 bg-opacity-50 backdrop-blur-sm">
      <form
        onSubmit={submit_request}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Add New Request
          </h2>
          <button
            type="button"
            onClick={() => setShowAddRequest(false)}
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

          <div className="md:col-span-2 my-3">
            <label className="block text-sm font-medium text-gray-700 my-2">
              Description / Specification<span className="text-red-500">*</span>
            </label>
            <textarea
              onChange={(e) =>
                setInputFields({
                  ...inputFields,
                  Item_description: e.target.value,
                })
              }
              required
              value={inputFields.Item_description}
              className="w-full px-3 h-[6rem] py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description"
            />
          </div>

          <div className="md:col-span-2 my-3">
            <label className="block text-sm font-medium text-gray-700 my-2">
              Quantity / Amount<span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) =>
                setInputFields({
                  ...inputFields,
                  Item_quantity: e.target.value,
                })
              }
              required
              type="number"
              value={inputFields.Item_quantity}
              className="w-full px-3  py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description"
            />
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowAddRequest(false)}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              File Request
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InventoryAddRequestModal;
