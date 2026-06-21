import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useDispatch, useSelector } from "react-redux";
import { retrieveItems } from "../redux/itemActions";
import ParentCard from "../Components/ItemCards/ParentCard";
import AuctionCard from "../Components/ItemCards/AuctionCard";
import { Link, useLocation, useParams } from "react-router-dom";
import useSearch from "../context/searchContext";
import Loading from "../Components/utils/Loading";

function Home() {
  const { currentUser } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { cetagory } = useParams();
  const { searchQuery } = useSearch();
  const [loading, setloading] = useState(false)

  useEffect(() => {
    setloading(true)
    dispatch(retrieveItems()).finally(() => setloading(false));  }
    ,[dispatch]);

  const ItemsInStore = useSelector((state) => state.auctionDataReducer.auctionItems);

  const allItems = searchQuery
    ? Object.values(ItemsInStore).map((category) =>
      category.filter((item) =>
        item.itemTitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    : ItemsInStore;

    // console.log(allItems)

    if (loading) {
      return (
       <Loading />
      );
    }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl lg:text-4xl font-extrabold text-center mt-10 mb-8 bg-gradient-to-r from-white via-slate-200 to-teal-300 bg-clip-text text-transparent tracking-tight">
        Live Auctions
      </h2>
    
      {pathname === '/' ? (
        <ParentCard>
          {Object.values(allItems).map((category) =>
            category
              .filter((item) => currentUser && currentUser.email === 'admin@auctionex.com' ? true : item.itemOwner !== currentUser?.email)
              .map((item) => (
                <Link
                  key={item.key}
                  to={`/allItems/${item.key}`}
                  className="block p-1 rounded-2xl transition-all duration-300 hover:scale-[1.01]"
                >
                  <AuctionCard
                    id={item.key}
                    category={item.category}
                    itemOwner={item.itemOwner}
                    itemTitle={item.itemTitle}
                    description={item.description}
                    startingBid={item.startingBid}
                    images={item.imgUrls}
                  />
                </Link>
              ))
          )}
        </ParentCard>
      ) : allItems[cetagory] && allItems[cetagory].filter((item) => currentUser && currentUser.email === 'admin@auctionex.com' ? true : item.itemOwner !== currentUser?.email).length > 0 ? (
        <ParentCard>
          {allItems[cetagory]
            .filter((item) => currentUser && currentUser.email === 'admin@auctionex.com' ? true : item.itemOwner !== currentUser?.email)
            .map((item) => (
              <Link
                key={item.key}
                to={`/allItems/${item.key}`}
                className="block p-1 rounded-2xl transition-all duration-300 hover:scale-[1.01]"
              >
                <AuctionCard
                  id={item.key}
                  category={item.category}
                  itemOwner={item.itemOwner}
                  itemTitle={item.itemTitle}
                  description={item.description}
                  startingBid={item.startingBid}
                  images={item.imgUrls}
                />
              </Link>
            ))}
        </ParentCard>
      ) : (
        <div className="flex justify-center items-center h-[50vh] bg-slate-900/40 border border-slate-800/60 rounded-2xl max-w-xl mx-auto my-12 shadow-inner">
          <p className="text-lg font-bold text-rose-400 bg-rose-950/20 border border-rose-500/20 px-6 py-3 rounded-xl">No Items Found</p>
        </div>
      )
      }
      {searchQuery && allItems.flat().length === 0 && (
        <div className="flex flex-col justify-center items-center h-[50vh] bg-slate-900/40 border border-slate-800/60 rounded-3xl max-w-xl mx-auto my-12 p-8 text-center shadow-inner">
          <p className="text-xl font-bold text-slate-200">
            No search results for <span className="text-rose-400 bg-rose-950/20 px-2 py-0.5 rounded border border-rose-500/20">"{searchQuery}"</span>
          </p>
          <p className="text-sm text-slate-400 mt-3 max-w-xs">
            Try adjusting your spelling or explore one of the active categories.
          </p>
        </div>
      )}
    </div>
  );
}

export default Home;
