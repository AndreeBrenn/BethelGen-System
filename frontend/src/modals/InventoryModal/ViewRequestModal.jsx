import React from "react";
import {
  FaTimes,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClipboardList,
} from "react-icons/fa";
import { MdPending } from "react-icons/md";

const ViewRequestModal = ({ setViewRequestModal, requestData }) => {
  // Sample data structure - replace with your actual data
  const sampleData = {
    ID: 1,
    Item_name: "Laptop Dell Inspiron 15",
    Item_description:
      "High-performance laptop for development work with 16GB RAM and 512GB SSD",
    Item_branch: "IT Department - Main Office",
    Item_status: "Approved",
    item_signatories: [
      {
        role: "Requester",
        name: "John Doe",
        status: "submitted",
        date: "2024-10-15T08:30:00",
        remarks: "Urgent need for development project",
      },
      {
        role: "Department Head",
        name: "Jane Smith",
        status: "approved",
        date: "2024-10-16T10:15:00",
        remarks: "Approved - Valid business requirement",
      },
      {
        role: "Vice President",
        name: "Michael Johnson",
        status: "approved",
        date: "2024-10-17T14:20:00",
        remarks: "Budget verified and approved",
      },
      {
        role: "President",
        name: "Sarah Williams",
        status: "pending",
        date: null,
        remarks: null,
      },
    ],
  };

  const data = requestData || sampleData;

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <FaCheckCircle className="text-green-500 text-2xl" />;
      case "rejected":
        return <FaTimesCircle className="text-red-500 text-2xl" />;
      case "pending":
        return <MdPending className="text-yellow-500 text-2xl" />;
      case "submitted":
        return <FaCheckCircle className="text-blue-500 text-2xl" />;
      default:
        return <FaClock className="text-gray-400 text-2xl" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-50 border-green-200";
      case "rejected":
        return "bg-red-50 border-red-200";
      case "pending":
        return "bg-yellow-50 border-yellow-200";
      case "submitted":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      submitted: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Pending";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">
              Request Tracker
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Track the progress of your item request
            </p>
          </div>
          <button
            onClick={() => setViewRequestModal(null)}
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

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* Request Details Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaClipboardList className="text-blue-600" />
              Request Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Request ID</p>
                <p className="font-semibold text-gray-900">#{data.ID}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                    data.Item_status.toLowerCase()
                  )}`}
                >
                  {data.Item_status}
                </span>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Item Name</p>
                <p className="font-semibold text-gray-900">{data.Item_name}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-gray-700">{data.Item_description}</p>
              </div>
              <div className="md:col-span-2 flex items-center gap-2 text-gray-700">
                <FaMapMarkerAlt className="text-blue-600" />
                <span>{data.Item_branch}</span>
              </div>
            </div>
          </div>

          {/* Timeline/Journey */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Approval Journey
            </h3>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              {/* Timeline items */}
              <div className="space-y-6">
                <div className="relative flex gap-4">
                  {/* Icon */}
                  <div className="relative z-10 flex-shrink-0">
                    {getStatusIcon("submitted")}
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 border rounded-lg p-4 ${getStatusColor(
                      "submitted"
                    )}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-base">
                          {data.Item_userID.Role}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <FaUser className="text-gray-500 text-sm" />
                          <p className="text-sm text-gray-700">
                            {data.Item_userID.FirstName +
                              " " +
                              data.Item_userID.LastName}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(
                          "submitted"
                        )}`}
                      >
                        Submitted
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <FaCalendarAlt className="text-gray-500" />
                      <span>{formatDate(data.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {data.Item_signatories?.map((signatory, index) => (
                  <div key={index} className="relative flex gap-4">
                    {/* Icon */}
                    <div className="relative z-10 flex-shrink-0">
                      {getStatusIcon(signatory.status)}
                    </div>

                    {/* Content */}
                    <div
                      className={`flex-1 border rounded-lg p-4 ${getStatusColor(
                        signatory.status
                      )}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-base">
                            {signatory.role}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <FaUser className="text-gray-500 text-sm" />
                            <p className="text-sm text-gray-700">
                              {signatory.name}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(
                            signatory.status
                          )}`}
                        >
                          {signatory.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <FaCalendarAlt className="text-gray-500" />
                        <span>{formatDate(signatory.date)}</span>
                      </div>

                      {signatory.remarks && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Remarks: </span>
                            {signatory.remarks}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end border-t border-gray-200">
          <button
            onClick={() => setViewRequestModal(null)}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Example usage componen

export default ViewRequestModal;
