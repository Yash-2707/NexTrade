import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios'; // Centralized API
import {
  ArrowLeft,
  Camera,
  ChevronDown,
  MapPin,
  Trash2,
  Save,
  Loader2,
  AlertCircle,
  X,
  Briefcase
} from 'lucide-react';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Loading States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  // Form State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  
  // Image State
  const [images, setImages] = useState([]); // New files
  const [existingImages, setExistingImages] = useState([]); // URLs from DB

  const BRAND_REQUIRED_CATEGORIES = ['Electronics', 'Vehicles', 'Fashion'];

  // 1. Fetch Data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const prod = res.data;

        setTitle(prod.title);
        setPrice(prod.price);
        setCategory(prod.category);
        setBrand(prod.brand || "");
        setCondition(prod.condition || "used"); // Default fallback
        setDescription(prod.description);
        setLocation(prod.location);
        setExistingImages(prod.images || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Remove Existing Image (URL)
  const removeExistingImage = (indexToRemove) => {
    setExistingImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Remove New Image (File)
  const removeNewImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // 2. Save Changes
  const handleSave = async () => {
    setError("");

    // Validation
    if (!title || !price || !category || !condition || !location) {
      setError("Please fill in all required fields.");
      return;
    }
    
    if (BRAND_REQUIRED_CATEGORIES.includes(category) && !brand.trim()) {
      setError(`Brand is required for ${category}.`);
      return;
    }

    if (existingImages.length + images.length === 0) {
      setError("You must have at least one image.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("category", category);
      if (brand) formData.append("brand", brand);
      formData.append("condition", condition);
      formData.append("description", description);
      formData.append("location", location);

      // Send existing images as JSON string (Backend handles filtering)
      formData.append("existingImages", JSON.stringify(existingImages));

      // Append new files
      images.forEach(img => formData.append("images", img));

      await api.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/myproducts");
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  // 3. Delete Product
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this listing? This cannot be undone.")) return;
    try {
      await api.delete(`/products/${id}`);
      navigate("/myproducts");
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 pb-12">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button 
              onClick={() => navigate("/myproducts")} 
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-2 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Inventory
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Edit Listing</h1>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 animate-pulse">
            <AlertCircle size={20} />
            <span className="font-medium text-sm">{error}</span>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">

            {/* Photos Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Photos</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Manage your product images.</p>
                </div>
                <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-1 rounded">
                  {existingImages.length + images.length}/5 Used
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                
                {/* Existing Images */}
                {existingImages.map((img, idx) => (
                  <div key={`exist-${idx}`} className="relative aspect-square bg-gray-100 rounded-lg border border-gray-200 group overflow-hidden">
                    <img src={img.url} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeExistingImage(idx)}
                      className="absolute top-1 right-1 bg-white/90 text-red-500 p-1 rounded-full shadow-sm hover:bg-red-50 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                    {idx === 0 && <span className="absolute bottom-0 left-0 right-0 bg-slate-800/70 text-white text-[10px] text-center py-1 font-medium">Cover</span>}
                  </div>
                ))}

                {/* New Images */}
                {images.map((file, idx) => (
                  <div key={`new-${idx}`} className="relative aspect-square bg-blue-50 rounded-lg border border-blue-100 group overflow-hidden">
                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover opacity-80" />
                    <button
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-1 right-1 bg-white/90 text-red-500 p-1 rounded-full shadow-sm hover:bg-red-50 transition-all"
                    >
                      <X size={14} />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded">New</span>
                  </div>
                ))}

                {/* Add Photo Button */}
                {existingImages.length + images.length < 5 && (
                  <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all text-slate-400 group">
                    <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                      <Camera size={20} />
                    </div>
                    <span className="text-xs font-bold">Add Photo</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => setImages(prev => [...prev, ...Array.from(e.target.files)])} />
                  </label>
                )}
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Form Fields Section */}
            <section className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Item Details</h2>

              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-slate-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                  placeholder="e.g. Macbook Pro M1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700">Category</label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => {
                          setCategory(e.target.value);
                          if (!BRAND_REQUIRED_CATEGORIES.includes(e.target.value)) setBrand("");
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Vehicles">Vehicles</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Books">Books</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700">Condition</label>
                  <div className="relative">
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white appearance-none cursor-pointer"
                    >
                      <option value="new">New</option>
                      <option value="used">Used</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>
              </div>

              {/* Brand Field */}
              {BRAND_REQUIRED_CATEGORIES.includes(category) && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-300">
                  <label className="block text-sm font-bold text-slate-700">Brand / Make</label>
                  <div className="relative group">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g. Apple, Samsung"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Price & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700">Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      onWheel={(e) => e.target.blur()}
                      className="w-full pl-8 pr-12 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">INR</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700">Location</label>
                  <div className="relative group">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 relative">
                <label className="block text-sm font-bold text-slate-700">Description</label>
                <textarea
                  rows="6"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 resize-none"
                  placeholder="Describe your product..."
                ></textarea>
                <div className="absolute bottom-3 right-3 text-xs text-slate-400 bg-white pl-2">
                  {description.length} chars
                </div>
              </div>

            </section>
          </div>

          {/* Footer Actions */}
          <div className="px-6 md:px-8 py-5 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
            
            <button 
              onClick={handleDelete} 
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2.5 rounded-lg transition-colors text-sm font-semibold"
            >
              <Trash2 size={18} /> Delete Listing
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={() => navigate("/myproducts")} 
                className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-300 bg-white text-slate-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={saving}
                className={`flex-1 sm:flex-none px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm ${saving ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;