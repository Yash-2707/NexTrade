import React from "react";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom"; // ✅ Import Link

const ProductCard = ({ product }) => {
  // Guard clause in case product data isn't ready yet
  if (!product) return null;

  return (
    // ✅ Wrap the entire card in a Link to make it clickable
    <Link to={`/product/${product._id}`} className="group block h-full">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">

        {/* ✅ Image Container - Used aspect ratio for perfect fit across devices */}
        <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
          <img
            src={
              product.images && product.images[0]
                ? product.images[0].url
                : "https://via.placeholder.com/400x300?text=No+Image"
            }
            alt={product.title}
            // object-cover: Ensures image fills the 4/3 aspect ratio completely
            // object-center: Centers the focal point
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {/* Condition Badge overlay */}
          {product.condition && (
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wide rounded">
              {product.condition}
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Category */}
          <div className="mb-2">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full capitalize">
              {product.category || "Item"}
            </span>
          </div>

          {/* Title - Truncated to 1 line */}
          <h3 className="text-slate-900 font-bold text-lg mb-1 truncate leading-tight group-hover:text-blue-600 transition-colors capitalize">
            {product.title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-slate-400 text-xs mb-3">
            <MapPin size={12} className="mr-1 flex-shrink-0" />
            <span className="truncate">{product.location || "Unknown Location"}</span>
          </div>

          {/* Price & View Details pushed to bottom */}
          <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-xl font-extrabold text-slate-900">
              ₹{Number(product.price).toLocaleString()}
            </span>
            {/* This text is now just visual, as the whole card is a link */}
            <span className="text-xs font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
              View Details &rarr;
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;