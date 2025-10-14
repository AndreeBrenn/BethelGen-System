import React, { useEffect, useState } from "react";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import CategoryModal from "../../modals/InventoryModal/CategoryModal";
import { handleApiError } from "../../utils/HandleError";
import usePrivateAxios from "../../hooks/useProtectedAxios";

const Attributes = () => {
  const [category, setCategory] = useState([]);
  const [showModal, setShowModal] = useState({
    purpose: "",
    data: [],
    show: false,
    type: "",
    categoryID: null,
    subcategoryID: null,
  });
  const [trigger, setTrigger] = useState(0);

  const axiosPrivate = usePrivateAxios();

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemPerPage] = useState(5);
  const [itemOffset, setItemOffset] = useState(0);
  const [count, setCount] = useState(0);

  const [toggleStates, setToggleStates] = useState({
    categories: [],
    subcategories: [],
  });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const get_category = async () => {
      const res = await axiosPrivate.get("/inventory/get-category", {
        params: {
          search: "",
          itemsPerPage,
          offset: itemOffset,
        },
      });

      if (isMounted) {
        setCategory(res.data.rows);
        setCount(res.data.count);
      }
    };

    get_category().catch((error) => {
      if (isMounted && error.name !== "CanceledError") {
        handleApiError(error);
      }
    });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [itemOffset, itemsPerPage, trigger]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Inventory Attributes
              </h1>
              <p className="text-gray-600 mt-1">
                Add and manage categories, sub-categories, and classifications
                for your inventory.
              </p>
            </div>
            <button
              onClick={() =>
                setShowModal({
                  purpose: "create",
                  show: true,
                  type: "category",
                })
              }
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="text-xl">+</span>
              Add Category
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {category.length == 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">📁</div>
              <p className="text-gray-500">
                No categories yet. Create your first insurance category.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {category.map((data) => (
                <div
                  key={data.ID}
                  className="border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() =>
                          setToggleStates((prev) => {
                            if (
                              toggleStates.categories.some(
                                (som) => data.ID == som
                              )
                            ) {
                              return {
                                ...prev,
                                categories: toggleStates.categories.filter(
                                  (fil) => fil != data.ID
                                ),
                              };
                            } else {
                              return {
                                ...prev,
                                categories: [
                                  ...toggleStates.categories,
                                  data.ID,
                                ],
                              };
                            }
                          })
                        }
                        className="text-gray-600 hover:text-gray-900 text-xl"
                      >
                        {toggleStates?.categories?.some(
                          (som) => som == data.ID
                        ) ? (
                          <MdOutlineKeyboardArrowDown />
                        ) : (
                          <MdOutlineKeyboardArrowRight />
                        )}
                      </button>
                      <span className="text-2xl">📂</span>
                      <span className="font-semibold text-gray-900">
                        {data.Category_name}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({data.inv_subcat.length} subcategories)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setShowModal({
                            purpose: "AddSubcategory",
                            show: true,
                            type: "create_subcategory",
                            categoryID: data.ID,
                          })
                        }
                        className="text-blue-600 hover:text-blue-700 p-2 rounded hover:bg-blue-50 text-lg"
                        title="Add Subcategory"
                      >
                        +
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-700 p-2 rounded hover:bg-gray-100"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {toggleStates.categories.some((som) => som == data.ID) && (
                    <div className="pl-10 pb-2">
                      {data.inv_subcat?.map((items) => (
                        <div className="mt-2 border-l-2 border-gray-200">
                          <div className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors ml-2 rounded">
                            <div className="flex items-center gap-3 flex-1">
                              <button
                                onClick={() =>
                                  setToggleStates((prev) => {
                                    if (
                                      toggleStates.subcategories.some(
                                        (som) => som == items.ID
                                      )
                                    ) {
                                      return {
                                        ...prev,
                                        subcategories:
                                          toggleStates.subcategories.filter(
                                            (fil) => fil != items.ID
                                          ),
                                      };
                                    } else {
                                      return {
                                        ...prev,
                                        subcategories: [
                                          ...toggleStates.subcategories,
                                          items.ID,
                                        ],
                                      };
                                    }
                                  })
                                }
                                className="text-gray-600 hover:text-gray-900 text-lg"
                              >
                                {toggleStates.subcategories.some(
                                  (som) => som == items.ID
                                ) ? (
                                  <MdOutlineKeyboardArrowDown />
                                ) : (
                                  <MdOutlineKeyboardArrowRight />
                                )}
                              </button>
                              <span className="text-xl">📁</span>
                              <span className="font-medium text-gray-800">
                                {items.Subcategory_name}
                              </span>
                              <span className="text-sm text-gray-500">
                                ({items.Classification.length} Classification)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  setShowModal({
                                    purpose: "AddClassification",
                                    type: "create_classification",
                                    data: items.Classification,
                                    subcategoryID: items.ID,
                                    show: true,
                                  })
                                }
                                className="text-green-600 hover:text-green-700 p-2 rounded hover:bg-green-50"
                                title="Add Classification"
                              >
                                +
                              </button>
                              <button
                                className="text-gray-600 hover:text-gray-700 p-2 rounded hover:bg-gray-100"
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50"
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>

                          {toggleStates.subcategories.some(
                            (somsub) => somsub == items.ID
                          ) && (
                            <div className="pl-10 pb-2">
                              {items.Classification?.map((part) => (
                                <div
                                  key={part.ID}
                                  className="flex items-center justify-between p-2 hover:bg-gray-50 transition-colors ml-2 rounded mt-1"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-lg">📄</span>
                                    <span className="text-gray-700">
                                      {part.Classification_name}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      className="text-gray-600 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
                                      title="Edit"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
                                      title="Delete"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {showModal.show && (
          <CategoryModal
            showModal={showModal}
            setShowModal={setShowModal}
            setTrigger={setTrigger}
          />
        )}
      </div>
    </div>
  );
};

export default Attributes;
