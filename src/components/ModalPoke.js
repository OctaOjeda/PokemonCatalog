import React from "react";

const ModalPoke = ({ isOpen, onClose, onConfirm, mensaje }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white border-2 border-purple-600 rounded-2xl shadow-xl p-6 w-full max-w-md text-black">
        <h2 className="text-xl font-bold mb-4 text-purple-600 text-center">
          Confirm
        </h2>
        <p className="text-center mb-6">{mensaje}</p>

        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPoke;