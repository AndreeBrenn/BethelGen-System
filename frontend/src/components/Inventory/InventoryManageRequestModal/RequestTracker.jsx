import moment from "moment";
import React from "react";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaVoteYea,
} from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";

const RequestTracker = ({ itemData }) => {
  return (
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
                {moment(itemData.createdAt).format("YYYY-MM-DD hh:mm A")}
              </p>
            </div>
          </div>
          {itemData.Item_signatories?.sort((a, b) => a?.Order - b?.Order).map(
            (item, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.Status == "Approved" || item.Status == "Received"
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
                      item.Status == "Approved" || item.Status == "Received"
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
                  <p className="font-semibold text-gray-900">{item.Status}</p>
                  <p className="text-sm text-gray-600">{item.Name}</p>
                  {item.Date && (
                    <p className="text-xs text-gray-500 mt-1">
                      {moment(item.Date).format("YYYY-MM-DD hh:mm A")}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{item.note}</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestTracker;
