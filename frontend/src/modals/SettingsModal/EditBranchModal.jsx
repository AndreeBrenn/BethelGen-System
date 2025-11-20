import React from "react";
import { useState } from "react";
import { RiBuilding4Fill } from "react-icons/ri";
import { useLoading } from "../../hooks/useLoading";
import usePrivateAxios from "../../hooks/useProtectedAxios";
import { handleApiError, toastObjects } from "../../utils/HandleError";
import { toast } from "react-toastify";
import LottieAnimation from "../../utils/LottieAnimation";

const EditBranchModal = ({ trigger, branchData, setBranchEditModal }) => {
  const [inputFields, setInputFields] = useState({
    ID: branchData.ID,
    Branch_name: branchData.Branch_name,
  });

  const { loading, startLoading, stopLoading } = useLoading();
  const axiosPrivate = usePrivateAxios();

  const submit_edit = async (e) => {
    e.preventDefault();
    startLoading();

    try {
      const res = await axiosPrivate.put("/branch/edit-branch", inputFields);

      toast.success("Branch successfully updated", toastObjects);
      trigger();
      setBranchEditModal(null);
    } catch (error) {
      handleApiError(error);
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <form
        onSubmit={submit_edit}
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
                {branchData.Branch_name}
              </h2>
              <p className="text-sm text-slate-500">
                Edit the name of this branch
              </p>
            </div>
          </div>
          <button
            onClick={() => setBranchEditModal(null)}
            type="button"
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
              value={inputFields.Branch_name}
              onChange={(e) =>
                setInputFields({ ...inputFields, Branch_name: e.target.value })
              }
              required
              placeholder="Enter branch name"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 bg-slate-50">
          <div className="flex items-center justify-end space-x-3">
            <button
              disabled={loading}
              onClick={() => setBranchEditModal(null)}
              type="button"
              className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
            >
              {loading ? (
                <LottieAnimation
                  animationPath="/lottie/Spinner.json"
                  loop={true}
                  style={{ height: 20, width: 60 }}
                />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditBranchModal;
