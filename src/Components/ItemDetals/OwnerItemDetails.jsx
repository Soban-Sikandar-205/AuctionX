import React, { useState } from 'react'
import ConfirmPopup from "../../Portals/ConfirmPopup";
import BidsPopup from "../../Portals/BidsPopup";
import { useNavigate } from 'react-router-dom';
import { deleteItem, handleWinner, retrieveItems } from '../../redux/itemActions';
import { useDispatch } from 'react-redux';
import Spinner from '../utils/Spinner';

function OwnerItemDetails({ currentItem, itemId, haveWinner, setHaveWinner }) {
  const [isModelOpen, setisModelOpen] = useState(false);
  const [isBidModelOpen, setisBidModelOpen] = useState(false);
  const [errormsg, setErrorMsg] = useState('')
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [endAuctLoading, setendAuctLaoding] = useState(false)


  const handleDelete = async () => {
    try {
      await deleteItem(itemId, currentItem.category);
      navigate("/myitems");
      alert("Deleted Successfully");
      setErrorMsg('')
    } catch (err) {
      setErrorMsg(err)
    }
  };

  const endAuctionHandler = async () => {
    try {
      setendAuctLaoding(true)
      const bids = currentItem.recentBids ? Object.values(currentItem.recentBids) : [];
      let winner;
      if (bids.length > 0) {
        winner = bids.slice(-1)[0];
      } else {
        winner = {
          item: itemId,
          user: 'none',
          userName: 'No Bids',
          bid: 0,
          owner: currentItem.itemOwner,
          category: currentItem.category,
          status: 'expired_no_bids'
        };
      }
      await handleWinner(winner, currentItem.category)
      setHaveWinner(true)
      setendAuctLaoding(false)
      setErrorMsg('')
    }
    catch (error) {
      setendAuctLaoding(false)
      setErrorMsg(error.message || error)
    }
  }


  return (
    <>
      {/* Edit and Delete Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() =>
            navigate(`/editItem/${itemId}`, { state: currentItem })
          }
          className="px-4 py-2 text-white font-bold rounded-xl transition-all duration-150 bg-gradient-to-r from-amber-500 to-yellow-500 border-b-4 border-amber-700 hover:from-amber-400 hover:to-yellow-400 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 text-sm shadow-md"
        >
          Edit Details
        </button>

        <button
          onClick={() => setisModelOpen(true)}
          className="px-4 py-2 text-white font-bold rounded-xl btn-3d-danger text-sm"
        >
          Delete Item
        </button>

        <button
          onClick={endAuctionHandler}
          className={`px-4 py-2 font-bold rounded-xl text-sm ${
            currentItem.winner 
              ? 'bg-slate-800/80 border-slate-700/50 text-slate-500 cursor-not-allowed border-b-2' 
              : 'text-white btn-3d-danger'
          }`}
          disabled={!!currentItem?.winner}
        >
          {endAuctLoading ? <Spinner /> : 'End Auction'} 
        </button>
      </div>

      <ConfirmPopup
        open={isModelOpen}
        onClose={() => setisModelOpen(false)}
        deleteItem={handleDelete}
      />

      <div className="flex justify-between items-center mt-8 mb-4">
        <h3 className="text-lg font-bold text-white tracking-tight">Recent Bids</h3>
        <button
          className="px-3 py-1.5 bg-slate-800 border-b-4 border-slate-950 text-slate-200 hover:bg-slate-750 hover:text-white active:translate-y-0.5 active:border-b-2 text-xs font-bold rounded-xl transition-all duration-150"
          onClick={() => {
            dispatch(retrieveItems());
          }}
        >
          Reload
        </button>
      </div>

      <div className="space-y-3">
        {haveWinner && (
          <span className="text-rose-400 font-bold block text-sm bg-rose-950/20 border border-rose-500/20 p-2.5 rounded-xl text-center">
            {currentItem?.winner && Object.values(currentItem.winner)[0]?.user === 'none'
              ? "⏳ Auction ended with no bids."
              : "🏆 Winner has been declared!"}
          </span>
        )}
        {currentItem?.recentBids &&
          Object.values(currentItem.recentBids).length > 0 ? (
          Object.values(currentItem.recentBids)
            .slice(-3)
            .reverse()
            .map((item, index) => (
              <div
                key={index}
                className="bg-slate-950/40 border border-slate-800/60 p-4 rounded-xl flex justify-between items-center shadow-inner"
              >
                <div>
                  <span className="text-slate-400 text-xs block uppercase tracking-wider mb-0.5">Bidder</span>
                  <span className="text-indigo-400 font-semibold text-sm">{item.userName || item.user}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-xs block uppercase tracking-wider mb-0.5">Amount</span>
                  <span className="font-extrabold text-teal-300 text-sm bg-teal-950/30 border border-teal-500/20 px-2.5 py-0.5 rounded-lg shadow-inner">
                    ${item.bid}
                  </span>
                </div>
              </div>
            ))
        ) : (
          <p className="text-slate-500 text-sm italic">No bids have been placed yet.</p>
        )}
        
        <button
          onClick={() => setisBidModelOpen(true)}
          className="px-4 py-3 text-white font-bold rounded-xl btn-3d-primary w-full text-sm mt-4"
        >
          Show All Bids
        </button>

        <BidsPopup
          open={isBidModelOpen}
          onClose={() => setisBidModelOpen(false)}
          currentItem={currentItem}
        />
      </div>
      {errormsg && (
        <p className="text-rose-400 text-sm mt-3 bg-red-950/20 border border-red-500/20 p-2.5 rounded-xl text-center">{errormsg}</p>
      )}
    </>
  )
}

export default OwnerItemDetails
