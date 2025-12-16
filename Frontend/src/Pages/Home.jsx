import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Components
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import Hero from "../Component/HomeComponents/Hero";
import ProductCard from "../Component/HomeComponents/ProductCard";
import HomeCategories from "../Component/HomeComponents/HomeCategories"; // ✅ Import the new component

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Products for "Fresh Recommendations"
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      <Navbar />
      <Hero />

      {/* ✅ 1. Dynamic Categories Section */}
      {/* This component now handles fetching and displaying categories automatically */}
      <HomeCategories />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* ✅ 2. Fresh Recommendations Section */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Fresh Recommendations</h2>
              <p className="text-slate-500 text-sm mt-1">New items just added by sellers</p>
            </div>
            
            <Link
              to="/productlist"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              View all products &rarr;
            </Link>
          </div>

          {loading ? (
            // Loading Skeleton for Products
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-xl h-80 animate-pulse border border-gray-100">
                   <div className="h-48 bg-gray-200 rounded-t-xl w-full"></div>
                   <div className="p-4 space-y-3">
                     <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                     <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                   </div>
                </div>
              ))}
            </div>
          ) : (
            // Product Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Slice to show only the 8 most recent products */}
              {products.slice(0, 8).map((p) => (
                // Assuming ProductCard handles its own internal Link or onClick. 
                // If not, wrap it in <Link to={`/product/${p._id}`}> ... </Link>
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Home;