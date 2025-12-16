import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; // ✅ Import this
import Navbar from "../Component/Navbar";
import ProductCard from "../Component/HomeComponents/ProductCard";
import { useSearch } from "../context/SearchContext";

const ProductList = () => {
  const [searchParams] = useSearchParams(); // ✅ Get URL params
  const { filters, setFilters } = useSearch(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ SYNC URL TO CONTEXT (Run once on mount)
  // This handles the navigation from "All Categories" page
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const keywordFromUrl = searchParams.get("keyword");

    // If URL has params, update the context immediately
    if (categoryFromUrl || keywordFromUrl) {
      setFilters((prev) => ({
        ...prev,
        category: categoryFromUrl || prev.category,
        keyword: keywordFromUrl || prev.keyword,
      }));
    }
  }, [searchParams, setFilters]);

  // ✅ FETCH PRODUCTS (Triggered when filters change)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        let url = "http://localhost:5000/api/products";
        const params = [];

        // We use the Context 'filters' as the source of truth for the API call
        // because we synced the URL to it in the useEffect above.
        if (filters?.keyword) params.push(`keyword=${encodeURIComponent(filters.keyword)}`);
        if (filters?.category) params.push(`category=${encodeURIComponent(filters.category)}`);
        if (filters?.location) params.push(`location=${encodeURIComponent(filters.location)}`);
        if (filters?.condition) params.push(`condition=${filters.condition}`);
        if (filters?.minPrice) params.push(`minPrice=${filters.minPrice}`);
        if (filters?.maxPrice) params.push(`maxPrice=${filters.maxPrice}`);
        if (filters?.sort) params.push(`sort=${filters.sort}`);

        if (params.length) url += `?${params.join("&")}`;

        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]); // Refetch whenever filters (context) change

  // Determine title to display
  const displayTitle = searchParams.get("category") || filters?.category || "All Products";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                {displayTitle}
            </h1>
            <p className="text-slate-500">
                {loading 
                  ? "Searching..." 
                  : `${products.length} result${products.length !== 1 ? 's' : ''} found`
                }
            </p>
        </div>

        {/* Loading State */}
        {loading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
               <div key={n} className="bg-white rounded-xl h-80 animate-pulse border border-gray-100">
                 <div className="h-48 bg-gray-200 w-full rounded-t-xl"></div>
                 <div className="p-4 space-y-3">
                   <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                 </div>
               </div>
             ))}
           </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-gray-200 shadow-sm">
             <div className="bg-gray-100 p-4 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
             </div>
             <h3 className="text-lg font-medium text-slate-900">No products found</h3>
             <p className="text-slate-500 mt-1 max-w-sm">
                We couldn't find any items matching your filters. Try clearing some filters or searching for something else.
             </p>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;