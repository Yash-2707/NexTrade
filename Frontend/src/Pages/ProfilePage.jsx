import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios"; // ✅ Use centralized API
import {
  Mail,
  Store,
  Camera,
  X,
  Upload,
  UserPen,
  Loader2,
  MapPin,
  Phone,
  Info,
  LogOut,
  Package,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const presetAvatars = [
    "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    "https://cdn-icons-png.flaticon.com/512/4140/4140037.png",
    "https://cdn-icons-png.flaticon.com/512/4140/4140047.png",
    "https://cdn-icons-png.flaticon.com/512/4140/4140051.png"
  ];

  // ✅ FIXED: Load from LocalStorage AND Fetch Fresh Data
  useEffect(() => {
    const token = localStorage.getItem("token");
    let storedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
      return;
    }

    // 1. Instant Load (Optimistic UI) - Show old data while loading new
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // 2. Fetch Fresh Data from Database
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/profile"); // Call the new endpoint
        
        // Update State
        setUser(res.data);
        
        // Update LocalStorage so next refresh is faster
        localStorage.setItem("user", JSON.stringify(res.data));
        
      } catch (err) {
        console.error("Failed to fetch fresh profile:", err);
        // If 401 Unauthorized, force logout
        if (err.response && err.response.status === 401) {
            handleLogout();
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2MB");
      return;
    }

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await api.put("/user/update-profile-pic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update state and storage
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      setIsEditingPhoto(false);
      alert("Profile photo updated successfully!");
      
      // Trigger navbar update
      window.dispatchEvent(new Event("storage"));

    } catch (err) {
      console.error("Upload failed", err);
      setError(err.response?.data?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const selectPreset = (url) => {
    // Optimistic update
    const updatedUser = { ...user, profilePic: url };
    
    // Update State & LocalStorage
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditingPhoto(false);
    
    // Trigger navbar update
    window.dispatchEvent(new Event("storage"));
    
    // Note: In a real app, you should also send this URL to the backend here via API
  };

  if (!user) return null;

  const memberSince = new Date(user.createdAt || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 pb-12">
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight size={16} className="text-slate-400" />
          <span className="text-slate-800 font-medium">My Profile</span>
        </nav>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative">

          <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-600 w-full relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          <div className="px-6 pb-8 md:px-10">
            
            <div className="relative -mt-16 mb-6 flex justify-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                  <div className="w-full h-full rounded-full overflow-hidden relative bg-slate-100">
                    <img
                      src={user.profilePic || presetAvatars[0]}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setIsEditingPhoto(true)}
                  className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full shadow-lg border-2 border-white hover:bg-blue-700 transition-all hover:scale-110 active:scale-95"
                  title="Change Photo"
                >
                  <Camera size={18} />
                </button>
              </div>
            </div>

            <div className="text-center border-b border-gray-100 pb-8 mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{user.name}</h1>
              
              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                <Store size={14} />
                {user.role} Account
              </div>

              {/* ✅ BIO SECTION */}
              <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
                {user.bio ? user.bio : "No bio added yet. Tell others about yourself!"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-10 h-10 bg-white text-blue-500 rounded-full flex items-center justify-center shadow-sm">
                  <Mail size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-slate-400 font-bold uppercase">Email</p>
                  <p className="text-slate-800 font-medium truncate" title={user.email}>{user.email}</p>
                </div>
              </div>

              {/* ✅ PHONE SECTION */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-10 h-10 bg-white text-green-500 rounded-full flex items-center justify-center shadow-sm">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Phone</p>
                  <p className="text-slate-800 font-medium">{user.phone || "Not provided"}</p>
                </div>
              </div>

              {/* ✅ LOCATION SECTION */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-10 h-10 bg-white text-red-500 rounded-full flex items-center justify-center shadow-sm">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Location</p>
                  <p className="text-slate-800 font-medium">{user.location || "Location not set"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-10 h-10 bg-white text-purple-500 rounded-full flex items-center justify-center shadow-sm">
                  <Info size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Joined</p>
                  <p className="text-slate-800 font-medium">{memberSince}</p>
                </div>
              </div>

            </div>

            <div className="space-y-3">
              {user.role === "seller" && (
                <button
                  onClick={() => navigate("/myproducts")}
                  className="w-full bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 p-4 rounded-xl flex items-center gap-4 transition-all group shadow-sm"
                >
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Package size={24} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-slate-900">My Products</h3>
                    <p className="text-sm text-slate-500">Manage your listings and sales</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500" />
                </button>
              )}

              <button
                onClick={() => navigate("/editprofile")} 
                className="w-full bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 p-4 rounded-xl flex items-center gap-4 transition-all group shadow-sm"
              >
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserPen size={24} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-slate-900">Edit Details</h3>
                  <p className="text-sm text-slate-500">Update name, phone, bio and location</p>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-500" />
              </button>

              <button
                onClick={handleLogout}
                className="w-full mt-6 border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
            
            <div className="text-center text-xs text-slate-300 mt-8 font-mono">
              ID: {user._id}
            </div>

          </div>
        </div>
      </div>

      {isEditingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
            
            {isUploading && (
              <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
                <p className="text-sm font-bold text-slate-700">Uploading...</p>
              </div>
            )}

            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-slate-900">Update Profile Photo</h3>
              <button onClick={() => setIsEditingPhoto(false)} className="p-1 hover:bg-gray-200 rounded-full text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div
                onClick={() => fileInputRef.current.click()}
                className="group border-2 border-dashed border-blue-200 bg-blue-50/30 hover:bg-blue-50 hover:border-blue-400 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                   <Upload size={24} className="text-blue-500" />
                </div>
                <p className="text-sm text-blue-600 font-bold">Upload New Photo</p>
                <p className="text-xs text-slate-400 mt-1">JPG, PNG up to 2MB</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <span className="relative bg-white px-3 text-xs font-medium text-slate-400 uppercase">Or Choose Avatar</span>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {presetAvatars.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => selectPreset(url)}
                    className="aspect-square rounded-full border-2 border-transparent hover:border-blue-500 hover:ring-2 hover:ring-blue-100 transition-all overflow-hidden bg-gray-100"
                  >
                    <img src={url} alt={`Avatar ${index}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;