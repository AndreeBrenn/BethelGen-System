import React, { useCallback, useEffect, useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import usePrivateAxios from "../../hooks/useProtectedAxios";
import { handleApiError, toastObjects } from "../../utils/HandleError";
import { toast } from "react-toastify";

const AddSignatoryModal = ({ setAddModalTab, signatories, trigger }) => {
  const [userData, setUserData] = useState([]);

  const [inputData, setInputData] = useState({
    User_ID: "",
    Name: "",
    Role: "",
    Position: "",
    Order: "",
  });

  const axiosPrivate = usePrivateAxios();

  const get_users = useCallback(async () => {
    try {
      const res = await axiosPrivate.get("/users/get-all-users");

      setUserData(res.data);
    } catch (error) {
      handleApiError(error);
    }
  });

  useEffect(() => {
    get_users();
  }, []);

  const submit_new_signatory = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosPrivate.post(
        "/signatories/create-signatory",
        inputData
      );

      toast.success("New Signatory Added", toastObjects);
      trigger();
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex items-center justify-center">
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Open Modal
      </button>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <form
          onSubmit={submit_new_signatory}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-xl text-white">➕</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Create Signatory
                </h2>
                <p className="text-sm text-slate-500">
                  Add a new user to add signature on the system
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAddModalTab(false)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <span className="text-2xl text-slate-600">✕</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                User <span className="text-red-500">*</span>
              </label>
              <select
                required
                onChange={(e) =>
                  setInputData({
                    User_ID: e.target.value,
                    Name: e.target.selectedOptions[0].dataset.name,
                    Role: e.target.selectedOptions[0].dataset.role,
                    Position: e.target.selectedOptions[0].dataset.position,
                    Order: signatories.length + 1,
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="" disabled selected>
                  Select User
                </option>
                {userData
                  .filter(
                    (fil) => !signatories.some((som) => fil.ID == som.User_ID)
                  )
                  .map((data) => (
                    <option
                      value={data.ID}
                      data-name={data.FirstName + " " + data.LastName}
                      data-role={data.Role}
                      data-position={data.Position}
                    >
                      {data.FirstName + " " + data.LastName}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 p-6 bg-slate-50">
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
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
    </div>
  );
};

export default AddSignatoryModal;
