import { Search, Plus, User, Package } from "lucide-react"; // Added Package icon for My Products
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSearch } from "../context/SearchContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const { filters, setFilters } = useSearch();
  const [text, setText] = useState("");

  // Get role directly for rendering logic
  const role = localStorage.getItem("role");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({
      ...filters,
      keyword: text
    });
    navigate("/productlist");
  };

  return (
    <nav className="bg-white py-3 px-4 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
              M
            </div>
            <span className="text-xl font-bold text-slate-800">Mini OLX</span>
          </div>
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-2 w-full max-w-md"
        >
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search products..."
            className="bg-transparent outline-none text-sm w-full text-gray-700"
          />
        </form>

        {/* Actions */}
        <div className="flex items-center gap-6 text-sm text-slate-700">
          <Link to="/allcategories">
            <span className="cursor-pointer hover:text-blue-600 hidden sm:block">Categories</span>
          </Link>

          {!isLoggedIn ? (
            <Link to="/login">
              <span className="cursor-pointer hover:text-blue-600">Login</span>
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
              >
                <User size={20} />
                <span className="hidden sm:block">Profile</span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg w-48 z-50 overflow-hidden">
                  <Link to="/profile">
                    <button
                      onClick={() => { navigate("/profile"); setOpen(false); }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-slate-700"
                    >
                      My Profile
                    </button>
                  </Link>

                  {/* ✅ ADDED: My Products Link (Seller Only) */}
                  {role === "seller" && (
                    <Link to="/myproducts">
                      <button
                        onClick={() => { navigate("/myproducts"); setOpen(false); }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-slate-700"
                      >
                         <Package size={16} /> 
                         My Products
                      </button>
                    </Link>
                  )}

                  <div className="border-t border-gray-100"></div>

                  <button
                    onClick={() => { handleLogout(); setOpen(false); }}
                    className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ✅ Only show SELL button if user role is 'seller' */}
          {role === "seller" && (
            <button
              onClick={() => navigate("/addproduct")}
              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full font-bold shadow-md transition-all"
            >
              <Plus size={18} />
              SELL
            </button>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;