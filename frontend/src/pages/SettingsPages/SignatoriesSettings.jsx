import React, { useCallback, useEffect, useState } from "react";
import { FaPenNib } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import AddSignatoryModal from "../../modals/SettingsModal/AddSignatoryModal";
import usePrivateAxios from "../../hooks/useProtectedAxios";
import { handleApiError, toastObjects } from "../../utils/HandleError";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

function DraggableSignatory({
  signatory,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
  removeSignatory,
}) {
  const getOrderLabel = (order) => {
    if (order === 1) return "1st Signatory";
    if (order === 2) return "2nd Signatory";
    if (order === 3) return "3rd Signatory";
    return `${order}th Signatory`;
  };

  return (
    <div
      draggable="true"
      onDragStart={(e) => onDragStart(e, signatory.Order)}
      onDragOver={(e) => onDragOver(e)}
      onDrop={(e) => onDrop(e, signatory.Order)}
      className={`bg-white border-2 border-slate-200 rounded-xl p-5 mb-3 transition-all ${
        isDragging
          ? "opacity-50 scale-95"
          : "opacity-100 hover:shadow-lg hover:border-slate-300"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="cursor-move text-slate-400 hover:text-slate-600 text-2xl">
          ☰
        </div>

        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
          {signatory.Name.charAt(0)}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-slate-800 text-lg">
            {signatory.Name}
          </h3>
          <p className="text-sm text-slate-500">{signatory.Position}</p>
        </div>

        <MdDelete
          onClick={(e) => removeSignatory(e, signatory.ID)}
          className="text-lg text-red-600 cursor-pointer"
        />
      </div>
    </div>
  );
}

const SignatoriesSettings = () => {
  const [addModalTab, setAddModalTab] = useState(false);
  const [signatories, setSignatories] = useState([]);

  const [draggedOrder, setDraggedOrder] = useState(null);

  const axiosPrivate = usePrivateAxios();

  // Sort signatories by order property
  const sortedSignatories = [...signatories].sort((a, b) => a.Order - b.Order);

  const handleDragStart = (e, order) => {
    setDraggedOrder(order);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, dropOrder) => {
    e.preventDefault();

    if (draggedOrder === null || draggedOrder === dropOrder) {
      setDraggedOrder(null);
      return;
    }

    try {
      const newSignatories = signatories.map((signatory) => {
        if (signatory.Order === draggedOrder) {
          return { ...signatory, Order: dropOrder };
        } else if (draggedOrder < dropOrder) {
          if (signatory.Order > draggedOrder && signatory.Order <= dropOrder) {
            return { ...signatory, Order: signatory.Order - 1 };
          }
        } else {
          if (signatory.Order >= dropOrder && signatory.Order < draggedOrder) {
            return { ...signatory, Order: signatory.Order + 1 };
          }
        }
        return signatory;
      });

      await axiosPrivate.put("/signatories/re-order-signatory", newSignatories);
      setSignatories(newSignatories);
      setDraggedOrder(null);
    } catch (error) {
      handleApiError(error);
    }
  };

  const get_signatories = useCallback(async () => {
    try {
      const res = await axiosPrivate.get("/signatories/get-all-signatory");

      setSignatories(res.data);
    } catch (error) {
      handleApiError(error);
    }
  }, []);

  useEffect(() => {
    get_signatories();
  }, [get_signatories]);

  const removeSignatory = async (e, ID) => {
    e.preventDefault();

    try {
      const res = axiosPrivate.delete(`/signatories/remove-signatory/${ID}`);

      toast.success("Signatory Deleted", toastObjects);
      get_signatories();
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ">
      <div className=" mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg text-white text-2xl">
                <FaPenNib />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  Signatory Management
                </h1>
                <p className="text-slate-500 mt-1">
                  Drag to reorder signing authority and hierarchy
                </p>
              </div>
            </div>
            <button
              onClick={() => setAddModalTab(!addModalTab)}
              className="flex items-center space-x-2 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors shadow-md font-medium"
            >
              <MdAdd className="text-xl" />
              <span>Add new Signatory</span>
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-blue-500 mt-0.5 text-xl">☰</div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                How to Reorder
              </h3>
              <p className="text-sm text-blue-700">
                Drag any signatory card by the grip icon to change their signing
                order. The first signatory has primary authority.
              </p>
            </div>
          </div>
        </div>

        {/* Signatories List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Signing Order
          </h2>
          <div>
            {sortedSignatories.map((signatory) => (
              <DraggableSignatory
                key={signatory.id}
                signatory={signatory}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isDragging={draggedOrder === signatory.order}
                removeSignatory={removeSignatory}
              />
            ))}
          </div>
        </div>
      </div>
      {addModalTab && (
        <AddSignatoryModal
          setAddModalTab={setAddModalTab}
          signatories={signatories}
          trigger={get_signatories}
        />
      )}
    </div>
  );
};

export default SignatoriesSettings;
