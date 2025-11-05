import React, { useCallback, useEffect, useState } from "react";
import {
  FaTimes,
  FaCheck,
  FaUndo,
  FaBan,
  FaUpload,
  FaUser,
  FaCheckCircle,
  FaClock,
  FaBoxOpen,
  FaTruck,
  FaVoteYea,
} from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { RiCloseCircleFill } from "react-icons/ri";

import moment from "moment";
import { handleApiError } from "../../utils/HandleError";
import usePrivateAxios from "../../hooks/useProtectedAxios";
import { decodedUser } from "../../utils/GlobalVariables";
import { MdLocalShipping } from "react-icons/md";
import { toast } from "react-toastify";

const InventoryManageRequestModal = ({ requestData, onClose }) => {
  const [itemData, setItemData] = useState(requestData);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [signatories, setSignatories] = useState([]);
  const [notes, setNotes] = useState("");
  const [signatoriesSelected, setSignatoriesSelected] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dropDownAssign, setDropDownAssign] = useState({});
  const [errors, setErrors] = useState(null);
  const [inventory, setInventory] = useState([]);

  const axiosPrivate = usePrivateAxios();

  const user = decodedUser();

  const allowedButtons = () => {
    if (
      itemData.Item_status == "Shipped" ||
      itemData.Item_status == "Received" ||
      itemData.Item_status == "Rejected"
    )
      return false;

    if (!itemData.Item_signatories) return true;

    const orderCount = itemData.Item_signatories.filter(
      (fil) => fil.Status == "Approved"
    );
    const userApprover = itemData.Item_signatories.filter(
      (fil) => fil.ID == user.ID
    )[0];

    if (
      userApprover?.Order == orderCount.length &&
      userApprover.length != 0 &&
      userApprover.Status != "Approved"
    )
      return true;

    return false;
  };

  const allowedShipmentComponents = () => {
    if (!itemData.Item_signatories) {
      return false;
    }

    const terminalStatuses = ["Shipped", "Received", "Rejected"];
    if (terminalStatuses.includes(itemData.Item_status)) {
      return false;
    }

    const hasPendingSignatories = itemData.Item_signatories.some(
      (signatory) => signatory.Status === "Pending"
    );

    return !hasPendingSignatories;
  };

  const get_all_users = useCallback(async () => {
    try {
      const res = await axiosPrivate.get("/users/get-all-users");

      setSignatories(res.data);
    } catch (error) {
      handleApiError(error);
    }
  }, []);

  const get_shipped_items = useCallback(async () => {
    try {
      const res = await axiosPrivate.post("/inventory/get-shipped-items", {
        ids: [...new Set(itemData.Inv_request.map((data) => data.Item_ID))],
      });

      setInventory(res.data);
    } catch (error) {
      handleApiError(error);
    }
  }, []);

  useEffect(() => {
    get_all_users();
    if (itemData.Item_status == "Shipped" || itemData.Item_status == "Received")
      get_shipped_items();
  }, []);

  const update_request = async (e) => {
    e.preventDefault();
    try {
      let form = new FormData();

      // INITIAL STAGE
      if (!itemData.Item_signatories) {
        if (signatoriesSelected.length == 0) {
          alert("Please assign a signatory");
          return;
        }

        const data = {
          ID: itemData.ID,
          Item_value: itemData.Item_value,
          Item_signatories: [
            ...signatoriesSelected,
            {
              Name: user.FirstName + " " + user.LastName,

              ID: user.ID,
              Role: user.Role,
              Position: user.Position,
              Status: "Approved",
              Date: moment(),
              note: notes,
              Order: 0,
            },
          ],
        };

        form.append("Item_value", JSON.stringify(data.Item_value));
        form.append("ID", data.ID);
        form.append("Item_signatories", JSON.stringify(data.Item_signatories));

        const flatFiles = uploadedFiles.flat();
        flatFiles.forEach((file) => {
          form.append("images", file);
        });

        const res = await axiosPrivate.put("/inventory/update-request", form);
        alert("Data Updated");
        return;
      }

      // APPROVING STAGE

      const newSignatory = itemData.Item_signatories.filter(
        (fil) => fil.ID != user.ID
      );
      const prevSignatory = itemData.Item_signatories.filter(
        (fil) => fil.ID == user.ID
      );

      const data = {
        ID: itemData.ID,
        Item_value: itemData.Item_value,
        Item_signatories: [
          ...newSignatory,
          {
            Name: user.FirstName + " " + user.LastName,
            ID: user.ID,
            Role: user.Role,
            Position: user.Position,
            Status: "Approved",
            Date: moment(),
            note: notes,
            Order: prevSignatory[0].Order,
          },
        ],
      };

      form.append("ID", data.ID);
      form.append("Item_signatories", JSON.stringify(data.Item_signatories));
      form.append("Item_value", JSON.stringify(data.Item_value));

      const res = await axiosPrivate.put("/inventory/update-request", form);

      alert("Data Updated!");
    } catch (error) {
      console.log(error);
      handleApiError(error);
    }
  };

  const [editingIndex, setEditingIndex] = useState(null);
  const [tempAmount, setTempAmount] = useState("");

  const handleAmountSave = (index) => {
    setItemData((prev) => {
      // Make a copy of the previous state
      const newData = { ...prev };

      // Make a copy of the nested array
      const newItemValue = [...newData.Item_value];

      // Update the specific element's Amount
      newItemValue[index] = {
        ...newItemValue[index],
        Item_amount: tempAmount,
      };

      // Assign the updated array back
      newData.Item_value = newItemValue;

      return newData;
    });

    setEditingIndex(null);
  };

  const get_item_filtered = async (
    category,
    subcategory,
    classification,
    position
  ) => {
    try {
      const res = await axiosPrivate.get("/inventory/get-filtered-items", {
        params: {
          Item_category: category,
          Item_subcategory: subcategory,
          Item_classification: classification,
        },
      });

      // Store options for this specific position
      setDropDownAssign((prev) => ({
        ...prev,
        [position]: res.data,
      }));
    } catch (error) {
      handleApiError(error);
    }
  };

  const [itemState, setItemState] = useState([]);

  const handleChangeDropDown = (index, itemPicked, itemName) => {
    const findId = itemState.filter((fil) => fil.position == index);

    if (findId.length == 0)
      setItemState((prev) => [
        ...prev,
        { position: index, item_ID: itemPicked, method: 1, itemName },
      ]);

    const newArray = itemState.filter((fil) => fil.position != index);

    setItemState([
      ...newArray,
      { position: index, item_ID: itemPicked, method: 1, itemName },
    ]);
  };

  const handleChangeRadio = (index, value) => {
    const findId = itemState.filter((fil) => fil.position == index)[0];

    const newData = itemState.filter((fil) => fil.position != index);

    if (value == 1) {
      setItemState([...newData, { ...findId, method: value, inputText: "" }]);
    }

    if (value == 2) {
      setItemState([
        ...newData,
        { ...findId, method: value, serialStart: 0, serialEnd: 0 },
      ]);
    }
  };

  const handleChangeTextArea = (index, text) => {
    const findId = itemState.filter((fil) => fil.position == index)[0];

    const newData = itemState.filter((fil) => fil.position != index);

    setItemState([...newData, { ...findId, inputText: text }]);
  };

  const handleChangeSerial = (index, particulars, value) => {
    const findId = itemState.filter((fil) => fil.position == index)[0];

    const newData = itemState.filter((fil) => fil.position != index);

    if (particulars == "start")
      setItemState([...newData, { ...findId, serialStart: value }]);

    if (particulars == "end")
      setItemState([...newData, { ...findId, serialEnd: value }]);
  };

  const countQuantity = (index, quantityData) => {
    const item = itemState.find((item) => item.position === index);

    if (!item) {
      return {
        count: 0,
        quantity: quantityData,
        status: "insufficient",
        message: `0/${quantityData} - Insufficient`,
        isValid: false,
      };
    }

    let count = 0;
    let isValid = true;
    let status = "insufficient";
    let message = "";

    if (item.method === 1 && item.inputText) {
      const inputTextArray = item.inputText
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      count = inputTextArray.length;
    }

    if (item.method === 2) {
      if (!item.serialStart || !item.serialEnd) {
        return {
          count: 0,
          quantity: quantityData,
          status: "invalid",
          message: `0/${quantityData} - Invalid range`,
          isValid: false,
        };
      }

      const start = parseInt(item.serialStart);
      const end = parseInt(item.serialEnd);

      // Check if invalid range
      if (isNaN(start) || isNaN(end)) {
        return {
          count: 0,
          quantity: quantityData,
          status: "invalid",
          message: `0/${quantityData} - Invalid numbers`,
          isValid: false,
        };
      }

      if (end < start) {
        return {
          count: 0,
          quantity: quantityData,
          status: "invalid",
          message: `${start}-${end}/${quantityData} - Invalid range (end < start)`,
          isValid: false,
        };
      }

      count = end - start + 1;
    }

    // Determine status based on count vs quantity
    if (count < quantityData) {
      status = "insufficient";
      message = `${count}/${quantityData} - Insufficient`;
      isValid = false;
    } else if (count > quantityData) {
      status = "excess";
      message = `${count}/${quantityData} - Excess`;
      isValid = false;
    } else {
      status = "exact";
      message = `${count}/${quantityData} - Complete`;
      isValid = true;
    }

    return {
      count,
      quantity: quantityData,
      status,
      message,
      isValid,
    };
  };

  const ship_items = async (e) => {
    e.preventDefault();

    let temp = [];
    let validationErrors = [];

    try {
      // Validate quantities before processing
      itemData.Item_value?.forEach((data, index) => {
        const result = countQuantity(index, data.Item_quantity);

        if (!result.isValid) {
          validationErrors.push({
            itemName: data.Item_name,
            message: result.message,
            status: result.status,
          });
        }
      });

      // If there are validation errors, stop and show them
      if (validationErrors.length > 0) {
        const errorMessages = validationErrors
          .map((err) => `${err.itemName}: ${err.message}`)
          .join("\n");

        toast.error(
          `Cannot ship items. Please fix the following:\n\n${errorMessages}`,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
        return;
      }

      // Process items if validation passes
      itemState.forEach((item) => {
        if (item.method == 1) {
          const inputTextArray = item.inputText.split(",");
          inputTextArray.forEach((serials) =>
            temp.push({ item_ID: item.item_ID, serials: serials.trim() })
          );
        }

        if (item.method == 2) {
          const start = parseInt(item.serialStart);
          const end = parseInt(item.serialEnd);

          for (let i = start; i <= end; i++) {
            temp.push({ item_ID: item.item_ID, serials: i });
          }
        }
      });

      const items = {
        Item_signatories: [
          ...itemData.Item_signatories,
          {
            ID: user.ID,
            Date: moment(),
            Name: user.FirstName + " " + user.LastName,
            Role: user.Role,
            note: notes,
            Order: itemData.Item_signatories.length,
            Status: "Shipped",
            Position: user.Position,
          },
        ],
        branch: itemData.Item_branch,
        Inv_requestID: itemData.ID,
        items: temp.map((data) => {
          return {
            Item_ID: data.item_ID,
            Item_serial: data.serials.toString(),
          };
        }),
      };

      const res = await axiosPrivate.put("/inventory/ship-items", items);
      console.log(res);
      alert("Data Updated Successfully!");
    } catch (error) {
      console.log(error);
      handleApiError(error);
      if (
        error.status == 404 &&
        error.response.data.message?.includes("exist")
      ) {
        setErrors({
          message: "These Items don't exist",
          items: error.response.data.items,
        });
      }

      if (
        error.status == 400 &&
        error.response.data.message?.includes("unavailable")
      ) {
        setErrors({
          message: "These Items are unavailable",
          items: error.response.data.items,
        });
      }
    }
  };

  const reject_request = async (e) => {
    e.preventDefault();

    try {
      const newArray = itemData.Item_signatories.filter(
        (fil) => fil.ID != user.ID
      );
      const previousOrder = itemData.Item_signatories.filter(
        (fil) => fil.ID == user.ID
      );

      const itemSignatures = !itemData.Item_signatories
        ? JSON.stringify([
            {
              ID: user.ID,
              Date: moment(),
              Name: user.FirstName + " " + user.LastName,
              Role: user.Role,
              Position: user.Position,
              Order: 0,
              Status: "Rejected",
              note: notes,
            },
          ])
        : JSON.stringify([
            ...newArray,
            {
              ID: user.ID,
              Date: moment(),
              Name: user.FirstName + " " + user.LastName,
              Role: user.Role,
              Position: user.Position,
              Order: previousOrder[0].Order,
              Status: "Rejected",
              note: notes,
            },
          ]);

      const item = {
        Item_value: JSON.stringify(itemData.Item_value),
        Item_signatories: itemSignatures,
        ID: itemData.ID,
        Item_status: "Rejected",
      };

      const res = await axiosPrivate.put("/inventory/update-request", item);

      alert("Request Rejected");
    } catch (error) {
      console.log(error);
      handleApiError(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Manage Request</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Request Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Request Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Request #</p>
                    <p className="font-semibold">{itemData?.ID}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span
                      className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                        itemData?.Item_status == "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : itemData?.Item_status == "Shipped"
                          ? "bg-blue-100 text-blue-800"
                          : itemData?.Item_status == "Rejected"
                          ? "bg-red-100 text-red-800"
                          : itemData?.Item_status == "Received"
                          ? "bg-green-100 text-green-800"
                          : ""
                      } `}
                    >
                      {itemData?.Item_status}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Requester</p>
                    <p className="font-semibold">
                      {`${itemData.Item_userID.FirstName} ${itemData.Item_userID.LastName}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-semibold">
                      {itemData?.Item_userID?.Department}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 ">Description</p>
                    <p className="font-semibold">
                      {itemData?.Item_description}
                    </p>
                  </div>
                </div>
              </div>

              {/* ITEM TABLE */}
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
                                  onChange={(e) =>
                                    setTempAmount(e.target.value)
                                  }
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
                        <td
                          className="px-4 py-3 text-sm text-gray-900"
                          colSpan={5}
                        >
                          Total:
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-bold">
                          {(
                            itemData.Item_value.reduce(
                              (a, b) =>
                                parseFloat(a) + parseFloat(b.Item_amount),
                              0
                            ) || 0
                          ).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SHIPPED ITEMS */}
              {itemData.Item_status == "Shipped" ||
                (itemData.Item_status == "Received" && (
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
                              <td className="px-4 py-3 text-sm text-gray-500">
                                {index + 1}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {inventory.filter(
                                  (fil) => fil.ID == data.Item_ID
                                )[0]?.Item_name || "Unknown item"}
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
                ))}

              {/* Assign Signatories */}
              {!itemData.Item_signatories && (
                <>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FaUser className="text-blue-600" />
                      Assign Signatories
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Signatory
                        </label>
                        <select
                          onChange={(e) => {
                            const newSignatory = {
                              Name:
                                e.target.selectedOptions[0].dataset.firstname +
                                " " +
                                e.target.selectedOptions[0].dataset.lastname,
                              ID: e.target.value,
                              Role: e.target.selectedOptions[0].dataset.role,
                              Position:
                                e.target.selectedOptions[0].dataset.position,
                              Order: 1, // Change this to 2, 3, 4, etc. depending on which select this is
                              Status: "Pending",
                              Date: null,
                            };

                            // Remove any existing entry with same Order, then add new one
                            setSignatoriesSelected([
                              ...signatoriesSelected.filter(
                                (sig) => sig.Order !== 1
                              ),
                              newSignatory,
                            ]);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select signatory</option>
                          {signatories.map((sig) => (
                            <option
                              key={sig.ID}
                              value={sig.ID}
                              data-firstname={sig.FirstName}
                              data-lastname={sig.LastName}
                              data-role={sig.Role}
                              data-position={sig.Position}
                            >
                              {sig.FirstName + " " + sig.LastName} -{" "}
                              {sig.Position}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Second Signatory
                        </label>
                        <select
                          onChange={(e) => {
                            const newSignatory = {
                              Name:
                                e.target.selectedOptions[0].dataset.firstname +
                                " " +
                                e.target.selectedOptions[0].dataset.lastname,
                              ID: e.target.value,
                              Role: e.target.selectedOptions[0].dataset.role,
                              Position:
                                e.target.selectedOptions[0].dataset.position,
                              Order: 2, // Change this to 2, 3, 4, etc. depending on which select this is
                              Status: "Pending",
                              Date: null,
                            };

                            // Remove any existing entry with same Order, then add new one
                            setSignatoriesSelected([
                              ...signatoriesSelected.filter(
                                (sig) => sig.Order !== 2
                              ),
                              newSignatory,
                            ]);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select signatory</option>
                          {signatories.map((sig) => (
                            <option
                              key={sig.ID}
                              value={sig.ID}
                              data-firstname={sig.FirstName}
                              data-lastname={sig.LastName}
                              data-role={sig.Role}
                              data-position={sig.Position}
                            >
                              {sig.FirstName + " " + sig.LastName} -{" "}
                              {sig.Position}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Third Signatory (Optional)
                        </label>
                        <select
                          onChange={(e) => {
                            const newSignatory = {
                              Name:
                                e.target.selectedOptions[0].dataset.firstname +
                                " " +
                                e.target.selectedOptions[0].dataset.lastname,
                              ID: e.target.value,
                              Role: e.target.selectedOptions[0].dataset.role,
                              Position:
                                e.target.selectedOptions[0].dataset.position,
                              Order: 3, // Change this to 2, 3, 4, etc. depending on which select this is
                              Status: "Pending",
                              Date: null,
                            };

                            // Remove any existing entry with same Order, then add new one
                            setSignatoriesSelected([
                              ...signatoriesSelected.filter(
                                (sig) => sig.Order !== 3
                              ),
                              newSignatory,
                            ]);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select signatory</option>
                          {signatories.map((sig) => (
                            <option
                              key={sig.ID}
                              value={sig.ID}
                              data-firstname={sig.FirstName}
                              data-lastname={sig.LastName}
                              data-role={sig.Role}
                              data-position={sig.Position}
                            >
                              {sig.FirstName + " " + sig.LastName} -{" "}
                              {sig.Position}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Upload Image */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FaUpload className="text-blue-600" />
                      Upload Supporting Document
                    </h3>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                        <input
                          type="file"
                          id="file-upload"
                          accept="image/*"
                          onChange={(e) =>
                            setUploadedFiles((prev) => [
                              ...prev,
                              ...Array.from(e.target.files),
                            ])
                          }
                          className="hidden"
                          multiple
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <FaUpload className="text-4xl text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            PNG, JPG up to 10MB
                          </p>
                        </label>
                      </div>
                      {uploadedImage && (
                        <div className="relative">
                          <img
                            src={uploadedImage}
                            alt="Uploaded"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => setUploadedImage(null)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ASSIGNING OF ITEMS */}
              {allowedShipmentComponents() &&
                itemData.Item_status != "Shipped" &&
                itemData.Item_status != "Received" && (
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
                                Item Name
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
                                Assign to Item ID
                              </label>
                              <select
                                onChange={(e) =>
                                  handleChangeDropDown(
                                    index,
                                    e.target.value,
                                    e.target.selectedOptions[0].dataset.itemname
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
                                  itemState.filter(
                                    (fil) => fil.position == index
                                  )[0]?.item_ID
                                }
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                defaultValue=""
                              >
                                <option value="" disabled>
                                  Select Item ID
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
                                  (fil) =>
                                    fil.method == 1 && fil.position == index
                                ).length != 0
                              }
                              disabled={
                                itemState.filter((fil) => fil.position == index)
                                  .length == 0
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
                                  (fil) =>
                                    fil.method == 2 && fil.position == index
                                ).length != 0
                              }
                              disabled={
                                itemState.filter((fil) => fil.position == index)
                                  .length == 0
                              }
                              type="radio"
                            />{" "}
                            <span className="text-sm font-medium text-gray-700 mx-2">
                              Serial range
                            </span>
                          </div>

                          {/* TEXT AREA MANUAL ENCODING */}
                          {itemState.filter(
                            (fil) => fil.position == index && fil.method == 1
                          ).length != 0 && (
                            <textarea
                              onChange={(e) =>
                                handleChangeTextArea(index, e.target.value)
                              }
                              value={
                                itemState.filter(
                                  (fil) =>
                                    fil.position == index && fil.method == 1
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
                                    handleChangeSerial(
                                      index,
                                      "start",
                                      e.target.value
                                    )
                                  }
                                  value={
                                    itemState.filter(
                                      (fil) =>
                                        fil.position == index && fil.method == 2
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
                                    handleChangeSerial(
                                      index,
                                      "end",
                                      e.target.value
                                    )
                                  }
                                  value={
                                    itemState.filter(
                                      (fil) =>
                                        fil.position == index && fil.method == 2
                                    )[0]?.serialEnd
                                  }
                                  type="text"
                                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                          )}
                          <div>
                            {(() => {
                              const result = countQuantity(
                                index,
                                data.Item_quantity
                              );
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
                )}

              {itemData.Item_signatories && (
                <>
                  <div className="bg-white flex flex-col border border-gray-200 rounded-lg p-5 mb-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Uploaded Images
                    </h3>
                    {itemData.Item_image == null && (
                      <span className="text-center w-full p-5">No image</span>
                    )}
                    <div className="grid grid-cols-4 gap-3">
                      {itemData.Item_image?.map((image, index) => (
                        <div key={index} className="relative group">
                          <a
                            href={"/server" + image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img
                              src={"/server" + image}
                              alt={`Image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
                            />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Notes */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Notes
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes or comments..."
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Right Column - Timeline Tracker */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 sticky top-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Request Tracker
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center 
                       
                            bg-blue-500 text-white
                        
                          `}
                      >
                        <FaVoteYea />
                      </div>
                      {
                        <div
                          className={`w-0.5 h-16
                              bg-blue-500
                            `}
                        />
                      }
                    </div>
                    <div className="flex-1 pb-8">
                      <p className="font-semibold text-gray-900">Submitted</p>
                      <p className="text-sm text-gray-600">
                        {itemData.Item_userID.FirstName +
                          " " +
                          itemData.Item_userID.LastName}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {moment(itemData.createdAt).format(
                          "YYYY-MM-DD hh:mm A"
                        )}
                      </p>
                    </div>
                  </div>
                  {itemData.Item_signatories?.sort(
                    (a, b) => a?.Order - b?.Order
                  ).map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.Status == "Approved" ||
                            item.Status == "Received"
                              ? "bg-green-500 text-white"
                              : item.Status == "Shipped"
                              ? "bg-blue-600 text-white"
                              : item.Status == "Rejected"
                              ? "bg-red-600 text-white"
                              : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {item.Status == "Approved" ? (
                            <FaCheckCircle />
                          ) : item.Status == "Shipped" ? (
                            <FaTruck />
                          ) : item.Status == "Received" ? (
                            <FaBoxOpen />
                          ) : item.Status == "Rejected" ? (
                            <RiCloseCircleFill />
                          ) : (
                            <FaClock />
                          )}
                        </div>

                        <div
                          className={`w-0.5 h-16 ${
                            item.Status == "Approved" ||
                            item.Status == "Received"
                              ? "bg-green-500"
                              : item.Status == "Shipped"
                              ? "bg-blue-500"
                              : item.Status == "Rejected"
                              ? "bg-red-600"
                              : "bg-gray-300"
                          }`}
                        />
                      </div>
                      <div className="flex-1 pb-8">
                        <p className="font-semibold text-gray-900">
                          {item.Status}
                        </p>
                        <p className="text-sm text-gray-600">{item.Name}</p>
                        {item.Date && (
                          <p className="text-xs text-gray-500 mt-1">
                            {moment(item.Date).format("YYYY-MM-DD hh:mm A")}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {item.note}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            {allowedButtons() && (
              <>
                <button
                  onClick={(e) => reject_request(e)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                >
                  <FaBan />
                  Reject
                </button>
                <button className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium flex items-center gap-2">
                  <FaUndo />
                  Return
                </button>
                <button
                  onClick={(e) => update_request(e)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                >
                  <FaCheck />
                  Approve
                </button>{" "}
              </>
            )}

            {allowedShipmentComponents() && (
              <button
                onClick={(e) => ship_items(e)}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <MdLocalShipping className="text-xl" />
                Ready for Shipment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManageRequestModal;
