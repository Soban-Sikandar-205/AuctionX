import React from 'react'

function ImageContainer({currentItem, mainImage, setMainImage}) {

  return (
    <div className="w-full lg:w-1/2 bg-slate-900 border border-slate-800/80 p-6 rounded-2xl shadow-3d-elevated flex flex-col justify-between">
      {mainImage && (
        <div className="h-[450px] w-full flex justify-center items-center bg-slate-950/50 rounded-xl border border-slate-850 p-4 shadow-inner">
          <img
            src={mainImage}
            alt={currentItem?.itemTitle}
            className="object-contain max-w-full max-h-full rounded-lg shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>
      )}

      {/* Thumbnail Images */}
      {currentItem?.imgUrls && currentItem.imgUrls.length > 1 && (
        <div className="flex justify-center mt-6 space-x-3 p-3 bg-slate-950/60 border border-slate-800/50 rounded-xl shadow-inner">
          {currentItem.imgUrls.slice(0, 3).map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Thumbnail-${index}`}
              onClick={() => setMainImage(url)}
              className={`w-16 h-16 object-cover cursor-pointer border-2 rounded-xl transition duration-200 ease-in-out transform ${
                mainImage === url
                  ? "border-teal-400 scale-105 shadow-[0_0_10px_rgba(20,184,166,0.3)]"
                  : "border-slate-800 hover:border-indigo-500/50 hover:scale-102"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageContainer
