import React, { useState } from "react";
import usePrivateAxios from "../../hooks/useProtectedAxios";
import { handleApiError, toastObjects } from "../../utils/HandleError";
import uniqid from "uniqid";
import { toast } from "react-toastify";

const CategoryModal = ({ showModal, setShowModal, trigger }) => {
  const [inputFields, setInputFields] = useState(
    showModal.purpose == "EditCategory"
      ? showModal.data.Category_name
      : showModal.purpose == "EditSubcategory"
      ? showModal.data.Subcategory_name
      : showModal.purpose == "EditClassification"
      ? showModal.data.part.Classification_name
      : ""
  );

  const [loading, setLoading] = useState(false);

  const axiosPrivate = usePrivateAxios();

  const create_category = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosPrivate.post("/inventory/create-category", {
        Category_name: inputFields,
      });

      trigger();
      setShowModal({
        purpose: "",
        show: false,
        data: [],
        type: "",
      });
      toast.success("Category Added", toastObjects);
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
      trigger();
      setShowModal({
        purpose: "",
        show: false,
        data: [],
        type: "",
      });
      toast.success("Subcategory Added", toastObjects);
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
          { ID: uniqid(), Classification_name: inputFields },
        ],
        sub_categoryID: showModal.subcategoryID,
      });
      trigger();
      toast.success("Classification Added", toastObjects);
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

  const update_category = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosPrivate.put("/inventory/update-category", {
        ID: showModal.data.ID,
        Category_name: inputFields,
      });

      alert("Category Updated!");
      setShowModal({
        purpose: "",
        show: false,
        data: [],
        type: "",
      });
      trigger();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const update_subcategory = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (showModal.purpose == "EditSubcategory") {
        await axiosPrivate.put("/inventory/update-subcategory", {
          Subcategory_name: inputFields,
          ID: showModal.data.ID,
        });

        alert("Subcategory Updated!");
      }

      if (showModal.purpose == "EditClassification") {
        const classification_data = showModal.data.Classification.filter(
          (fil) => fil.ID != showModal.data.part.ID
        );

        await axiosPrivate.put("/inventory/update-subcategory", {
          Classification: [
            ...classification_data,
            { ID: showModal.data.part.ID, Classification_name: inputFields },
          ],
          ID: showModal.data.ID,
        });

        alert("Classification Updated!");
      }

      setShowModal({
        purpose: "",
        show: false,
        data: [],
        type: "",
      });
      trigger();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 bg-opacity-50 backdrop-blur-sm">
      <form
        onSubmit={(e) =>
          showModal.type == "category"
            ? create_category(e)
            : showModal.type == "create_subcategory"
            ? create_subcategory(e)
            : showModal.type == "create_classification"
            ? create_classification(e)
            : showModal.type == "update_category"
            ? update_category(e)
            : showModal.type == "update_subcategory"
            ? update_subcategory(e)
            : ""
        }
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {showModal.purpose == "create"
            ? "Add Category"
            : showModal.purpose == "AddSubcategory"
            ? "Create Subcategory"
            : showModal.purpose == "AddClassification"
            ? "Add Classification"
            : showModal.purpose == "EditCategory"
            ? "Edit Category"
            : showModal.purpose == "EditSubcategory"
            ? "Edit Subcategory"
            : showModal.purpose == "EditClassification"
            ? "Edit Classification"
            : ""}
        </h2>
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2"></label>
            <input
              required
              onChange={(e) => setInputFields(e.target.value)}
              type="text"
              value={inputFields}
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
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CategoryModal;
