import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios'; // ✅ Use centralized API
import CategoryCard from './CategoryCard';
import { 
  Monitor, Car, Home, Armchair, Shirt, Dumbbell, 
  Wrench, Briefcase, PawPrint, Baby, Hammer, 
  MoreHorizontal, Package 
} from 'lucide-react';

// --- Visual Configuration ---
const categoryVisuals = {
  "Electronics": { icon: <Monitor size={28} /> },
  "Vehicles": { icon: <Car size={28} /> },
  "Property": { icon: <Home size={28} /> },
  "Furniture": { icon: <Armchair size={28} /> },
  "Fashion": { icon: <Shirt size={28} /> },
  "Sports": { icon: <Dumbbell size={28} /> },
  "Services": { icon: <Wrench size={28} /> },
  "Jobs": { icon: <Briefcase size={28} /> },
  "Pets": { icon: <PawPrint size={28} /> },
  "Kids": { icon: <Baby size={28} /> },
  "Tools": { icon: <Hammer size={28} /> },
  "Other": { icon: <MoreHorizontal size={28} /> },
};

const defaultIcon = <Package size={28} />;

const HomeCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // ✅ Use centralized API call
        const res = await api.get('/products');
        const products = res.data;

        // 1. Logic: Count products per category
        const categoryMap = new Map();
        
        products.forEach(product => {
          // Normalize category name (Title Case) to ensure matches
          const rawCat = product.category || "Other";
          // Simple helper to capitalize first letter
          const catName = rawCat.charAt(0).toUpperCase() + rawCat.slice(1).toLowerCase();
          
          const count = categoryMap.get(catName) || 0;
          categoryMap.set(catName, count + 1);
        });

        // 2. Logic: Map to Visuals & Objects
        const processedCategories = Array.from(categoryMap.entries()).map(([title, count]) => {
          // Case-insensitive match for icon key
          const visualKey = Object.keys(categoryVisuals).find(
            key => key.toLowerCase() === title.toLowerCase()
          );
          
          return {
            id: title,
            title: title,
            count: count,
            icon: visualKey ? categoryVisuals[visualKey].icon : defaultIcon
          };
        });

        // 3. Sort by Count (Most popular first)
        processedCategories.sort((a, b) => b.count - a.count);

        // 4. Slice Top 6 for Desktop (grid-cols-6) or 8 for mobile
        setCategories(processedCategories.slice(0, 6)); 

      } catch (err) {
        console.error("Failed to load categories");
        // We fail silently here so the homepage doesn't look broken
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ✅ Skeleton Loader Component (Displayed while loading)
  if (loading) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no categories found, hide section
  if (categories.length === 0) return null; 

  return (
    <section className="py-16 bg-slate-50 border-t border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Popular Categories</h2>
            <p className="text-slate-500 mt-1 text-sm">Explore what everyone is buying right now.</p>
          </div>
          
          <Link 
            to="/allcategories" 
            className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {categories.map((cat) => (
            <CategoryCard 
              key={cat.id} 
              name={cat.title} 
              count={cat.count} 
              icon={cat.icon} 
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default HomeCategories;