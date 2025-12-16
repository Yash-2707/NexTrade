import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryCard from './CategoryCard'; // Import the component above
import { 
  Monitor, Car, Home, Armchair, Shirt, Dumbbell, 
  Wrench, Briefcase, PawPrint, Baby, Hammer, 
  MoreHorizontal, Package 
} from 'lucide-react';

// --- Visual Configuration (Same as AllCategories.jsx) ---
const categoryVisuals = {
  "Electronics": { icon: <Monitor size={24} /> },
  "Vehicles": { icon: <Car size={24} /> },
  "Property": { icon: <Home size={24} /> },
  "Furniture": { icon: <Armchair size={24} /> },
  "Fashion": { icon: <Shirt size={24} /> },
  "Sports": { icon: <Dumbbell size={24} /> },
  "Services": { icon: <Wrench size={24} /> },
  "Jobs": { icon: <Briefcase size={24} /> },
  "Pets": { icon: <PawPrint size={24} /> },
  "Kids": { icon: <Baby size={24} /> },
  "Tools": { icon: <Hammer size={24} /> },
  "Other": { icon: <MoreHorizontal size={24} /> },
};

const defaultIcon = <Package size={24} />;

const HomeCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        const products = res.data;

        // 1. Logic: Count products per category
        const categoryMap = new Map();
        products.forEach(product => {
          const catName = product.category || "Other";
          const count = categoryMap.get(catName) || 0;
          categoryMap.set(catName, count + 1);
        });

        // 2. Logic: Map to Visuals
        const processedCategories = Array.from(categoryMap.entries()).map(([title, count]) => {
          // Case-insensitive match for icon
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

        // Sort by count (Popularity)
        processedCategories.sort((a, b) => b.count - a.count);

        // Optional: Slice to show only top 6 or 8 on Homepage
        setCategories(processedCategories.slice(0, 8)); 

      } catch (err) {
        console.error("Error loading categories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div className="p-10 text-center text-slate-400">Loading categories...</div>;
  if (categories.length === 0) return null; // Don't show section if empty

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Popular Categories</h2>
          <a href="/categories" className="text-blue-600 hover:text-blue-700 font-medium text-sm">View All &rarr;</a>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
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