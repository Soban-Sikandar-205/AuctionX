import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider';
import { placeBid, retrieveItems } from '../../redux/itemActions';
import { useDispatch } from 'react-redux';
import Spinner from '../utils/Spinner';

function NonOwnerDetails({ currentItem, itemId, currentBid, setCurrentBid, haveWinner }) {
  const [bid, setBid] = useState("");
  const [bidError, setBidError] = useState("");
  const [bidPlaceMsg, setBidPlaceMsg] = useState("");
  const { currentUser, userData } = useContext(AuthContext);
  const [bidLoading, setbidLoading] = useState(false)
  const [reloading, setReloading] = useState(false)
  const dispatch = useDispatch()


  const handleBid = async () => {
    const bidValue = parseInt(bid);
    if (bidValue > currentBid) {
      setCurrentBid(bidValue);
      setBid("");
      setBidError("");
      setbidLoading(true)
      await placeBid(bidValue, itemId, currentUser.email, userData?.userName || 'Anonymous', currentItem.category, currentItem.itemOwner)
        .then(() => {
          setBidPlaceMsg("Bid Placed successfully")
          setbidLoading(false)
        })
        .catch(err => setBidError(err))

    } else {
      setBidError("Your bid must be higher than the current bid.");
      setBidPlaceMsg("");
    }
  };

  return (
    <div>
      {/* Place Bid Input and Button */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="number"
          value={bid}
          onChange={(e) => setBid(e.target.value)}
          placeholder={`Bid more than $${currentItem?.startingBid}`}
          className="flex-1 p-3.5 rounded-xl input-3d bg-slate-900/80 border-slate-700/60 text-slate-900 placeholder-slate-500 focus:outline-none text-sm"
        />
        <button
          onClick={handleBid}
          className={`py-3 px-6 text-white font-bold rounded-xl text-sm transition-all duration-150 shadow-md ${
            haveWinner 
              ? 'bg-slate-800/80 border-slate-700/50 text-slate-500 cursor-not-allowed border-b-2' 
              : 'btn-3d-teal'
          }`}
          disabled={haveWinner}
        >
          {bidLoading ? <Spinner /> : <span>Place Bid</span>}
        </button>
      </div>

      {/* Messages for Bid Placement */}
      <div className="space-y-2 mb-4">
        {bidPlaceMsg && (
          <p className="text-teal-400 bg-teal-950/20 border border-teal-500/20 py-2.5 px-4 rounded-xl text-sm font-semibold text-center shadow-inner">
            🎉 {bidPlaceMsg}
          </p>
        )}
        {bidError && (
          <p className="text-rose-400 bg-rose-950/20 border border-rose-500/20 py-2.5 px-4 rounded-xl text-sm font-semibold text-center shadow-inner">
            ⚠️ {bidError}
          </p>
        )}
      </div>

      {/* Show Recent Bids for Non-Owner */}
      <div className="flex justify-between items-center mt-8 mb-4">
        <h3 className="text-lg font-bold text-white tracking-tight">Recent Bids</h3>
        <button
          className="px-3 py-1.5 bg-slate-800 border-b-4 border-slate-950 text-slate-200 hover:bg-slate-750 hover:text-white active:translate-y-0.5 active:border-b-2 text-xs font-bold rounded-xl transition-all duration-150"
          onClick={() => {
            setReloading(true);
            dispatch(retrieveItems()).finally(() => setReloading(false));
            setBidPlaceMsg("");
          }}
        >
          {reloading ? <Spinner /> : <span>Reload</span>}
        </button>
      </div>

      <div className="space-y-3">
        {haveWinner && currentItem?.winner && (
          <div className="text-center">
            {Object.values(currentItem.winner)[0]?.user === 'none' ? (
              <span className="text-slate-400 font-medium block text-sm bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl">
                ⏳ Auction expired with no bids.
              </span>
            ) : Object.values(currentItem.winner)[0]?.user === currentUser.email ? (
              <span className="text-teal-400 font-extrabold block text-base bg-teal-950/20 border border-teal-500/20 p-4 rounded-xl shadow-md animate-pulse">
                👑 Congratulations! You've won the auction!
              </span>
            ) : (
              <span className="text-slate-400 font-medium block text-sm bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl">
                Winner Announced. Better Luck Next Time!
              </span>
            )}
          </div>
        )}

        {currentItem?.recentBids && Object.keys(currentItem.recentBids).length > 0 ? (
          Object.values(currentItem.recentBids)
            .slice(-3)
            .reverse()
            .map((item, index) => (
              <div
                key={index}
                className="bg-slate-950/40 border border-slate-800/60 p-4 rounded-xl flex justify-between items-center shadow-inner"
              >
                <div className="flex items-center">
                  <span className="text-slate-400 text-xs uppercase tracking-wider mr-2">Bidder:</span>
                  <span className="text-indigo-400 font-semibold text-sm truncate max-w-[150px]">{item.userName || item.user}</span>
                  {item.user === currentUser.email && (
                    <span className="text-teal-400 bg-teal-950 border border-teal-500/30 px-2 py-0.5 rounded text-[10px] ml-2 font-extrabold uppercase tracking-wide">
                      You
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-teal-300 text-sm bg-teal-950/30 border border-teal-500/20 px-2.5 py-0.5 rounded-lg shadow-inner">
                    ${item.bid}
                  </span>
                </div>
              </div>
            ))
        ) : (
          <p className="text-slate-500 text-sm italic">No recent bids available.</p>
        )}
      </div>
    </div>
  )
}

export default NonOwnerDetails
