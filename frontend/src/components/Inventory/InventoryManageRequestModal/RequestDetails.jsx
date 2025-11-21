import React from "react";
import { getBranchName, useBranches } from "../../../zustand/Branches";

const RequestDetails = ({ itemData }) => {
  const branches = useBranches();

  return (
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
          <p className="font-semibold">{itemData?.Item_userID?.Department}</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-gray-600 ">Branch</p>
          <p className="font-semibold">
            {getBranchName(branches, itemData?.Item_branch)}
          </p>
        </div>

        <div className="col-span-2">
          <p className="text-sm text-gray-600 ">Description</p>
          <p className="font-semibold">{itemData?.Item_description}</p>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
