import React, { useCallback, useEffect, useState } from "react";
import { decodedUser } from "../../utils/GlobalVariables";
import usePrivateAxios from "../../hooks/useProtectedAxios";
import { handleApiError } from "../../utils/HandleError";
import { MdDelete } from "react-icons/md";

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
  const [dropDownDocuments, setDropDownDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState("assets");

  const [requestArray, setRequestArray] = useState([]);

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

  const get_documents = useCallback(async () => {
    try {
      const res = await axiosPrivate.get("/inventory/get-documents", {
        params: {
          classification: inputFields.Item_classification,
        },
      });

      setDropDownDocuments(res.data);
    } catch (error) {
      handleApiError;
    }
  }, [inputFields.Item_classification]);

  useEffect(() => {
    get_documents();
  }, [get_documents]);

  const submit_request = async (e) => {
    e.preventDefault();

    try {
      if (requestArray.length == 0) {
        alert("there's no item detected");
        return;
      }

      const submittedData = {
        Item_value: requestArray,
        Item_description: inputFields.Item_description,
        Item_branch: user.Branch,
        USER_ID: user.ID,
        Item_status: "Pending",
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
      setRequestArray([]);
    } catch (error) {
      handleApiError(error);
    }
  };

  const click_documents = (e) => {
    e.preventDefault();

    setActiveTab("documents");
    const documentCategory = dropDownData?.filter(
      (fil) => fil.Category_name == "Fixed Assets"
    )[0];

    const document_subcategory = dropDownData
      ?.filter((fil) => fil.ID == documentCategory.ID)[0]
      ?.inv_subcat?.filter((fil) => fil.Subcategory_name == "Documents")[0];

    setInputFields({
      ...inputFields,
      Item_category: {
        ID: documentCategory.ID,
        name: documentCategory.Category_name,
      },
      Item_subcategory: {
        ID: document_subcategory.ID,
        name: document_subcategory.Subcategory_name,
      },
    });
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

        <div className="w-full">
          {/* Tab Buttons */}
          <div className="flex gap-2 px-6 mt-4">
            <button
              type="button"
              onClick={() => setActiveTab("assets")}
              className={`px-4 py-2 rounded-md font-medium transition-all cursor-pointer ${
                activeTab === "assets"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Assets
            </button>
            <button
              type="button"
              onClick={(e) => click_documents(e)}
              className={`px-4 py-2 rounded-md font-medium transition-all cursor-pointer ${
                activeTab === "documents"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Documents
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTab == "assets" && (
              <>
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
                      .filter(
                        (fil) => fil.ID == inputFields.Item_category.ID
                      )[0]
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
              </>
            )}

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
          <div className="md:col-span-2 my-2">
            {activeTab == "documents" ? (
              <>
                {" "}
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <select
                  onChange={(e) =>
                    setInputFields({
                      ...inputFields,
                      Item_name: e.target.value,
                    })
                  }
                  value={inputFields.Item_name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter item name"
                >
                  <option value="">Select an Item</option>
                  {dropDownDocuments.map((data) => (
                    <>
                      <option value={data.Item_name}>{data.Item_name}</option>
                    </>
                  ))}
                </select>
              </>
            ) : (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  onChange={(e) =>
                    setInputFields({
                      ...inputFields,
                      Item_name: e.target.value,
                    })
                  }
                  value={inputFields.Item_name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter item name"
                />
              </>
            )}
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
              className="w-full px-3 mb-4  py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Quantity / Amount"
            />

            <button
              onClick={() => {
                setRequestArray((prev) => [
                  ...prev,
                  {
                    Item_name: inputFields.Item_name,
                    Item_category: inputFields.Item_category.name,
                    Item_subcategory: inputFields.Item_subcategory.name,
                    Item_classification: inputFields.Item_classification,
                    Item_quantity: inputFields.Item_quantity,
                  },
                ]);

                setInputFields({
                  Item_name: "",
                  Item_category: { ID: "", name: "" },
                  Item_subcategory: { ID: "", name: "" },
                  Item_classification: "",
                  Item_description: "",
                  Item_quantity: 0,
                  Item_status: "Pending",
                });
              }}
              type="button"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Add Item to Request
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Requested Items
            </h3>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
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
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requestArray.map((item) => (
                    <tr className="hover:bg-gray-50">
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
                      <td className="px-4 py-3 text-sm">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            const newArray = requestArray.filter(
                              (fil) => fil.Item_name != item.Item_name
                            );
                            setRequestArray(newArray);
                          }}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Remove item"
                        >
                          <MdDelete className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              File Request ({requestArray.length})
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InventoryAddRequestModal;
