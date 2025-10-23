import React, { useState } from "react";
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

const InventoryManageRequestModal = ({
  requestData,
  onClose,
  onApprove,
  onReturn,
  onReject,
}) => {
  const [selectedSignatory1, setSelectedSignatory1] = useState("");
  const [selectedSignatory2, setSelectedSignatory2] = useState("");
  const [selectedSignatory3, setSelectedSignatory3] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [notes, setNotes] = useState("");

  // Sample signatories data
  const signatories = [
    { id: 1, name: "John Doe", role: "Department Head" },
    { id: 2, name: "Jane Smith", role: "Finance Manager" },
    { id: 3, name: "Mike Johnson", role: "General Manager" },
    { id: 4, name: "Sarah Williams", role: "CEO" },
  ];

  // Sample timeline/tracker data
  const timeline = [
    {
      status: "Submitted",
      date: "2025-10-20 10:30 AM",
      user: "John Doe",
      completed: true,
    },
    {
      status: "Reviewed by Dept Head",
      date: "2025-10-21 02:15 PM",
      user: "Jane Smith",
      completed: true,
    },
    {
      status: "Pending Finance Approval",
      date: "",
      user: "Mike Johnson",
      completed: false,
    },
    {
      status: "Final Approval",
      date: "",
      user: "Sarah Williams",
      completed: false,
    },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApprove = () => {
    const data = {
      signatory1: selectedSignatory1,
      signatory2: selectedSignatory2,
      signatory3: selectedSignatory3,
      image: uploadedImage,
      notes: notes,
      action: "approved",
    };
    console.log("Approve:", data);
    onApprove && onApprove(data);
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
                    <p className="font-semibold">
                      {requestData?.ID || "REQ-001"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {requestData?.Item_status || "Pending"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Item Name</p>
                    <p className="font-semibold">
                      {requestData?.Item_name || "Office Desk"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quantity</p>
                    <p className="font-semibold">
                      {requestData?.Item_quantity || "5"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Requester</p>
                    <p className="font-semibold">
                      {requestData?.Item_userID
                        ? `${requestData.Item_userID.FirstName} ${requestData.Item_userID.LastName}`
                        : "John Doe"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-semibold">
                      {requestData?.Item_userID?.Department || "IT Department"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Assign Signatories */}
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
                      value={selectedSignatory1}
                      onChange={(e) => setSelectedSignatory1(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select signatory</option>
                      {signatories.map((sig) => (
                        <option key={sig.id} value={sig.id}>
                          {sig.name} - {sig.role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Second Signatory
                    </label>
                    <select
                      value={selectedSignatory2}
                      onChange={(e) => setSelectedSignatory2(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select signatory</option>
                      {signatories.map((sig) => (
                        <option key={sig.id} value={sig.id}>
                          {sig.name} - {sig.role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Third Signatory (Optional)
                    </label>
                    <select
                      value={selectedSignatory3}
                      onChange={(e) => setSelectedSignatory3(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select signatory</option>
                      {signatories.map((sig) => (
                        <option key={sig.id} value={sig.id}>
                          {sig.name} - {sig.role}
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
                      onChange={handleImageUpload}
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
                  {timeline.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.completed
                              ? "bg-green-500 text-white"
                              : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {item.completed ? <FaCheckCircle /> : <FaClock />}
                        </div>
                        {index < timeline.length - 1 && (
                          <div
                            className={`w-0.5 h-16 ${
                              item.completed ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <p className="font-semibold text-gray-900">
                          {item.status}
                        </p>
                        <p className="text-sm text-gray-600">{item.user}</p>
                        {item.date && (
                          <p className="text-xs text-gray-500 mt-1">
                            {item.date}
                          </p>
                        )}
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
              onClick={handleApprove}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
            >
              <FaCheck />
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManageRequestModal;
