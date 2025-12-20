import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Logo = ({ className = "", variant = "default" }) => {
  // Define sizes based on variant
  const isLarge = variant === "large";
  
  const containerSize = isLarge ? "w-16 h-16" : "w-10 h-10";
  const iconSize = isLarge ? 32 : 24;
  const textSize = isLarge ? "text-4xl" : "text-2xl";
  const dotSize = isLarge ? "w-4 h-4 border-4" : "w-3 h-3 border-2";

  return (
    <div 
      className={`flex items-center gap-2 select-none ${className}`}
      aria-label="NexTrade Logo"
    >
      {/* Icon Container */}
      <div className={`relative flex items-center justify-center ${containerSize} bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20`}>
        <ShoppingBag className="text-white" size={iconSize} strokeWidth={2.5} />
        
        {/* Decorative Dot */}
        <div className={`absolute top-0 right-0 ${dotSize} bg-cyan-400 rounded-full border-white translate-x-1 -translate-y-1`}></div>
      </div>
      
      {/* Text Brand */}
      <div className="flex flex-col leading-none">
        <span className={`font-extrabold ${textSize} tracking-tight text-slate-900`}>
          Nex<span className="text-blue-600">Trade</span>
        </span>
      </div>
    </div>
  );
};

export default Logo;