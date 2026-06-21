import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { postItem, editItem } from "../../redux/itemActions";
import { AuthContext } from "../../context/AuthProvider";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const auctionSchema = () =>
  z.object({
    itemTitle: z
      .string()
      .min(3, "Item title must be at least 3 characters long"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters long"),
    startingBid: z.number().positive("Starting bid must be a positive number"),
    auctionDuration: z
      .string()
      .nonempty("Please select a valid auction duration"),
    category: z.enum([
      "Electronics",
      "Clothing",
      "Furniture",
      "Books",
      "Other",
    ]),
    imageUrls: z
      .string()
      .min(1, "Please provide at least one image URL")
      .refine(
        (val) => {
          const urls = val.split(",").map((u) => u.trim());
          return urls.every((u) => u.startsWith("http://") || u.startsWith("https://"));
        },
        "Please enter valid URLs starting with http:// or https://"
      ),
  });

const AuctionForm = () => {
  const { pathname, state } = useLocation();
  const itemId = useParams();
  const isEditMode = pathname.includes("editItem");

  // console.log(pathname, state)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      itemTitle: state?.itemTitle || "",
      description: state?.description || "",
      startingBid: state?.startingBid || "",
      auctionDuration: state?.auctionDuration || "",
      category: state?.category || "",
      imageUrls: state?.imgUrls ? state.imgUrls.join(", ") : "",
    },
    resolver: zodResolver(auctionSchema()),
  });
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [postmsg, setpostMsg] = useState("");

  const onSubmit = async (data) => {
    try {
      setpostMsg("");
      const imgUrls = data.imageUrls
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean);
      delete data.imageUrls;
      const { ...rest } = data;
      const finalData = { ...rest, imgUrls };

      if (pathname.includes("listitem")) {
        await postItem({
          itemOwner: currentUser.email,
          ...finalData,
        });
        navigate("/myitems");
      } else {
        await editItem(itemId.id, finalData);
        navigate("/myitems");
      }
    } catch (err) {
      setpostMsg(err.message || "Could not save the item. Please check your Firebase Storage and Database configuration.");
    }
  };

  const imageUrlsValue = watch("imageUrls", "");
  const previewUrls = imageUrlsValue
    ? imageUrlsValue
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url.startsWith("http://") || url.startsWith("https://"))
    : [];

  return (
    <div className="container mx-auto px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto my-10 p-8 bg-slate-900 border border-slate-800/80 rounded-2xl shadow-3d-elevated space-y-6"
      >
        <h2 className="text-2xl font-extrabold mb-6 border-b border-slate-850 pb-4 bg-gradient-to-r from-white via-slate-200 to-teal-300 bg-clip-text text-transparent tracking-tight">
          {isEditMode ? "Modify Listing" : "List New Item"}
        </h2>

        <div>
          <label className="block text-slate-300 font-bold mb-2 text-sm">
            Item Title
          </label>
          <input
            type="text"
            placeholder="Enter auction title"
            {...register("itemTitle")}
            className="w-full p-3.5 rounded-xl input-3d bg-slate-950/40 border-slate-700/50 text-slate-900 placeholder-slate-500 focus:outline-none text-sm"
          />
          {errors.itemTitle && (
            <p className="text-rose-400 text-xs mt-1 pl-1">{errors.itemTitle.message}</p>
          )}
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-2 text-sm">
            Description
          </label>
          <textarea
            placeholder="Describe the item details, history, condition..."
            {...register("description")}
            className="w-full p-3.5 rounded-xl input-3d bg-slate-950/40 border-slate-700/50 text-slate-900 placeholder-slate-500 focus:outline-none text-sm h-32"
          />
          {errors.description && (
            <p className="text-rose-400 text-xs mt-1 pl-1">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-slate-300 font-bold mb-2 text-sm">
              Starting Bid ($)
            </label>
            <input
              type="number"
              placeholder="e.g. 50"
              {...register("startingBid", { valueAsNumber: true })}
              className="w-full p-3.5 rounded-xl input-3d bg-slate-950/40 border-slate-700/50 text-slate-900 placeholder-slate-500 focus:outline-none text-sm"
            />
            {errors.startingBid && (
              <p className="text-rose-400 text-xs mt-1 pl-1">{errors.startingBid.message}</p>
            )}
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-2 text-sm">
              Auction Duration
            </label>
            <input
              type="datetime-local"
              {...register("auctionDuration")}
              className="w-full p-3.5 rounded-xl input-3d bg-slate-950/40 border-slate-700/50 text-slate-900 placeholder-slate-500 focus:outline-none text-sm"
            />
            {errors.auctionDuration && (
              <p className="text-rose-400 text-xs mt-1 pl-1">{errors.auctionDuration.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-2 text-sm">
            Category
          </label>
          <select
            {...register("category")}
            disabled={isEditMode}
            className="w-full p-3.5 rounded-xl input-3d bg-slate-950/40 border-slate-700/50 text-slate-900 focus:outline-none text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="" className="bg-slate-900">Select a category</option>
            <option value="Electronics" className="bg-slate-900">Electronics</option>
            <option value="Clothing" className="bg-slate-900">Clothing</option>
            <option value="Furniture" className="bg-slate-900">Furniture</option>
            <option value="Books" className="bg-slate-900">Books</option>
            <option value="Other" className="bg-slate-900">Other</option>
          </select>
          {errors.category && (
            <p className="text-rose-400 text-xs mt-1 pl-1">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-2 text-sm">Image URLs</label>
          <textarea
            placeholder="Enter image URLs (separated by commas)"
            {...register("imageUrls")}
            className="w-full p-3.5 rounded-xl input-3d bg-slate-950/40 border-slate-700/50 text-slate-900 placeholder-slate-500 focus:outline-none text-sm h-28"
          />
          <p className="text-slate-400 text-xs mt-1 pl-1">
            Provide direct web links to images starting with http:// or https://. Separate multiple links with commas.
          </p>
          {errors.imageUrls && (
            <p className="text-rose-400 text-xs mt-1 pl-1">{errors.imageUrls.message}</p>
          )}

          {previewUrls.length > 0 && (
            <div className="mt-4">
              <label className="block text-slate-400 font-bold mb-2 text-xs uppercase tracking-wider">
                Image Preview
              </label>
              <div className="flex flex-wrap gap-3 p-3 bg-slate-950/50 rounded-xl border border-slate-850/60 shadow-inner">
                {previewUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Preview ${index + 1}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/100x100?text=Invalid+URL";
                    }}
                    className="w-20 h-20 object-cover rounded-xl border border-slate-800 shadow-md hover:scale-105 transition-transform duration-200"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 flex flex-col items-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 text-white font-bold rounded-xl btn-3d-primary ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : isEditMode ? "Save Changes" : "Create Listing"}
          </button>
          {postmsg && <p className="text-rose-400 text-sm mt-3 bg-red-950/20 border border-red-500/20 py-2 px-4 rounded-xl text-center font-semibold">{postmsg}</p>}
        </div>
      </form>
    </div>
  );
};

export default AuctionForm;
