import React from 'react';
import ReactDom from 'react-dom';

function ConfirmPopup({ open, onClose, deleteItem }) {
  if (!open) return null;

  return ReactDom.createPortal(
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Are you sure you want to delete this?
        </h2>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={deleteItem}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('confrm-del-portal')
  );
}

export default ConfirmPopup;
