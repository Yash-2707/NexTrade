import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, PlusCircle } from "lucide-react";

const Hero = () => {
  // ✅ OPTIMIZATION: Read from localStorage immediately (Lazy Initialization)
  // This prevents the "flicker" where the button pops in after the page loads.
  const [user] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      return null;
    }
  });

  return (
    <div className="relative bg-slate-900 py-24 px-4 overflow-hidden isolate">
      
      {/* 1. Background Gradients & Patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 -z-10"></div>
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] -z-10"></div>
      
      {/* Decorative Blur Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/20 blur-[100px] rounded-full -z-10"></div>

      <div className="relative max-w-5xl mx-auto text-center space-y-8">
        
        {/* 2. Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
          Find anything, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">anywhere.</span>
        </h1>
        
        {/* 3. Subtext */}
        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          The marketplace for your local community. Buy great deals, discover hidden gems, or sell what you don't need anymore.
        </p>

        {/* 4. Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          
          {/* Browse Button */}
          <Link 
            to="/productlist" 
            className="group flex items-center gap-2 bg-white text-slate-900 hover:bg-blue-50 font-bold py-4 px-8 rounded-full transition-all shadow-xl hover:shadow-2xl hover:shadow-white/10 transform hover:-translate-y-1"
          >
            Browse Products
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Sell Button (Seller Only) */}
          {user && user.role === "seller" && (
            <Link 
              to="/addproduct" 
              className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-500 font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-blue-600/40 transform hover:-translate-y-1"
            >
              <PlusCircle size={18} />
              Start Selling
            </Link>
          )}

        </div>

      </div>
    </div>
  );
};

export default Hero;