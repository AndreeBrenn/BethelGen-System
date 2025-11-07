import React, { useCallback, useEffect, useState } from "react";
import { FaTimes, FaCheck, FaUndo, FaBan } from "react-icons/fa";
import moment from "moment";
import { handleApiError, toastObjects } from "../../utils/HandleError";
import usePrivateAxios from "../../hooks/useProtectedAxios";
import { decodedUser } from "../../utils/GlobalVariables";
import { MdLocalShipping } from "react-icons/md";
import { toast } from "react-toastify";
import RequestTracker from "../../components/Inventory/InventoryManageRequestModal/RequestTracker";
import ItemTable from "../../components/Inventory/InventoryManageRequestModal/ItemTable";
import RequestDetails from "../../components/Inventory/InventoryManageRequestModal/RequestDetails";
import ShippedItems from "../../components/Inventory/InventoryManageRequestModal/ShippedItems";
import AssignSignatories from "../../components/Inventory/InventoryManageRequestModal/AssignSignatories";
import AssigningOfItems from "../../components/Inventory/InventoryManageRequestModal/AssigningOfItems";
import ImageItems from "../../components/Inventory/InventoryManageRequestModal/ImageItems";

const InventoryManageRequestModal = ({ requestData, onClose, trigger }) => {
  const [itemData, setItemData] = useState(requestData);
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
          toast.error("Please assign a signatories", toastObjects);
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

        trigger();
        toast.success("Item is successfully processed", toastObjects);
        onClose();
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

      trigger();

      toast.success("Item is successfully processed", toastObjects);
      onClose();
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
      trigger();
      toast.success("Items is successfully shipped", toastObjects);
      onClose();
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

      trigger();
      toast.success("Request is successfully rejected", toastObjects);

      onClose();
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
              <RequestDetails itemData={itemData} />

              {/* ITEM TABLE */}
              <ItemTable
                itemData={itemData}
                setTempAmount={setTempAmount}
                tempAmount={tempAmount}
                handleAmountSave={handleAmountSave}
                setEditingIndex={setEditingIndex}
                editingIndex={editingIndex}
              />

              {/* SHIPPED ITEMS */}
              {(itemData.Item_status == "Shipped" ||
                itemData.Item_status == "Received") && (
                <ShippedItems itemData={itemData} inventory={inventory} />
              )}

              {/* Assign Signatories */}
              {!itemData.Item_signatories && (
                <AssignSignatories
                  setSignatoriesSelected={setSignatoriesSelected}
                  signatories={signatories}
                  setUploadedFiles={setUploadedFiles}
                  uploadedFiles={uploadedFiles}
                  signatoriesSelected={signatoriesSelected}
                />
              )}

              {/* ASSIGNING OF ITEMS */}
              {allowedShipmentComponents() &&
                itemData.Item_status != "Shipped" &&
                itemData.Item_status != "Received" && (
                  <AssigningOfItems
                    itemData={itemData}
                    handleChangeDropDown={handleChangeDropDown}
                    get_item_filtered={get_item_filtered}
                    itemState={itemState}
                    dropDownAssign={dropDownAssign}
                    countQuantity={countQuantity}
                    handleChangeSerial={handleChangeSerial}
                    handleChangeTextArea={handleChangeTextArea}
                    handleChangeRadio={handleChangeRadio}
                    errors={errors}
                  />
                )}

              {/* IMAGES */}
              {itemData.Item_signatories && <ImageItems itemData={itemData} />}

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
            <RequestTracker itemData={itemData} />
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
                {/* <button className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium flex items-center gap-2">
                  <FaUndo />
                  Return
                </button> */}
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
