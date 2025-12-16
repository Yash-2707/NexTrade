import React, { useState } from 'react';
import { Heart, ChevronDown, MapPin } from 'lucide-react';
import Navbar from '../Component/Navbar';


// --- Mock Data ---

const categoriesList = [
  { name: 'Mobile Phones', count: 124, active: true },
  { name: 'Accessories', count: 45, active: false },
  { name: 'Tablets', count: 32, active: false },
  { name: 'Wearables', count: 18, active: false },
];

const brandList = [
  { name: 'Apple', checked: true },
  { name: 'Samsung', checked: false },
  { name: 'Xiaomi', checked: false },
];

const products = [
  {
    id: 1,
    title: 'iPhone 13 Pro - 128GB Sierra Blue',
    price: '₹ 45,000',
    location: 'Bandra, Mumbai',
    time: '2 days ago',
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=400',
    featured: true,
    condition: 'Used',
    liked: false,
  },
  {
    id: 2,
    title: 'Samsung S21 Ultra 5G (Black)',
    price: '₹ 32,500',
    location: 'Andheri East',
    time: 'Today',
    image: 'https://images.unsplash.com/photo-1610945699349-627262724363?auto=format&fit=crop&q=80&w=400',
    featured: false,
    condition: null,
    liked: false,
  },
  {
    id: 3,
    title: 'Redmi Note 10 Pro Max',
    price: '₹ 12,000',
    location: 'Thane West',
    time: '4 hours ago',
    image: 'https://images.unsplash.com/photo-1621332872604-432857616978?auto=format&fit=crop&q=80&w=400',
    featured: false,
    condition: null,
    liked: true,
  },
  {
    id: 4,
    title: 'iPhone 14 - Sealed Pack',
    price: '₹ 65,999',
    location: 'Juhu',
    time: '1 week ago',
    image: 'https://images.unsplash.com/photo-1663499482523-1c0218931220?auto=format&fit=crop&q=80&w=400',
    featured: false,
    condition: 'Like New',
    liked: false,
  },
  {
    id: 5,
    title: 'OnePlus 9R - 8GB/128GB',
    price: '₹ 28,000',
    location: 'Powai',
    time: '3 days ago',
    image: 'https://images.unsplash.com/photo-1636469622633-472563745648?auto=format&fit=crop&q=80&w=400',
    featured: false,
    condition: null,
    liked: false,
  },
  {
    id: 6,
    title: 'Old Android Phones for parts',
    price: '₹ 5,000',
    location: 'Dadar',
    time: '1 hour ago',
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&q=80&w=400',
    featured: false,
    condition: null,
    liked: false,
  },
];

// --- Components ---

const Breadcrumbs = () => (
  <div className="text-sm text-gray-500 mb-4">
    <span className="hover:text-blue-600 cursor-pointer">Home</span>
    <span className="mx-2">/</span>
    <span className="text-gray-700 font-medium">Mobiles</span>
  </div>
);

const Sidebar = () => {
  const [priceRange, setPriceRange] = useState([5, 85]);

  return (
    <div className="w-full md:w-64 space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Categories</h3>
        <ul className="space-y-1">
          {categoriesList.map((item, index) => (
            <li
              key={index}
              className={`flex justify-between items-center py-2 px-3 rounded-md cursor-pointer transition-colors ${
                item.active
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{item.name}</span>
              <span className={`text-sm ${item.active ? 'text-blue-600' : 'text-gray-500'}`}>
                {item.count}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Price Range</h3>
        <div className="px-2">
          {/* Visual representation of the slider from the image */}
          <div className="relative h-1 bg-gray-200 rounded-full mb-6">
            <div
              className="absolute h-full bg-blue-500 rounded-full"
              style={{ left: '5%', right: '15%' }}
            ></div>
            <div
              className="absolute h-4 w-4 bg-white border-2 border-blue-500 rounded-full top-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: '5%' }}
            ></div>
            <div
              className="absolute h-4 w-4 bg-white border-2 border-blue-500 rounded-full top-1/2 -translate-y-1/2 cursor-pointer"
              style={{ right: '15%' }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>₹ 5k</span>
            <span>₹ 85k</span>
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Min"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Max"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Brand */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Brand</h3>
        <ul className="space-y-3">
          {brandList.map((brand, index) => (
            <li key={index} className="flex items-center">
              <input
                type="checkbox"
                id={`brand-${index}`}
                defaultChecked={brand.checked}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor={`brand-${index}`}
                className="ml-3 text-gray-700 cursor-pointer"
              >
                {brand.name}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      {/* Image Container */}
      <div className="relative h-56 w-full bg-gray-100">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
        />
        <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors">
          <Heart
            size={20}
            fill={product.liked ? 'currentColor' : 'none'}
            className={product.liked ? 'text-red-500' : ''}
          />
        </button>
        {product.featured && (
          <span className="absolute top-3 left-3 bg-yellow-400 text-slate-900 text-xs font-bold px-2.5 py-1 rounded-md uppercase">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-900">{product.price}</h3>
          {product.condition && (
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${product.condition === 'Like New' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {product.condition}
            </span>
          )}
        </div>
        <p className="text-gray-700 font-medium text-sm mb-4 line-clamp-2">
          {product.title}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>{product.location}</span>
          </div>
          <span>{product.time}</span>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

const Categories = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar */}
        <Sidebar />

        {/* Right Content */}
        <div className="flex-1">
          <Breadcrumbs />

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Mobile Phones</h1>
              <p className="text-gray-500 text-sm mt-1">
                Showing 124 results in Mumbai
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center">
              <span className="text-sm text-gray-600 mr-2">Sort by:</span>
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium text-sm">
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 flex flex-col items-center">
            <button className="bg-white border border-blue-500 text-blue-600 font-semibold py-3 px-12 rounded-full hover:bg-blue-50 transition-colors">
              Load More
            </button>
            <p className="text-gray-500 text-sm mt-3">Showing 6 of 124 items</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2023 Mini OLX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Categories;