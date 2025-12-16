import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Camera,
  ChevronDown,
  MapPin,
  Trash2,
  Save,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';
import Navbar from '../Component/Navbar';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Form state
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]); // for new uploads
  const [existingImages, setExistingImages] = useState([]); // images already uploaded

  // Fetch product details on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const prod = res.data;

        // Pre-fill form
        setTitle(prod.title);
        setPrice(prod.price);
        setCategory(prod.category);
        setCondition(prod.condition || "Used");
        setDescription(prod.description);
        setLocation(prod.location);
        setExistingImages(prod.images || []);
      } catch (err) {
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, token]);


  // Function to remove an existing image
  const removeExistingImage = (indexToRemove) => {
    setExistingImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Function to remove a NEW image
  const removeNewImage = (indexToRemove) => {
    setImages(prev => Array.from(prev).filter((_, idx) => idx !== indexToRemove));
  };

  // Handle form submit
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("condition", condition);
      formData.append("description", description);
      formData.append("location", location);

      // Existing Images (as JSON string)
      formData.append("existingImages", JSON.stringify(existingImages));

      // New Images
      if (images && images.length > 0) {
        Array.from(images).forEach(img => formData.append("images", img));
      }

      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Product updated successfully");
      navigate("/myproducts");
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to update product");
    }
  };

  // Handle product delete
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/myproducts");
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <AlertCircle className="text-red-500" size={48} />
      <p className="text-slate-800 font-semibold">{error}</p>
      <Link to="/myproducts" className="text-blue-600 hover:underline">Go Back</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 pb-12">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Header Section */}
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

        {/* Main Form Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">

            {/* Photos Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Photos</h2>
                  <p className="text-xs text-slate-500 mt-0.5">The first photo will be your cover image.</p>
                </div>
                <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-1 rounded">
                  {existingImages.length + images.length}/5 Used
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                
                {/* 1. Existing Images */}
                {existingImages.map((img, idx) => (
                  <div key={`exist-${idx}`} className="relative aspect-square bg-gray-100 rounded-lg border border-gray-200 group overflow-hidden">
                    <img src={img.url} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeExistingImage(idx)}
                      className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full shadow-sm hover:bg-red-50 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                    {idx === 0 && <span className="absolute bottom-0 left-0 right-0 bg-slate-800/70 text-white text-[10px] text-center py-1 font-medium">Cover</span>}
                  </div>
                ))}

                {/* 2. New Images Preview */}
                {images && Array.from(images).map((file, idx) => (
                  <div key={`new-${idx}`} className="relative aspect-square bg-blue-50 rounded-lg border border-blue-100 group overflow-hidden">
                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover opacity-90" />
                    <button
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full shadow-sm hover:bg-red-50 transition-all"
                    >
                      <X size={14} />
                    </button>
                    <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">New</span>
                  </div>
                ))}

                {/* 3. Add Photo Button */}
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

            {/* Basic Details Section */}
            <section className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Item Details</h2>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-slate-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-slate-900 bg-white"
                  placeholder="e.g. Macbook Pro M1 2020"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700">Category</label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-slate-900 bg-white appearance-none cursor-pointer"
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

                {/* Condition (Added Missing Field) */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700">Condition</label>
                  <div className="relative">
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-slate-900 bg-white appearance-none cursor-pointer"
                    >
                      <option value="New">New</option>
                      <option value="Like New">Like New</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Used">Used</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-slate-700">Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-8 pr-12 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-slate-900 bg-white font-medium"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">INR</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 relative">
                <label className="block text-sm font-bold text-slate-700">Description</label>
                <textarea
                  rows="8"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 pb-8 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-slate-900 bg-white resize-none"
                  placeholder="Describe your product in detail..."
                ></textarea>
                <div className="absolute bottom-3 right-3 text-xs text-slate-400 pointer-events-none bg-white pl-2 pt-1 rounded-tl-md">
                  {description.length} chars
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-slate-700">Location</label>
                <div className="relative group">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-slate-900 bg-white"
                  />
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
                className="flex-1 sm:flex-none px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow"
              >
                <Save size={18} /> Save Changes
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;