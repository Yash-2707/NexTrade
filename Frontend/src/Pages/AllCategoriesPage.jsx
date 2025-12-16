import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Filter, 
  Monitor, 
  Car, 
  Home, 
  Armchair, 
  Shirt, 
  Dumbbell, 
  Wrench, 
  Briefcase, 
  PawPrint, 
  Baby, 
  Hammer, 
  MoreHorizontal,
  Package // Generic fallback icon
} from 'lucide-react';
import Navbar from '../Component/Navbar';

// --- Visual Configuration (Images & Icons) ---
// We use this to "decorate" the raw category names coming from the backend.
// Keys match the "category" string stored in your DB (case-insensitive matching used below).
const categoryVisuals = {
  "Electronics": { 
    icon: <Monitor size={20} className="text-blue-600" />, 
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=400", 
    color: "bg-blue-100" 
  },
  "Vehicles": { 
    icon: <Car size={20} className="text-blue-600" />, 
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=400", 
    color: "bg-blue-100" 
  },
  "Property": { 
    icon: <Home size={20} className="text-blue-600" />, 
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400", 
    color: "bg-blue-100" 
  },
  "Furniture": { 
    icon: <Armchair size={20} className="text-blue-600" />, 
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400", 
    color: "bg-blue-100" 
  },
  "Fashion": { 
    icon: <Shirt size={20} className="text-blue-600" />, 
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=400", 
    color: "bg-orange-100" 
  },
  "Sports": { 
    icon: <Dumbbell size={20} className="text-blue-600" />, 
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400", 
    color: "bg-orange-100" 
  },
  "Services": { 
    icon: <Wrench size={20} className="text-blue-600" />, 
    image: "https://images.unsplash.com/photo-1581578731117-104f8a3d46a8?auto=format&fit=crop&q=80&w=400", 
    color: "bg-blue-100" 
  },
  "Jobs": { 
    icon: <Briefcase size={20} className="text-blue-600" />, 
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400", 
    color: "bg-blue-100" 
  },
  "Pets": { 
    icon: <PawPrint size={20} className="text-blue-600" />, 
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=400", 
    color: "bg-blue-100" 
  },
  "Kids": { 
    icon: <Baby size={20} className="text-blue-600" />, 
    image: "https://images.unsplash.com/photo-1566576912902-1d6199c4c16a?auto=format&fit=crop&q=80&w=400", 
    color: "bg-blue-100" 
  },
  "Tools": { 
    icon: <Hammer size={20} className="text-blue-600" />, 
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=400", 
    color: "bg-green-100" 
  },
  "Other": { 
    icon: <MoreHorizontal size={20} className="text-blue-600" />, 
    image: null, 
    color: "bg-gray-100" 
  },
};

// Fallback visual if backend returns a category not in our list
const defaultVisual = {
  icon: <Package size={20} className="text-blue-600" />,
  image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400",
  color: "bg-gray-100"
};

// --- Components ---
const Breadcrumb = () => (
  <div className="flex items-center text-sm text-slate-500 mb-6">
    <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
    <span className="mx-2 text-slate-400">›</span>
    <span className="text-slate-800 font-medium">Categories</span>
  </div>
);

const CategoryCard = ({ item, onClick }) => (
  <div 
    onClick={onClick}
    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-100 flex flex-col h-full"
  >
    <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
      {item.image ? (
        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
      ) : (
        <div className="w-full h-full bg-slate-100 flex items-center justify-center relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
          <div className="flex gap-2 opacity-20">
            <div className="w-12 h-12 rounded-full bg-slate-400"></div>
            <div className="w-12 h-12 bg-slate-400 rotate-45"></div>
          </div>
        </div>
      )}
      <div className="absolute top-4 right-4 bg-white p-2.5 rounded-full shadow-md z-10 flex items-center justify-center">
        {item.icon}
      </div>
    </div>
    <div className="p-5 flex-grow flex flex-col justify-center">
      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors capitalize">{item.title}</h3>
      <p className="text-slate-500 text-sm mt-1 font-medium">{item.count} items</p>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div key={i} className="bg-white rounded-2xl border border-gray-100 h-72 animate-pulse">
        <div className="h-48 bg-gray-200 w-full"></div>
        <div className="p-5 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    ))}
  </div>
);

// --- Main Component ---
const AllCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch ALL products
        const res = await axios.get('http://localhost:5000/api/products');
        const products = res.data;

        // 1. Extract unique categories from products
        const categoryMap = new Map();

        products.forEach(product => {
          const catName = product.category || "Other";
          // Normalize to Title Case for display if needed, but keeping DB value is safer for filtering
          const count = categoryMap.get(catName) || 0;
          categoryMap.set(catName, count + 1);
        });

        // 2. Transform into array and merge with visual data
        const processedCategories = Array.from(categoryMap.entries()).map(([title, count]) => {
          // Find visual config (case-insensitive search)
          const visualKey = Object.keys(categoryVisuals).find(
            key => key.toLowerCase() === title.toLowerCase()
          );
          
          const visual = visualKey ? categoryVisuals[visualKey] : defaultVisual;

          return {
            id: title, // Use title as ID
            title: title,
            count: count,
            icon: visual.icon,
            image: visual.image,
            color: visual.color
          };
        });

        // Sort: High count first, then alphabetical
        processedCategories.sort((a, b) => b.count - a.count || a.title.localeCompare(b.title));

        setCategories(processedCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    // Navigate using URL Search Params
    navigate(`/productlist?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">All Categories</h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Browse our extensive range of products across various categories. Find exactly what you are looking for.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 font-medium py-3 px-6 rounded-full shadow-sm transition-all whitespace-nowrap">
            <span>Filter categories...</span>
            <Filter size={18} className="text-slate-400 ml-2" />
          </button>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p>No categories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                item={category}
                onClick={() => handleCategoryClick(category.title)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllCategories;