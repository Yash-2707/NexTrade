import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Image as ImageIcon } from "lucide-react";

const ProductCard = ({ product }) => {
  if (!product) return null;

  // 1. Format Price (Indian Standard)
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <Link 
      to={`/product/${product._id}`} 
      className="group block h-full focus:outline-none"
    >
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-200 transition-all duration-300 flex flex-col h-full relative">
        
        {/* ====================
            IMAGE SECTION 
           ==================== */}
        <div className="relative w-full aspect-[4/3] bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
          
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0].url}
              alt={product.title}
              loading="lazy"
              className="w-full h-full object-contain object-center p-4 transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
            />
          ) : (
            // Fallback if no image
            <div className="text-slate-300 flex flex-col items-center">
              <ImageIcon size={40} />
              <span className="text-xs mt-1 font-medium">No Image</span>
            </div>
          )}

          {/* Condition Badge (Kept this as it is important info) */}
          <div className="absolute top-3 left-3">
            <span className={`text-[10px] font-bold px-2 py-1 rounded shadow-sm text-white uppercase tracking-wider ${
              product.condition === 'new' ? 'bg-green-500' : 'bg-slate-600'
            }`}>
              {product.condition}
            </span>
          </div>
        </div>

        {/* ====================
            CONTENT SECTION 
           ==================== */}
        <div className="p-4 flex flex-col flex-grow">
          
          {/* Category Tag */}
          <div className="mb-2">
            <span className="inline-block text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wide">
              {product.category || "General"}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-slate-800 font-bold text-lg leading-tight mb-1 truncate group-hover:text-blue-600 transition-colors capitalize">
            {product.title}
          </h3>

          {/* Location & Time */}
          <div className="flex items-center gap-3 text-slate-400 text-xs mb-4">
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              <span className="truncate max-w-[100px]">{product.location || "Online"}</span>
            </div>
            <div className="flex items-center gap-1">
               <Clock size={12} />
               <span>{new Date(product.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Footer: Price & Action */}
          <div className="mt-auto flex items-end justify-between pt-3 border-t border-slate-50">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-medium">Price</span>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                {formattedPrice}
              </span>
            </div>
            
            {/* Hover Arrow Effect */}
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <span className="text-lg font-bold">→</span>
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
};

export default ProductCard;