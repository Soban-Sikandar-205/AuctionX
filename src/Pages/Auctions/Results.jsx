import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { useDispatch, useSelector } from "react-redux";
import { retrieveItems } from "../../redux/itemActions";
import ParentCard from '../../Components/ItemCards/ParentCard'
import AuctionCard from "../../Components/ItemCards/AuctionCard";
import {Link} from  "react-router-dom";

function Results() {
  const { currentUser } = useContext(AuthContext);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(retrieveItems());
  }, [dispatch]);

  const ItemsInStore = Object.values(
    useSelector((state) => state.auctionDataReducer.auctionItems)
  ).flat();

  const currUserBidItems = ItemsInStore.filter((item) => {
    if (item.recentBids && Object.keys(item.recentBids).length > 0) {
      return Object.values(item.recentBids)
        .flat()
        .some((bidDetails) => bidDetails.user === currentUser.email);
    }

  });

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl lg:text-4xl font-extrabold text-center mt-10 mb-8 bg-gradient-to-r from-white via-slate-200 to-teal-300 bg-clip-text text-transparent tracking-tight">
        Your Bid Activity
      </h2>
    
      {currUserBidItems.length > 0 ? (
        <ParentCard>
          {currUserBidItems.map((item) => {
            const hasWinner = !!item.winner;
            const topBids = item.recentBids ? Object.values(item.recentBids).slice(-3).reverse() : [];
            const winnerData = hasWinner ? Object.values(item.winner)[0] : null;

            return (
            <Link
              key={item.key}
              to={`/allItems/${item.key}`}
              className="block p-1 rounded-2xl transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="relative">
                <AuctionCard
                  id={item.key}
                  category={item.category}
                  itemOwner={item.itemOwner}
                  itemTitle={item.itemTitle}
                  description={item.description}
                  startingBid={item.startingBid}
                  images={item.imgUrls}
                />
                {hasWinner && winnerData && (
                  <div className="mt-3 bg-slate-900/90 p-4 rounded-xl border border-teal-500/30 shadow-inner">
                    <h4 className="text-teal-400 font-bold mb-3 flex items-center gap-2 bg-teal-950/30 p-2 rounded-lg border border-teal-500/20">
                      <span>🏆</span> Winner: {winnerData.userName || winnerData.user}
                    </h4>
                    <div className="text-sm text-slate-300">
                      <p className="font-bold text-slate-400 mb-2 border-b border-slate-700/50 pb-1 uppercase tracking-wider text-[10px]">Top Bidders</p>
                      <div className="space-y-1.5">
                        {topBids.map((bid, i) => (
                          <div key={i} className="flex justify-between items-center bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-800">
                            <span className="text-indigo-300 font-semibold">{i + 1}. {bid.userName || bid.user}</span>
                            <span className="text-teal-300 font-extrabold">${bid.bid}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Link>
            )
          })}
        </ParentCard>
      ) : (
        <div className="flex justify-center items-center h-[50vh] bg-slate-900/40 border border-slate-800/60 rounded-2xl max-w-xl mx-auto my-12 shadow-inner">
          <p className="text-lg font-bold text-rose-400 bg-rose-950/20 border border-rose-500/20 px-6 py-3 rounded-xl">No Items Found</p>
        </div>
      )}
    </div>
  );
}

export default Results;
