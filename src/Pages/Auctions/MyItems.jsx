import React, { useContext, useEffect } from 'react'
import { AuthContext } from "../../context/AuthProvider";
import ParentCard from '../../Components/ItemCards/ParentCard';
import AuctionCard from '../../Components/ItemCards/AuctionCard';
import { useSelector, useDispatch } from 'react-redux';
import { retrieveItems } from "../../redux/itemActions"
import { Link } from 'react-router-dom';
import useSearch from '../../context/searchContext';


function MyItems() {
  const { currentUser } = useContext(AuthContext)
  const dispatch = useDispatch()
  const { searchQuery } = useSearch()
  useEffect(() => {
    dispatch(retrieveItems())
  }, [dispatch])

  const ItemsInStore = useSelector((state) => state.auctionDataReducer.auctionItems)
  const allItems = searchQuery && Object.values(ItemsInStore).map((category) =>
    category.filter((item) => item.itemTitle.includes(searchQuery.toLowerCase()))) || ItemsInStore
  return (
    <>
    <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 text-center my-4">My Items</h2>
  
    <ParentCard className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {Object.values(allItems).map((category) => 
        category
          .filter((item) => item.itemOwner === currentUser.email)
          .map((item) => (
            <Link key={item.key} to={`/myItems/${item.key}`} className="block hover:bg-gray-100 transition-colors duration-200 p-2 rounded-lg">
              <AuctionCard
                itemTitle={item.itemTitle}
                startingBid={item.startingBid}
                images={item.imgUrls}
                className="shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
              />
            </Link>
          ))
      )}
    </ParentCard>
  </>
  
  )
}

export default MyItems
