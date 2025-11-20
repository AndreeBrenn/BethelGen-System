import React, { useState } from "react";
import { RiBuilding4Fill } from "react-icons/ri";
import { handleApiError, toastObjects } from "../../utils/HandleError";
import usePrivateAxios from "../../hooks/useProtectedAxios";
import { toast } from "react-toastify";

const AddBranchModal = ({ setBranchModal, trigger }) => {
  const [branchName, setBranchName] = useState("");

  const axiosPrivate = usePrivateAxios();

  const submit_branch = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosPrivate.post("/branch/create-branch", {
        Branch_name: branchName,
      });

      setBranchName("");
      setBranchModal(false);
      trigger();
      toast.success("Branch Added", toastObjects);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <form
        onSubmit={submit_branch}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-xl text-white">
                <RiBuilding4Fill />
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Create Branch
              </h2>
              <p className="text-sm text-slate-500">
                Add a new branch to the system
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setBranchModal(false)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <span className="text-2xl text-slate-600">✕</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Branch Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              placeholder="Enter branch name"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 bg-slate-50">
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setBranchModal(false)}
              className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddBranchModal;
