import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios'; // ✅ Use centralized API
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Package,
  TrendingUp,
  Eye,
  AlertCircle
} from 'lucide-react';

// --- Sub-Component: Product Card ---
const ProductCard = ({ product, onDelete }) => {
  // Currency Formatter
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col h-full">
      
      {/* Image Section */}
      <div className="relative h-48 bg-gray-50 p-4 border-b border-gray-100 flex items-center justify-center">
        <img
          src={product.images?.[0]?.url || "https://via.placeholder.com/300?text=No+Image"}
          alt={product.title}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded bg-green-100 text-green-700 uppercase tracking-wide shadow-sm">
          Active
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800 text-base mb-1 truncate" title={product.title}>
            {product.title}
          </h3>
          <p className="text-slate-500 text-xs mb-3 capitalize">
            {product.category} • {product.condition}
          </p>
        </div>

        <p className="text-blue-600 font-bold text-lg mb-4">
          {formattedPrice}
        </p>

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <Link to={`/editproduct/${product._id}`} className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 border border-gray-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600 py-2 rounded-lg text-sm font-medium transition-colors">
              <Pencil size={16} />
              Edit
            </button>
          </Link>
          <button
            onClick={() => onDelete(product._id)}
            className="px-3 border border-gray-200 bg-white text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-lg transition-colors"
            title="Delete Product"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Products
  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      // ✅ Using centralized API (automatically handles Base URL & Token if configured)
      const res = await api.get("/products/seller/my-products");
      setProducts(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load your inventory.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

    try {
      await api.delete(`/products/${id}`);
      // Optimistic update: Remove from UI immediately
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert("Failed to delete product. Please try again.");
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  // Calculate Dashboard Stats
  const totalValue = products.reduce((acc, curr) => acc + Number(curr.price), 0);
  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(totalValue);

  const stats = [
    { label: 'Active Listings', value: products.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Inventory Value', value: formattedTotal, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Views', value: '0', icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 pb-20">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Inventory</h1>
            <p className="text-slate-500 mt-1">Manage your store listings and track performance.</p>
          </div>
          <Link to="/addproduct">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5">
              <Plus size={20} />
              List New Item
            </button>
          </Link>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content Area */}
        {loading ? (
          // Loading Skeletons
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-xl h-80 animate-pulse border border-gray-200">
                 <div className="h-48 bg-gray-200 rounded-t-xl w-full"></div>
                 <div className="p-4 space-y-3">
                   <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                 </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error State
          <div className="text-center py-20 bg-white rounded-2xl border border-red-100">
            <div className="flex justify-center mb-3 text-red-500">
               <AlertCircle size={40} />
            </div>
            <p className="text-red-500 mb-4 font-medium">{error}</p>
            <button onClick={fetchMyProducts} className="text-blue-600 font-bold hover:underline">
              Try Reloading
            </button>
          </div>
        ) : products.length === 0 ? (
          // Empty State
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Your inventory is empty</h3>
            <p className="text-slate-500 mb-6 mt-1">Start selling by adding your first product.</p>
            <Link to="/addproduct">
              <button className="text-blue-600 font-bold hover:underline">Add Product Now</button>
            </Link>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {products.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onDelete={deleteProduct}
                />
              ))}
            </div>

            {/* Pagination (Visual UI Only for now) */}
            <div className="flex justify-center">
              <nav className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                <button disabled className="p-2 hover:bg-gray-50 rounded-md text-slate-400 disabled:opacity-50 transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <span className="px-4 py-1 text-sm font-bold text-slate-700 bg-gray-50 rounded-md">Page 1</span>
                <button disabled className="p-2 hover:bg-gray-50 rounded-md text-slate-400 disabled:opacity-50 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </nav>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MyProducts;