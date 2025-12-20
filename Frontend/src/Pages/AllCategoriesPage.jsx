import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { 
  Search,
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
  Package,
  ArrowRight
} from 'lucide-react';

// --- Visual Configuration ---
const categoryVisuals = {
  "Electronics": { 
    icon: <Monitor size={20} className="text-white" />, 
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=500", 
    gradient: "from-blue-500 to-indigo-600"
  },
  "Vehicles": { 
    icon: <Car size={20} className="text-white" />, 
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=500", 
    gradient: "from-orange-500 to-red-600"
  },
  "Property": { 
    icon: <Home size={20} className="text-white" />, 
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=500", 
    gradient: "from-emerald-500 to-teal-600"
  },
  "Furniture": { 
    icon: <Armchair size={20} className="text-white" />, 
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=500", 
    gradient: "from-amber-500 to-yellow-600"
  },
  "Fashion": { 
    icon: <Shirt size={20} className="text-white" />, 
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=500", 
    gradient: "from-pink-500 to-rose-600"
  },
  "Sports": { 
    icon: <Dumbbell size={20} className="text-white" />, 
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=500", 
    gradient: "from-cyan-500 to-blue-600"
  },
  "Services": { 
    icon: <Wrench size={20} className="text-white" />, 
    image: "https://images.unsplash.com/photo-1581578731117-104f8a3d46a8?auto=format&fit=crop&q=80&w=500", 
    gradient: "from-slate-500 to-slate-700"
  },
  "Jobs": { 
    icon: <Briefcase size={20} className="text-white" />, 
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=500", 
    gradient: "from-violet-500 to-purple-600"
  },
  "Pets": { 
    icon: <PawPrint size={20} className="text-white" />, 
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=500", 
    gradient: "from-yellow-400 to-orange-500"
  },
  "Kids": { 
    icon: <Baby size={20} className="text-white" />, 
    image: "https://images.unsplash.com/photo-1566576912902-1d6199c4c16a?auto=format&fit=crop&q=80&w=500", 
    gradient: "from-pink-400 to-red-400"
  },
  "Tools": { 
    icon: <Hammer size={20} className="text-white" />, 
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=500", 
    gradient: "from-gray-500 to-gray-700"
  },
};

const defaultVisual = {
  icon: <Package size={20} className="text-white" />,
  image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=500",
  gradient: "from-slate-400 to-slate-600"
};

// --- Components ---
const Breadcrumb = () => (
  <nav className="flex items-center text-sm text-slate-500 mb-6 animate-in fade-in slide-in-from-left-4 duration-500">
    <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
    <span className="mx-2 text-slate-300">/</span>
    <span className="text-slate-800 font-medium bg-gray-100 px-2 py-0.5 rounded">All Categories</span>
  </nav>
);

const CategoryCard = ({ item, onClick }) => (
  <div 
    onClick={onClick}
    className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 h-full flex flex-col"
  >
    {/* Image Section */}
    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
      {item.image ? (
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
      ) : (
        <div className="w-full h-full bg-slate-200 flex items-center justify-center">
          <Package className="text-slate-400 opacity-50" size={48} />
        </div>
      )}
      
      {/* Floating Icon Badge */}
      <div className={`absolute top-4 right-4 p-2.5 rounded-xl shadow-lg z-20 bg-gradient-to-br ${item.gradient} backdrop-blur-md border border-white/20`}>
        {item.icon}
      </div>
    </div>

    {/* Content Section */}
    <div className="p-5 flex-grow flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors capitalize">
          {item.title}
        </h3>
        <p className="text-slate-500 text-sm mt-1 font-medium flex items-center gap-1">
          {item.count} {item.count === 1 ? 'item' : 'items'}
        </p>
      </div>

      <div className="mt-4 flex items-center text-blue-600 text-sm font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        Browse <ArrowRight size={16} className="ml-1" />
      </div>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="bg-white rounded-2xl border border-gray-100 h-80 animate-pulse flex flex-col">
        <div className="h-48 bg-gray-200 w-full rounded-t-2xl"></div>
        <div className="p-5 space-y-3 flex-1">
          <div className="h-6 bg-gray-200 rounded w-2/3"></div>
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
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/products");
        const products = res.data;

        // 1. Logic: Count products per category
        const categoryMap = new Map();

        products.forEach(product => {
          const rawCat = product.category || "Other";
          // Normalize to Title Case
          const catName = rawCat.charAt(0).toUpperCase() + rawCat.slice(1).toLowerCase();
          const count = categoryMap.get(catName) || 0;
          categoryMap.set(catName, count + 1);
        });

        // 2. Logic: Map to Visuals
        const processedCategories = Array.from(categoryMap.entries()).map(([title, count]) => {
          // Case-insensitive visual match
          const visualKey = Object.keys(categoryVisuals).find(
            key => key.toLowerCase() === title.toLowerCase()
          );
          
          const visual = visualKey ? categoryVisuals[visualKey] : defaultVisual;

          return {
            id: title,
            title: title,
            count: count,
            icon: visual.icon,
            image: visual.image,
            gradient: visual.gradient
          };
        });

        // Sort: Most items first
        processedCategories.sort((a, b) => b.count - a.count || a.title.localeCompare(b.title));

        setCategories(processedCategories);
        setFilteredCategories(processedCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter logic
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = categories.filter(cat => 
        cat.title.toLowerCase().includes(lowerTerm)
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  const handleCategoryClick = (categoryName) => {
    navigate(`/productlist?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />
        
        {/* Header & Search */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Explore Categories
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Find exactly what you're looking for. From vehicles to electronics, discover the best deals in your local community.
            </p>
          </div>
          
          {/* Functional Search Bar */}
          <div className="w-full lg:w-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Filter categories..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full lg:w-80 pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 shadow-sm"
            />
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-200 border-dashed">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No categories found</h3>
            <p className="text-slate-500 mt-2">
              We couldn't find any categories matching "{searchTerm}".
            </p>
            <button 
              onClick={() => setSearchTerm("")}
              className="mt-4 text-blue-600 font-bold hover:underline"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
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