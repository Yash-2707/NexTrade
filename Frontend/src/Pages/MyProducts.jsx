import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Pencil
} from 'lucide-react';
import Navbar from '../Component/Navbar'; // Importing Navbar

// --- Components ---

const ProductCard = ({ product, onDelete }) => (
  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
    {/* Image */}
    <div className="relative h-48 bg-gray-100">
      <img
        src={product.images?.[0]?.url || "https://via.placeholder.com/300"}
        alt={product.title}
        className="w-full h-full object-cover"
      />
      <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-md bg-green-100 text-green-700 shadow-sm">
        Active
      </span>
    </div>

    {/* Content */}
    <div className="p-4">
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-semibold text-slate-800 text-sm truncate w-full pr-2">
            {product.title}
        </h3>
      </div>

      <p className="text-blue-600 font-bold mb-4">
        ₹{product.price}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <Link to={`/editproduct/${product._id}`} className="flex-1">
          <button className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2 text-sm font-medium text-slate-600 hover:bg-gray-50 transition-colors">
            <Pencil size={14} />
            Edit
          </button>
        </Link>
        <button
          onClick={() => onDelete(product._id)}
          className="px-3 border border-gray-200 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center"
          title="Delete Product"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  </div>
);

// --- Main Page Component ---
const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // 🔹 Fetch Seller Products
  const fetchMyProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products/seller/my-products",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError("Unauthorized or failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete Product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  // Stats Data (Dynamic)
  const stats = [
    { label: 'Active Listings', value: products.length, subtext: 'Live' },
    { label: 'Total Value', value: `₹${products.reduce((acc, curr) => acc + Number(curr.price), 0)}`, subtext: 'Inventory Worth' },
    { label: 'Views', value: '0', subtext: 'Analytics Coming Soon' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 pb-12">
      {/* 1. Navbar Added Here */}
      <Navbar />

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Upper Part: Header & Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Inventory</h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage your store listings and track performance.
            </p>
          </div>
          <Link to="/addproduct">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-5 rounded-lg flex items-center gap-2 font-medium shadow-sm transition-all hover:shadow-md">
              <Plus size={18} />
              Add New Product
            </button>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-2">{stat.label}</h3>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                <span className="text-xs text-slate-400 mb-1.5">{stat.subtext}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Product Grid Section */}
        {loading ? (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        ) : error ? (
            <div className="text-center py-12 bg-white rounded-xl border border-red-100">
                <p className="text-red-500 mb-2 font-medium">{error}</p>
                <button onClick={fetchMyProducts} className="text-blue-600 hover:underline text-sm">Try Again</button>
            </div>
        ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-slate-400 mb-4 text-lg">You haven't listed any products yet.</p>
                <Link to="/addproduct">
                    <button className="text-blue-600 font-semibold hover:underline">Start Selling Today</button>
                </Link>
            </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {products.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onDelete={deleteProduct}
                />
              ))}
            </div>

            {/* Pagination UI */}
            <div className="flex justify-center">
              <nav className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                <button className="p-2 hover:bg-gray-100 rounded-md text-slate-400 hover:text-slate-600 disabled:opacity-50">
                    <ChevronLeft size={18} />
                </button>
                <span className="px-4 py-1 text-sm font-medium text-slate-700 bg-gray-50 rounded-md">Page 1</span>
                <button className="p-2 hover:bg-gray-100 rounded-md text-slate-400 hover:text-slate-600">
                    <ChevronRight size={18} />
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