import React, { useState } from 'react';
import {
  Upload,
  X,
  MapPin,
  ArrowRight,
  ChevronDown,
  DollarSign,
} from 'lucide-react';
import Navbar from '../Component/Navbar';

const AddProduct = () => {
  // Product fields state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("new");
  const [location, setLocation] = useState("");

  // Images state
  const [images, setImages] = useState([]); // File objects
  const [previewImages, setPreviewImages] = useState([]); // Preview URLs

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Limit files > 3MB
    const validFiles = files.filter(file => file.size <= 3 * 1024 * 1024);
    if (validFiles.length !== files.length) {
      alert("Some files exceed 3MB and were not added");
    }

    setImages(prev => [...prev, ...validFiles]);

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
  };

  // Remove selected image
  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!title || !category || !price || !description || !condition || !location || images.length === 0) {
      alert("Please fill all fields and select at least one image.");
      return;
    }

    if (isNaN(price) || Number(price) <= 0) {
      alert("Price must be a valid number greater than 0.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("price", Number(price));
      formData.append("description", description);
      formData.append("condition", condition);
      formData.append("location", location);

      images.forEach(file => formData.append("images", file));

      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT if backend protected
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
      } else {
        alert("Product created successfully!");
        // Reset all fields
        setTitle("");
        setCategory("");
        setPrice("");
        setDescription("");
        setCondition("new");
        setLocation("");
        setImages([]);
        setPreviewImages([]);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 p-4 md:p-8">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <span>Dashboard</span>
            <span>›</span>
            <span className="text-slate-800 font-medium">Sell</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create New Listing</h1>
          <p className="text-slate-500 mt-2">Fill in the details below to list your item for sale.</p>
        </div>

        {/* Main Grid Layout */}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN - Forms */}
          <div className="lg:col-span-2 space-y-8">

            {/* Item Details Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Item Details</h2>

              <div className="space-y-6">

                {/* Product Title */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Product Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                    placeholder="e.g., iPhone 12 Pro Max - 256GB"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm bg-slate-50/30 text-slate-700 placeholder:text-slate-400"
                  />
                </div>

                {/* Category & Condition Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">Category</label>
                    <div className="relative">
                      <select 
                      value={category}
                      onChange={(e)=>setCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm bg-slate-50/30 text-slate-700 appearance-none cursor-pointer">
                        <option>Select a category</option>
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

                  {/* Condition */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">Condition</label>
                    <div className="flex bg-slate-50 rounded-lg p-1 border border-gray-200">
                      <button
                        type='button'
                        onClick={() => setCondition('new')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${condition === 'new' ? 'bg-white text-blue-600 shadow-sm border border-gray-100' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        New
                      </button>
                      <button
                        type='button'
                        onClick={() => setCondition('used')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${condition === 'used' ? 'bg-white text-blue-600 shadow-sm border border-gray-100' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Used
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Price</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <DollarSign size={18} />
                    </div>
                    <input
                      type="number"
                      value={price}
                      onChange={(e)=>setPrice(e.target.value)}  
                      placeholder="0.00"
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm bg-slate-50/30 text-slate-700"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold tracking-wide">
                      USD
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Description</label>
                  <div className="relative">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      maxLength={20000}
                      rows="10"
                      placeholder="Describe the item you are selling. Include details about condition, features, and reason for selling."
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm bg-slate-50/30 text-slate-700 placeholder:text-slate-400 resize-none"
                    ></textarea>
                    <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                      {description.length}/20000 characters
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Location</h2>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">City or Zip Code</label>
                <div className="relative group">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., New York, NY 10001"
                    defaultValue="New York, NY 10001"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-slate-800 bg-slate-50/30"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - Photos & Actions */}
          <div className="space-y-8">

            {/* Photos Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Photos</h2>

              {/* Upload Zone */}
              <div
                className="border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all group"
                onClick={() => document.getElementById("imageInput").click()}
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform text-blue-500">
                  <Upload size={20} />
                </div>
                <p className="text-sm font-semibold text-blue-600 mb-1">Click to upload <span className="text-slate-600 font-normal">or drag and drop</span></p>
                <p className="text-xs text-slate-400">SVG, PNG, JPG or GIF (max. 3MB)</p>
                <input
                  type="file"
                  id="imageInput"
                  multiple
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {/* Previews */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                {previewImages.length > 0 ? previewImages.map((src, index) => (
                  <div key={index} className="relative aspect-square bg-gray-50 rounded-lg border border-gray-200 p-2 flex items-center justify-center group">
                    <img src={src} alt={`Preview-${index}`} className="w-20 h-auto opacity-90" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )) : (
                  <div className="aspect-square bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center text-xs text-slate-400 font-medium">
                    Preview
                  </div>
                )}
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  Submit Listing
                  <ArrowRight size={18} />
                </button>
                <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 font-bold py-3 rounded-lg transition-colors">
                  Cancel
                </button>
              </div>
              <p className="text-xs text-slate-400 text-center mt-4 px-2 leading-relaxed">
                By clicking "Submit Listing", you agree to our <a href="#" className="text-blue-500 underline hover:text-blue-600">Terms of Service</a>.
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
