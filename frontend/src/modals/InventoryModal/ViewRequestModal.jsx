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
  FaTruck,
  FaVoteYea,
  FaBoxOpen,
} from "react-icons/fa";
import { MdPending } from "react-icons/md";
import { decodedUser } from "../../utils/GlobalVariables";
import { handleApiError } from "../../utils/HandleError";
import usePrivateAxios from "../../hooks/useProtectedAxios";
import moment from "moment";

const ViewRequestModal = ({ setViewRequestModal, requestData }) => {
  // Sample data structure - replace with your actual data

  const data = requestData || sampleData;

  const axiosPrivate = usePrivateAxios();
  const user = decodedUser();

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <FaCheckCircle className="text-green-500 text-2xl" />;
      case "Rejected":
        return <FaTimesCircle className="text-red-500 text-2xl" />;
      case "Pending":
        return <MdPending className="text-yellow-500 text-2xl" />;
      case "Submitted":
        return <FaVoteYea className="text-blue-500 text-2xl" />;
      case "Shipped":
        return <FaTruck className="text-blue-500 text-2xl" />;
      case "Received":
        return <FaBoxOpen className="text-green-500 text-2xl" />;
      default:
        return <FaClock className="text-gray-400 text-2xl" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-50 border-green-200";
      case "Received":
        return "bg-green-50 border-green-200";
      case "Rejected":
        return "bg-red-50 border-red-200";
      case "Pending":
        return "bg-yellow-50 border-yellow-200";
      case "Submitted":
        return "bg-blue-50 border-blue-200";
      case "Shipped":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Submitted: "bg-blue-100 text-blue-800",
      Received: "bg-green-100 text-green-800",
      Shipped: "bg-blue-100 text-blue-800",
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

  const receivedItem = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosPrivate.put("/inventory/update-request", {
        Item_value: JSON.stringify(data.Item_value),
        Item_signatories: JSON.stringify([
          ...data.Item_signatories,
          {
            ID: user.ID,
            Date: moment(),
            Name: data.Item_userID.FirstName + " " + data.Item_userID.LastName,
            Position: data.Item_userID.Position,
            Role: user.Role,
            Status: "Received",
            Order: data.Item_signatories.length,
            note: "",
          },
        ]),
        Item_status: "Received",
        ID: data.ID,
      });

      alert("Item Received");
    } catch (error) {
      handleApiError(error);
    }
  };

  console.log(requestData);

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
                    data.Item_status
                  )}`}
                >
                  {data.Item_status}
                </span>
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.Item_value?.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
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
                    </tr>
                  ))}
                </tbody>
              </table>
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
                    {getStatusIcon("Submitted")}
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 border rounded-lg p-4 ${getStatusColor(
                      "Submitted"
                    )}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-base">
                          {data.Item_userID.Position}
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
                          "Submitted"
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

                {data.Item_signatories?.sort((a, b) => a?.Order - b?.Order).map(
                  (signatory, index) => (
                    <div key={index} className="relative flex gap-4">
                      {/* Icon */}
                      <div className="relative z-10 flex-shrink-0">
                        {getStatusIcon(signatory.Status)}
                      </div>

                      {/* Content */}
                      <div
                        className={`flex-1 border rounded-lg p-4 ${getStatusColor(
                          signatory.Status
                        )}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-base">
                              {signatory.Position}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <FaUser className="text-gray-500 text-sm" />
                              <p className="text-sm text-gray-700">
                                {signatory.Name}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(
                              signatory.Status
                            )}`}
                          >
                            {signatory.Status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <FaCalendarAlt className="text-gray-500" />
                          <span>{formatDate(signatory.Date)}</span>
                        </div>

                        {signatory.note && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Remarks: </span>
                              {signatory.note}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
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
          {data.Item_status != "Received" && data.Item_status == "Shipped" && (
            <button
              onClick={(e) => receivedItem(e)}
              className="px-6 py-2 ml-3 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Received
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Example usage componen

export default ViewRequestModal;
