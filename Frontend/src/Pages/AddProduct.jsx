import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import {
  Upload,
  X,
  MapPin,
  ArrowRight,
  ChevronDown,
  Tag,
  FileText,
  Image as ImageIcon,
  Briefcase,
  AlertCircle
} from 'lucide-react';

const AddProduct = () => {
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("new");
  const [location, setLocation] = useState("");
  
  // File State
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Constants
  const BRAND_REQUIRED_CATEGORIES = ['electronics', 'vehicles', 'fashion'];

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  // Handle Image Selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Filter files > 3MB
    const validFiles = files.filter(file => file.size <= 3 * 1024 * 1024);
    
    if (validFiles.length !== files.length) {
      setError("Some files were skipped because they exceed the 3MB limit.");
    } else {
      setError("");
    }

    setImages(prev => [...prev, ...validFiles]);

    // Create Previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
  };

  // Remove Image
  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => {
      // Revoke the specific URL being removed
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Validation
    if (!title || !category || !price || !description || !condition || !location) {
      return setError("Please fill in all required fields.");
    }
    if (images.length === 0) {
      return setError("Please upload at least one image of your product.");
    }
    if (BRAND_REQUIRED_CATEGORIES.includes(category) && !brand.trim()) {
      return setError(`Brand is required for ${category} items.`);
    }
    if (isNaN(price) || Number(price) <= 0) {
      return setError("Price must be a valid number greater than 0.");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      if (brand) formData.append("brand", brand);
      formData.append("price", Number(price));
      formData.append("description", description);
      formData.append("condition", condition);
      formData.append("location", location);

      images.forEach(file => formData.append("images", file));

      // 2. API Call
      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 3. Success Redirect
      navigate('/myproducts'); // Redirects to dashboard/my-products page

    } catch (err) {
      console.error("Upload Error:", err);
      setError(err.response?.data?.message || "Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-slate-900 pb-12">
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-3">
            <Link to="/" className='hover:text-blue-600 transition-colors'>Home</Link>
            <span className="text-slate-300">/</span>
            <span className="text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-md">Sell Product</span>
          </nav>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Post a New Product</h1>
          <p className="text-slate-500 mt-2 text-lg">Enter the details below to list your item on the marketplace.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT COLUMN - Form Inputs */}
            <div className="lg:col-span-2 space-y-6">

              {/* Error Banner */}
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 animate-pulse">
                  <AlertCircle size={20} />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {/* 1. General Info Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                  <Tag size={18} className="text-blue-600" />
                  <h2 className="font-semibold text-slate-800">General Information</h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Product Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., iPhone 12 Pro Max - 256GB - Blue"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Category</label>
                      <div className="relative">
                        <select
                          value={category}
                          onChange={(e) => {
                            setCategory(e.target.value);
                            if (!BRAND_REQUIRED_CATEGORIES.includes(e.target.value)) {
                              setBrand("");
                            }
                          }}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 appearance-none bg-white cursor-pointer"
                        >
                          <option value="" disabled>Select Category</option>
                          <option value="electronics">Electronics</option>
                          <option value="furniture">Furniture</option>
                          <option value="vehicles">Vehicles</option>
                          <option value="fashion">Fashion</option>
                          <option value="books">Books</option>
                          <option value="others">Others</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                      </div>
                    </div>

                    {/* Condition (Segmented Control) */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Condition</label>
                      <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setCondition('new')}
                          className={`py-2 text-sm font-medium rounded-md transition-all duration-200 ${condition === 'new'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                          New
                        </button>
                        <button
                          type="button"
                          onClick={() => setCondition('used')}
                          className={`py-2 text-sm font-medium rounded-md transition-all duration-200 ${condition === 'used'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                          Used
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Brand Field (Conditionally Rendered) */}
                  {BRAND_REQUIRED_CATEGORIES.includes(category) && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="block text-sm font-semibold text-slate-700">Brand / Make</label>
                      <div className="relative group">
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            <Briefcase size={18} />
                         </div>
                        <input
                          type="text"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          placeholder="e.g., Apple, Samsung, Honda, Nike"
                          className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800"
                        />
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Price</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors font-bold text-lg">
                        ₹
                      </div>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        onWheel={(e) => e.target.blur()} // Prevents scrolling to change number
                        placeholder="0.00"
                        className="w-full pl-10 pr-16 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 font-medium"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                        INR
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Details Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                  <FileText size={18} className="text-blue-600" />
                  <h2 className="font-semibold text-slate-800">Description & Location</h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Description</label>
                    <div className="relative">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={2000}
                        rows="6"
                        placeholder="Tell buyers about your product features, condition, and why you are selling it..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 resize-none"
                      ></textarea>
                      <div className="absolute bottom-3 right-3 text-xs font-medium text-slate-400 bg-white pl-2">
                        {description.length} / 2000
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Location</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <MapPin size={18} />
                      </div>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, State or Zip Code"
                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Photos & Actions */}
            <div className="space-y-6">

              {/* Image Upload Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                  <ImageIcon size={18} className="text-blue-600" />
                  <h2 className="font-semibold text-slate-800">Product Images</h2>
                </div>

                <div className="p-6">
                  {/* Upload Area */}
                  <div
                    onClick={() => document.getElementById("imageInput").click()}
                    className="group border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/30 hover:bg-blue-50 transition-all rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer min-h-[200px]"
                  >
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-blue-500 group-hover:scale-110 group-hover:text-blue-600 transition-all">
                      <Upload size={24} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1">Click to upload images</h3>
                    <p className="text-xs text-slate-500 mb-4">or drag and drop here</p>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Max 3MB per file</span>

                    <input
                      type="file"
                      id="imageInput"
                      multiple
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>

                  {/* Image Previews Grid */}
                  {previewImages.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Selected Images ({previewImages.length})</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {previewImages.map((src, index) => (
                          <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                            <img src={src} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="bg-white text-red-500 p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg transform active:scale-[0.98] ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Posting..." : "Post Now"}
                  {!loading && <ArrowRight size={18} />}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate(-1)} // Go back to previous page
                  className="w-full mt-3 bg-white border border-gray-300 hover:bg-gray-50 text-slate-700 font-semibold py-3.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                
                <p className="text-center text-xs text-slate-400 mt-4 px-4 leading-relaxed">
                  By posting, you agree to our <span className="text-blue-600 cursor-pointer hover:underline">Terms of Service</span> and <span className="text-blue-600 cursor-pointer hover:underline">Privacy Policy</span>.
                </p>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;