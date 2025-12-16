import React from 'react';
import { Link } from "react-router-dom";

const CategoryCard = ({ name, count, icon }) => {
  return (
    <Link 
      to={`/productlist?category=${encodeURIComponent(name)}`} 
      className="group block"
    >
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-md hover:border-blue-200 transition-all cursor-pointer h-full">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
          {/* Render the passed Icon component */}
          {icon}
        </div>
        <span className="font-bold text-slate-800 text-sm mb-1 text-center">{name}</span>
        {/* Optional: Show item count if available */}
        {count !== undefined && (
           <span className="text-xs text-slate-400 font-medium">{count} items</span>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;