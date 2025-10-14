import React, { useState } from "react";
import usePrivateAxios from "../../hooks/useProtectedAxios";
import { handleApiError } from "../../utils/HandleError";

const CategoryModal = ({ showModal, setShowModal, setTrigger }) => {
  const [inputFields, setInputFields] = useState("");
  const [loading, setLoading] = useState(false);

  const axiosPrivate = usePrivateAxios();

  const create_category = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosPrivate.post("/inventory/create-category", {
        Category_name: inputFields,
      });

      setTrigger((prev) => prev + 1);
      alert("Category Created");
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const create_subcategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosPrivate.post("/inventory/create-subcategory", {
        Subcategory_name: inputFields,
        Inv_SubCat_ID: showModal.categoryID,
        Classification: [],
      });
      setTrigger((prev) => prev + 1);
      alert("Sub Category Added!");
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const create_classification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosPrivate.post("/inventory/create-classification", {
        Classification: [
          ...showModal.data,
          { ID: showModal.data.length + 1, Classification_name: inputFields },
        ],
        sub_categoryID: showModal.subcategoryID,
      });
      setTrigger((prev) => prev + 1);
      alert("Classification Added!");
      setShowModal({
        purpose: "",
        show: false,
        data: [],
        type: "",
      });
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {showModal.purpose == "create"
            ? "Add Category"
            : showModal.purpose == "AddSubcategory"
            ? "Create Subcategory"
            : showModal.purpose == "AddClassification"
            ? "Add Classification"
            : "Edit Category"}
        </h2>
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2"></label>
            <input
              onChange={(e) => setInputFields(e.target.value)}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() =>
                setShowModal({
                  purpose: "",
                  show: false,
                  data: [],
                  type: "",
                })
              }
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={(e) =>
                showModal.type == "category"
                  ? create_category(e)
                  : showModal.type == "create_subcategory"
                  ? create_subcategory(e)
                  : showModal.type == "create_classification"
                  ? create_classification(e)
                  : ""
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
