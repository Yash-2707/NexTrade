import React from 'react';
import { Link } from "react-router-dom";

const CategoryCard = ({ name, count, icon }) => {
  return (
    <Link 
      to={`/productlist?category=${encodeURIComponent(name)}`} 
      className="group block h-full"
    >
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center h-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 hover:border-blue-200 hover:-translate-y-1">
        
        {/* Icon Container - Fixed size for alignment */}
        <div className="w-14 h-14 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
          {/* We assume 'icon' is a React Node (like <Car />) */}
          {icon}
        </div>
        
        {/* Category Name */}
        <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        
        {/* Item Count (Optional) */}
        {count !== undefined && (
          <span className="text-xs text-slate-400 font-medium">
            {count} {count === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;