import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { retrieveItems } from "../../redux/itemActions";
import ImageContainer from "../../Components/ItemDetals/ImageContainer";
import OwnerItemDetails from "../../Components/ItemDetals/OwnerItemDetails";
import NonOwnerDetails from "../../Components/ItemDetals/NonOwnerDetails";
import ChatWithOwnerButton from "../../Components/ItemDetals/ChatWithOwnerButton";
import Chat from '../../Components/chat/Chat'
import { AuthContext } from "../../context/AuthProvider";

function ItemDetails() {
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [currentBid, setCurrentBid] = useState(0);
  const [formattedDescription, setFormttedDescription] = useState("");
  const { auctionItems } = useSelector((state) => state.auctionDataReducer);
  const [showChat, setShowChat] = useState(false);
  const [haveWinner, setHaveWinner] = useState(false);

  const currentItem = Object.values(auctionItems)
    .flatMap((category) => category)
    .find((item) => item.key === itemId);

  const isOwner = currentUser && currentItem && currentItem.itemOwner === currentUser.email;

  useEffect(() => {
    dispatch(retrieveItems()).then(() => {
      setLoading(false);
    });
  }, [dispatch]);


  useEffect(() => {
    if (currentItem) {
      if (currentBid !== currentItem.startingBid) {
        setCurrentBid(currentItem.startingBid);
        setMainImage(currentItem.imgUrls ? currentItem.imgUrls[0] : "");
      }

      const descriptionText =
        currentItem?.description.length > 450
          ? currentItem?.description.slice(0, 400) + "... ..."
          : currentItem?.description;

      if (formattedDescription !== descriptionText) {
        setFormttedDescription(descriptionText);
      }

      if (!haveWinner && currentItem?.winner) {
        setHaveWinner(true);
      }
    }
  }, [currentItem, currentBid, formattedDescription, haveWinner]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-600">
        <p className="text-lg font-semibold text-gray-100">Loading...</p>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg font-semibold text-red-600">Item not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col lg:flex-row items-stretch h-full gap-6">
        {/* Main Image Section */}
        <ImageContainer
          mainImage={mainImage}
          currentItem={currentItem}
          setMainImage={setMainImage}
        />

        {/* Item Details Section */}
        <div className="w-full lg:w-1/2 mt-6 lg:mt-0 bg-slate-900 border border-slate-800/80 p-8 rounded-2xl shadow-3d-elevated flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight tracking-tight">
              {currentItem?.itemTitle}
            </h2>

            <p className="text-slate-400 text-sm mb-6 flex items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700/50 text-teal-400 font-medium text-xs">
                {currentItem?.category}
              </span>
            </p>
            
            <p className="text-slate-300 leading-relaxed mb-8">{formattedDescription}</p>

            <div className="flex flex-wrap justify-between items-center gap-4 py-4 px-5 bg-slate-950/40 border border-slate-800/60 rounded-xl mb-8">
              <div>
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">Current Bid</span>
                <span className="text-2xl text-teal-300 font-extrabold">${currentBid}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">Auction Status</span>
                <span className={`text-sm font-semibold ${new Date(currentItem?.auctionDuration) < new Date() || currentItem?.winner ? 'text-rose-400 bg-rose-950/20 px-2 py-0.5 rounded border border-rose-500/20' : 'text-indigo-300'}`}>
                  {currentItem?.winner 
                    ? 'Closed' 
                    : new Date(currentItem?.auctionDuration) < new Date() 
                    ? 'Expired' 
                    : new Date(currentItem?.auctionDuration).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
            </div>
          </div>

          {/* Conditional Rendering Based on Ownership */}
          <div className="mt-auto space-y-4">
            {isOwner ? (
              <OwnerItemDetails
                currentItem={currentItem}
                haveWinner={haveWinner}
                setHaveWinner={setHaveWinner}
                itemId={itemId}
              />
            ) : (
              <NonOwnerDetails
                currentItem={currentItem}
                itemId={itemId}
                currentBid={currentBid}
                setCurrentBid={setCurrentBid}
                haveWinner={haveWinner}
              />
            )}
            
            {haveWinner && currentItem?.winner &&
              Object.values(currentItem.winner)[0]?.user !== 'none' &&
              (Object?.values(currentItem?.winner)[0]?.user === currentUser?.email ||
                Object?.values(currentItem?.winner)[0]?.owner === currentUser?.email) &&
              <ChatWithOwnerButton
                isOwner={isOwner}
                onClick={() => setShowChat(true)}
              />}
          </div>

          {showChat && (
            <Chat
              itemId={itemId}
              currentUserId={currentUser.email}
              onClose={() => setShowChat(false)}
              category={currentItem.category}
            />
          )}
        </div>
      </div>
      
      {formattedDescription.length > 300 && (
        <div className="itemDescription mt-10 bg-slate-900/60 border border-slate-800/80 p-8 rounded-2xl shadow-3d-elevated">
          <h2 className="text-2xl font-bold text-white mb-4">
            Detailed Item Description
          </h2>
          <p className="text-slate-300 leading-relaxed text-base whitespace-pre-line">
            {currentItem?.description}
          </p>
        </div>
      )}

    </div>


  );
}

export default ItemDetails;
