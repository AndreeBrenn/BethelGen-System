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
  FaTimesCircle,
} from "react-icons/fa";
import moment from "moment";
import { GiPayMoney } from "react-icons/gi";
import { handleApiError } from "../../utils/HandleError";
import usePrivateAxios from "../../hooks/useProtectedAxios";
import { decodedUser } from "../../utils/GlobalVariables";
import { MdLocalShipping, MdWarehouse } from "react-icons/md";

const InventoryManageRequestModal = ({
  requestData,
  onClose,
  onApprove,
  onReturn,
  onReject,
}) => {
  const [amount, setAmount] = useState(0);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [signatories, setSignatories] = useState([]);
  const [notes, setNotes] = useState("");

  const [distributionMethod, setDistributionMethod] = useState(1);

  const [signatoriesSelected, setSignatoriesSelected] = useState([]);

  const axiosPrivate = usePrivateAxios();

  const user = decodedUser();

  const allowedButtons = () => {
    if (!requestData.Item_signatories) return true;

    const orderCount = requestData.Item_signatories.filter(
      (fil) => fil.Status == "Approved"
    );
    const userApprover = requestData.Item_signatories.filter(
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

  const update_request = async (e) => {
    e.preventDefault();
    try {
      if (!requestData.Item_signatories) {
        const data = {
          ID: requestData.ID,
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
          Item_amount: amount,
        };

        const res = await axiosPrivate.put("/inventory/update-request", data);
        alert("Data Updated");
        return;
      }

      const newSignatory = requestData.Item_signatories.filter(
        (fil) => fil.ID != user.ID
      );

      const data = {
        ID: requestData.ID,
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
            Order: newSignatory[0].Order,
          },
        ],
      };

      const res = await axiosPrivate.put("/inventory/update-request", data);

      alert("Data Updated!");
    } catch (error) {
      console.log(error);
      handleApiError(error);
    }
  };

  const handleReturn = () => {
    const data = {
      notes: notes,
      action: "returned",
    };
    console.log("Return:", data);
    onReturn && onReturn(data);
  };

  const handleReject = () => {
    const data = {
      notes: notes,
      action: "rejected",
    };
    console.log("Reject:", data);
    onReject && onReject(data);
  };

  const get_all_users = useCallback(async () => {
    try {
      const res = await axiosPrivate.get("/users/get-all-users");

      setSignatories(res.data);
    } catch (error) {
      handleApiError(error);
    }
  }, []);

  useEffect(() => {
    get_all_users();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                    <p className="font-semibold">{requestData?.ID}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {requestData?.Item_status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Item Name</p>
                    <p className="font-semibold">{requestData?.Item_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quantity</p>
                    <p className="font-semibold">
                      {requestData?.Item_quantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Requester</p>
                    <p className="font-semibold">
                      {`${requestData.Item_userID.FirstName} ${requestData.Item_userID.LastName}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-semibold">
                      {requestData?.Item_userID?.Department}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-semibold">
                      {requestData?.Item_category}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Subcategory</p>
                    <p className="font-semibold">
                      {requestData?.Item_subcategory}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 ">Description</p>
                    <p className="font-semibold">
                      {requestData?.Item_description}
                    </p>
                  </div>
                </div>
              </div>

              {requestData.Item_signatories?.filter(
                (fil) => fil.Status == "Pending"
              ).length == 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MdWarehouse className="text-blue-600" />
                    Distribution
                  </h3>

                  <div className="flex gap-6 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        onChange={(e) => setDistributionMethod(1)}
                        checked={distributionMethod == 1}
                        type="radio"
                        className="cursor-pointer"
                      />
                      <span className="text-gray-700">Manual Quantity</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        onChange={(e) => setDistributionMethod(2)}
                        checked={distributionMethod == 2}
                        type="radio"
                        className="cursor-pointer"
                      />
                      <span className="text-gray-700">Serial Number Range</span>
                    </label>
                  </div>

                  {distributionMethod == 1 ? (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Quantity
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Initial Range
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Final Range
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!requestData.Item_amount && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <GiPayMoney className="text-blue-600" />
                    Amount
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* Assign Signatories */}
              {!requestData.Item_signatories && (
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
                          //  onChange={handleImageUpload}
                          className="hidden"
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
                       
                            bg-green-500 text-white
                        
                          `}
                      >
                        <FaCheckCircle />
                      </div>
                      {
                        <div
                          className={`w-0.5 h-16
                              bg-green-500
                            `}
                        />
                      }
                    </div>
                    <div className="flex-1 pb-8">
                      <p className="font-semibold text-gray-900">Submitted</p>
                      <p className="text-sm text-gray-600">
                        {requestData.Item_userID.FirstName +
                          " " +
                          requestData.Item_userID.LastName}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {moment(requestData.createdAt).format(
                          "YYYY-MM-DD hh:mm A"
                        )}
                      </p>
                    </div>
                  </div>
                  {requestData.Item_signatories?.sort(
                    (a, b) => a?.Order - b?.Order
                  ).map((item, index) => (
                    <div key={item.ID} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.Status == "Approved"
                              ? "bg-green-500 text-white"
                              : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {item.Status == "Approved" ? (
                            <FaCheckCircle />
                          ) : (
                            <FaClock />
                          )}
                        </div>

                        <div
                          className={`w-0.5 h-16 ${
                            item.Status == "Approved"
                              ? "bg-green-500"
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
                  onClick={handleReject}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                >
                  <FaBan />
                  Reject
                </button>
                <button
                  onClick={handleReturn}
                  className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium flex items-center gap-2"
                >
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

            {requestData?.Item_signatories?.filter(
              (fil) => fil.Status == "Pending"
            ).length == 0 && (
              <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2">
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
