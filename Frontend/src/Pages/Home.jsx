import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import api from "../api/axios"; // ✅ Use centralized API

// Components
import Hero from "../Component/Hero";
import HomeCategories from "../Component/HomeCategories";
import ProductCard from "../Component/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");

        // ✅ Client-side sorting: Ensure we show the NEWEST items first
        const sortedProducts = res.data.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );

        setProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Dynamic Categories */}
      <HomeCategories />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* 3. Fresh Recommendations Section */}
        <section>
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="text-yellow-500" size={20} fill="currentColor" />
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Fresh Recommendations</h2>
              </div>
              <p className="text-slate-500 text-sm">The latest items just added by your community.</p>
            </div>

            <Link
              to="/productlist"
              className="group flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View all products
              <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Content */}
          {loading ? (
            // Skeleton Loader (Matches ProductCard dimensions)
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, n) => (
                <div key={n} className="bg-gray-100 rounded-2xl h-[340px] animate-pulse"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            // Product Grid (Top 8 Newest)
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-slate-400 text-lg">No products available yet.</p>
              <Link to="/addproduct" className="text-blue-600 font-bold hover:underline mt-2 inline-block">
                Be the first to sell!
              </Link>
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default Home;