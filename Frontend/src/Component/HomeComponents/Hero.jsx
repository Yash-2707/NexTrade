import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, PlusCircle } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 py-24 px-4 overflow-hidden">
      
      {/* Optional: Abstract Background Pattern for texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="relative max-w-4xl mx-auto text-center space-y-6">
        
        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Find anything, <span className="text-blue-400">anywhere.</span>
        </h1>
        
        {/* Subtext */}
        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-light">
          The marketplace for your local community. Buy great deals or sell what you don't need anymore.
        </p>

        {/* Action Buttons (Replacements for Search Bar) */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 pt-4">
          
          <Link 
            to="/productlist" 
            className="flex items-center gap-2 bg-white text-slate-900 hover:bg-gray-100 font-bold py-3.5 px-8 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Browse Products
            <ArrowRight size={18} />
          </Link>

          <Link 
            to="/addproduct" 
            className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 font-bold py-3.5 px-8 rounded-full transition-all shadow-lg hover:shadow-blue-900/50 transform hover:-translate-y-0.5"
          >
            <PlusCircle size={18} />
            Post an sell
          </Link>

        </div>

      </div>
    </div>
  );
};

export default Hero;