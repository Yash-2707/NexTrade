import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, User, Package, MessageSquare, LogOut, ChevronDown } from "lucide-react";
import { useSearch } from "../context/SearchContext";
import Logo from "./Logo"; // Ensure this path is correct

const Navbar = () => {
  const navigate = useNavigate();
  const { setFilters } = useSearch();

  // State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [role, setRole] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Check Auth Status on Mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    setIsLoggedIn(!!token);
    setRole(storedRole);

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.profilePic) {
          setUserProfilePic(parsedUser.profilePic);
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  // 2. Close Dropdown on Click Outside
  useEffect(() => {
    const closeDropdown = () => setOpen(false);
    if (open) {
      window.addEventListener("click", closeDropdown);
    }
    return () => window.removeEventListener("click", closeDropdown);
  }, [open]);

  // 3. Logout Logic
  const handleLogout = () => {
    localStorage.clear(); // Clears all auth data
    setIsLoggedIn(false);
    navigate("/login");
  };

  // 4. Search Logic
  const handleSearch = (e) => {
    e.preventDefault(); // ✅ Stop page reload
    if (searchTerm.trim()) {
      // ✅ Navigate to ProductList with query param
      navigate(`/productlist?keyword=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* ✅ Logo */}
          <Link to="/" className="flex-shrink-0 hover:opacity-90 transition-opacity">
            <Logo />
          </Link>

          {/* ✅ Search Bar (Hidden on mobile) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center w-full max-w-lg bg-slate-100 border border-transparent focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 rounded-full px-4 py-2.5 transition-all"
          >
            <Search size={20} className="text-slate-400 mr-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for cars, phones, furniture..."
              className="bg-transparent w-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-full transition-transform transform active:scale-95 ml-2"
            >
              Search
            </button>
          </form>

          {/* ✅ Right Side Actions */}
          <div className="flex items-center gap-6">
            
            {/* Categories Link */}
            <Link to="/allcategories" className="hidden sm:block text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors">
              Categories
            </Link>

            {!isLoggedIn ? (
              <Link to="/login">
                <button className="text-slate-700 hover:text-blue-600 font-bold text-sm transition-colors">
                  Login
                </button>
              </Link>
            ) : (
              <div className="flex items-center gap-5">
                
                {/* Chat Icon */}
                <Link to="/chat" className="relative group text-slate-600 hover:text-blue-600 transition-colors">
                  <MessageSquare size={24} strokeWidth={2} />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                  
                  {/* Tooltip */}
                  <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Messages
                  </span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                    className="flex items-center gap-2 focus:outline-none group"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-gray-100 group-hover:ring-blue-100 transition-all">
                      {userProfilePic ? (
                        <img src={userProfilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <User size={20} />
                        </div>
                      )}
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {open && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="py-1">
                        <Link 
                          to="/profile"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <User size={16} className="text-slate-400" />
                          My Profile
                        </Link>

                        {role === "seller" && (
                          <Link 
                            to="/myproducts"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Package size={16} className="text-slate-400" />
                            My Products
                          </Link>
                        )}

                        <div className="border-t border-gray-100 my-1"></div>

                        <button
                          onClick={() => { handleLogout(); setOpen(false); }}
                          className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sell Button (Seller Only) */}
            {role === "seller" && (
              <button
                onClick={() => navigate("/addproduct")}
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Plus size={18} strokeWidth={3} />
                <span>SELL</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;