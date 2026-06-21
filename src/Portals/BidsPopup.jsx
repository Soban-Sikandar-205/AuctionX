import React from 'react'
import ReactDom from 'react-dom'

function BidsPopup({ open, onClose, currentItem }) {
  if (!open) return null

  return ReactDom.createPortal(
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Bids
        </h2>
        {currentItem?.recentBids &&
          Object.values(currentItem.recentBids).length > 0 ? (
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {Object.values(currentItem.recentBids)
              .reverse()
              .map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-100 border border-gray-300 p-4 rounded-md shadow-sm"
                >
                  <p className="text-sm text-gray-700 font-semibold">
                    Bidder: <span className="text-indigo-600">{item.userName || item.user}</span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Bid: <span className="font-bold text-teal-600">${item.bid}</span>
                  </p>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500">No bids have been placed yet.</p>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('show-bid-portal')
  )
}

export default BidsPopup
