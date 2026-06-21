const AuctionCard = ({ itemTitle, startingBid, images }) => {
  return (
    <div className="card-3d bg-slate-900 rounded-2xl overflow-hidden border border-slate-800/80 shadow-3d-elevated group flex flex-col h-full hover:border-indigo-500/30">
      {/* Image Container with Gradient Overlay */}
      <div className="relative h-48 overflow-hidden">
        <img 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
          src={images[0]} 
          alt={itemTitle} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60"></div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-slate-900/50">
        {/* Title */}
        <h3 className="font-bold text-lg text-white group-hover:text-teal-300 transition-colors line-clamp-2 leading-snug">
          {itemTitle}
        </h3>

        {/* Starting Bid & Interactive Highlight */}
        <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-800/60">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Starting Bid</span>
          <span className="text-teal-300 font-extrabold text-lg bg-teal-950/40 border border-teal-500/30 px-3 py-1 rounded-xl shadow-inner">
            ${startingBid}
          </span>
        </div>
      </div>
    </div>
    // </Link>
  );
};

export default AuctionCard;
