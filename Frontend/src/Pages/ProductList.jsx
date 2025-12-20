import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../Component/ProductCard';
import { Filter, ChevronDown, SlidersHorizontal, Search } from 'lucide-react';

// --- ✅ FIXED SIDEBAR COMPONENT ---
const Sidebar = ({ filters, setFilters, clearFilters }) => {
  
  // Map Display Name -> Database Value
  const categories = [
    { label: "Electronics", value: "electronics" },
    { label: "Vehicles", value: "vehicles" },
    { label: "Property", value: "property" },
    { label: "Furniture", value: "furniture" },
    { label: "Fashion", value: "fashion" },
    { label: "Books", value: "books" },
    { label: "Sports", value: "sports" },
    { label: "Services", value: "services" },
    { label: "Other", value: "others" } // Check if your DB uses 'other' or 'others'
  ];

  const handleInputChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="w-full md:w-64 space-y-8 bg-white p-6 rounded-xl border border-gray-100 h-fit shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <SlidersHorizontal size={18} /> Filters
        </h3>
        <button 
          onClick={clearFilters}
          className="text-xs text-red-500 font-medium hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* 1. Categories (Fixed) */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Category</h4>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li 
              key={cat.value}
              onClick={() => setFilters(prev => ({ ...prev, category: cat.value }))}
              className={`cursor-pointer text-sm py-2 px-3 rounded-lg transition-all flex justify-between items-center ${
                filters.category === cat.value 
                  ? 'bg-blue-50 text-blue-600 font-bold' 
                  : 'text-slate-600 hover:bg-gray-50'
              }`}
            >
              {cat.label}
              {filters.category === cat.value && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
            </li>
          ))}
        </ul>
      </div>

      {/* 2. Price Range */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Price Range (₹)</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleInputChange}
            placeholder="Min"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-gray-50"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleInputChange}
            placeholder="Max"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-gray-50"
          />
        </div>
      </div>

      {/* 3. Condition */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Condition</h4>
        <div className="space-y-2">
          {['new', 'used'].map((cond) => (
            <label key={cond} className="flex items-center cursor-pointer group hover:bg-gray-50 p-1 rounded-md -ml-1">
              <input
                type="radio"
                name="condition"
                value={cond}
                checked={filters.condition === cond}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="ml-2 text-sm text-slate-600 capitalize group-hover:text-blue-600 transition-colors">{cond}</span>
            </label>
          ))}
        </div>
      </div>

    </div>
  );
};

// --- Main Page Component ---
const ProductList = () => {
  const [searchParams] = useSearchParams();
  
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize Filters
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || "",
    // ✅ FIX: Ensure URL category is converted to lowercase before setting state
    category: (searchParams.get('category') || "").toLowerCase(),
    minPrice: "",
    maxPrice: "",
    condition: "",
    sort: "newest",
    location: ""
  });

  // Sync URL -> Filter State
  useEffect(() => {
    const categoryFromUrl = (searchParams.get('category') || "").toLowerCase(); // ✅ Enforce lowercase
    const keywordFromUrl = searchParams.get('keyword');

    setFilters((prev) => {
      if (prev.category !== categoryFromUrl || prev.keyword !== (keywordFromUrl || "")) {
        return {
          ...prev,
          category: categoryFromUrl,
          keyword: keywordFromUrl || ""
        };
      }
      return prev;
    });
  }, [searchParams]);

  // Fetch Data
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.keyword) params.keyword = filters.keyword;
        if (filters.category) params.category = filters.category;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.condition) params.condition = filters.condition;
        if (filters.sort) params.sort = filters.sort;

        const res = await api.get('/products', { params });
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [filters]); 

  const clearFilters = () => {
    setFilters({
      keyword: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      condition: "",
      sort: "newest",
      location: ""
    });
  };

  const displayTitle = filters.category 
    ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1) // Capitalize for title
    : (filters.keyword ? `Results for "${filters.keyword}"` : "All Products");

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-lg font-semibold text-slate-700 shadow-sm"
          >
            <Filter size={18} /> 
            {isSidebarOpen ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block transition-all`}>
            <Sidebar filters={filters} setFilters={setFilters} clearFilters={clearFilters} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 capitalize">
                  {displayTitle}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {loading ? "Updating..." : `Showing ${products.length} results`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 hidden sm:block">Sort by:</span>
                <div className="relative">
                  <select 
                    value={filters.sort}
                    onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                    className="appearance-none bg-white border border-gray-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium cursor-pointer shadow-sm hover:border-blue-300 transition-colors"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            {/* Content Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100">
                    <div className="h-48 bg-gray-200 rounded-t-2xl w-full"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No products found</h3>
                <p className="text-slate-500 mt-2 mb-6 max-w-sm mx-auto">
                  No items found in {filters.category || "this selection"}.
                </p>
                <button 
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Clear All Filters
                </button>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductList;