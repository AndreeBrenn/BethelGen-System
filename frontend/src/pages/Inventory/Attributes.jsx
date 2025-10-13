import React, { useState } from "react";

const Attributes = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      categoryName: "Life Insurance",
      expanded: false,
      subCategories: [
        {
          id: 1,
          name: "Term Life",
          expanded: false,
          classifications: [
            { id: 1, name: "Level Term" },
            { id: 2, name: "Decreasing Term" },
          ],
        },
        {
          id: 2,
          name: "Whole Life",
          expanded: false,
          classifications: [
            { id: 3, name: "Traditional Whole Life" },
            { id: 4, name: "Universal Life" },
          ],
        },
      ],
    },
    {
      id: 2,
      categoryName: "Health Insurance",
      expanded: false,
      subCategories: [
        {
          id: 3,
          name: "Medical",
          expanded: false,
          classifications: [
            { id: 5, name: "HMO" },
            { id: 6, name: "PPO" },
          ],
        },
      ],
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalMode, setModalMode] = useState("add");
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  const toggleCategory = (categoryId) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat
      )
    );
  };

  const toggleSubCategory = (categoryId, subCategoryId) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              subCategories: cat.subCategories.map((sub) =>
                sub.id === subCategoryId
                  ? { ...sub, expanded: !sub.expanded }
                  : sub
              ),
            }
          : cat
      )
    );
  };

  const openModal = (type, mode, item = null) => {
    setModalType(type);
    setModalMode(mode);
    setSelectedItem(item);
    setFormData({ name: item?.name || item?.categoryName || "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: "" });
    setSelectedItem(null);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    if (modalType === "category") {
      if (modalMode === "add") {
        const newCategory = {
          id: Date.now(),
          categoryName: formData.name,
          expanded: false,
          subCategories: [],
        };
        setCategories([...categories, newCategory]);
      } else {
        setCategories(
          categories.map((cat) =>
            cat.id === selectedItem.id
              ? { ...cat, categoryName: formData.name }
              : cat
          )
        );
      }
    } else if (modalType === "subcategory") {
      if (modalMode === "add") {
        const newSubCategory = {
          id: Date.now(),
          name: formData.name,
          expanded: false,
          classifications: [],
        };
        setCategories(
          categories.map((cat) =>
            cat.id === selectedItem.categoryId
              ? {
                  ...cat,
                  subCategories: [...cat.subCategories, newSubCategory],
                }
              : cat
          )
        );
      } else {
        setCategories(
          categories.map((cat) =>
            cat.id === selectedItem.categoryId
              ? {
                  ...cat,
                  subCategories: cat.subCategories.map((sub) =>
                    sub.id === selectedItem.id
                      ? { ...sub, name: formData.name }
                      : sub
                  ),
                }
              : cat
          )
        );
      }
    } else if (modalType === "classification") {
      if (modalMode === "add") {
        const newClassification = {
          id: Date.now(),
          name: formData.name,
        };
        setCategories(
          categories.map((cat) =>
            cat.id === selectedItem.categoryId
              ? {
                  ...cat,
                  subCategories: cat.subCategories.map((sub) =>
                    sub.id === selectedItem.subCategoryId
                      ? {
                          ...sub,
                          classifications: [
                            ...sub.classifications,
                            newClassification,
                          ],
                        }
                      : sub
                  ),
                }
              : cat
          )
        );
      } else {
        setCategories(
          categories.map((cat) =>
            cat.id === selectedItem.categoryId
              ? {
                  ...cat,
                  subCategories: cat.subCategories.map((sub) =>
                    sub.id === selectedItem.subCategoryId
                      ? {
                          ...sub,
                          classifications: sub.classifications.map((cls) =>
                            cls.id === selectedItem.id
                              ? { ...cls, name: formData.name }
                              : cls
                          ),
                        }
                      : sub
                  ),
                }
              : cat
          )
        );
      }
    }

    closeModal();
  };

  const handleDelete = (type, ids) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`))
      return;

    if (type === "category") {
      setCategories(categories.filter((cat) => cat.id !== ids.categoryId));
    } else if (type === "subcategory") {
      setCategories(
        categories.map((cat) =>
          cat.id === ids.categoryId
            ? {
                ...cat,
                subCategories: cat.subCategories.filter(
                  (sub) => sub.id !== ids.subCategoryId
                ),
              }
            : cat
        )
      );
    } else if (type === "classification") {
      setCategories(
        categories.map((cat) =>
          cat.id === ids.categoryId
            ? {
                ...cat,
                subCategories: cat.subCategories.map((sub) =>
                  sub.id === ids.subCategoryId
                    ? {
                        ...sub,
                        classifications: sub.classifications.filter(
                          (cls) => cls.id !== ids.classificationId
                        ),
                      }
                    : sub
                ),
              }
            : cat
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Insurance Category Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage insurance products, subcategories, and classifications
              </p>
            </div>
            <button
              onClick={() => openModal("category", "add")}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="text-xl">+</span>
              Add Category
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">📁</div>
              <p className="text-gray-500">
                No categories yet. Create your first insurance category.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="text-gray-600 hover:text-gray-900 text-xl"
                      >
                        {category.expanded ? "▼" : "▶"}
                      </button>
                      <span className="text-2xl">📂</span>
                      <span className="font-semibold text-gray-900">
                        {category.categoryName}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({category.subCategories.length} subcategories)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          openModal("subcategory", "add", {
                            categoryId: category.id,
                          })
                        }
                        className="text-blue-600 hover:text-blue-700 p-2 rounded hover:bg-blue-50 text-lg"
                        title="Add Subcategory"
                      >
                        +
                      </button>
                      <button
                        onClick={() => openModal("category", "edit", category)}
                        className="text-gray-600 hover:text-gray-700 p-2 rounded hover:bg-gray-100"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() =>
                          handleDelete("category", { categoryId: category.id })
                        }
                        className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {category.expanded && (
                    <div className="pl-10 pb-2">
                      {category.subCategories.map((subCategory) => (
                        <div
                          key={subCategory.id}
                          className="mt-2 border-l-2 border-gray-200"
                        >
                          <div className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors ml-2 rounded">
                            <div className="flex items-center gap-3 flex-1">
                              <button
                                onClick={() =>
                                  toggleSubCategory(category.id, subCategory.id)
                                }
                                className="text-gray-600 hover:text-gray-900 text-lg"
                              >
                                {subCategory.expanded ? "▼" : "▶"}
                              </button>
                              <span className="text-xl">📁</span>
                              <span className="font-medium text-gray-800">
                                {subCategory.name}
                              </span>
                              <span className="text-sm text-gray-500">
                                ({subCategory.classifications.length}{" "}
                                classifications)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  openModal("classification", "add", {
                                    categoryId: category.id,
                                    subCategoryId: subCategory.id,
                                  })
                                }
                                className="text-green-600 hover:text-green-700 p-2 rounded hover:bg-green-50"
                                title="Add Classification"
                              >
                                +
                              </button>
                              <button
                                onClick={() =>
                                  openModal("subcategory", "edit", {
                                    ...subCategory,
                                    categoryId: category.id,
                                  })
                                }
                                className="text-gray-600 hover:text-gray-700 p-2 rounded hover:bg-gray-100"
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete("subcategory", {
                                    categoryId: category.id,
                                    subCategoryId: subCategory.id,
                                  })
                                }
                                className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50"
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>

                          {subCategory.expanded && (
                            <div className="pl-10 pb-2">
                              {subCategory.classifications.map(
                                (classification) => (
                                  <div
                                    key={classification.id}
                                    className="flex items-center justify-between p-2 hover:bg-gray-50 transition-colors ml-2 rounded mt-1"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="text-lg">📄</span>
                                      <span className="text-gray-700">
                                        {classification.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() =>
                                          openModal("classification", "edit", {
                                            ...classification,
                                            categoryId: category.id,
                                            subCategoryId: subCategory.id,
                                          })
                                        }
                                        className="text-gray-600 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
                                        title="Edit"
                                      >
                                        ✏️
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDelete("classification", {
                                            categoryId: category.id,
                                            subCategoryId: subCategory.id,
                                            classificationId: classification.id,
                                          })
                                        }
                                        className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
                                        title="Delete"
                                      >
                                        🗑️
                                      </button>
                                    </div>
                                  </div>
                                )
                              )}
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
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {modalMode === "add" ? "Add" : "Edit"}{" "}
              {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
            </h2>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {modalType.charAt(0).toUpperCase() + modalType.slice(1)} Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Enter ${modalType} name`}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {modalMode === "add" ? "Add" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attributes;
