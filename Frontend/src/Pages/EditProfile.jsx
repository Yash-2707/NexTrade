import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { User, Phone, MapPin, FileText, Save, ArrowLeft, Loader2 } from 'lucide-react';

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    bio: ""
  });

  // Load current data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user/profile");
        setFormData({
          name: res.data.name || "",
          phone: res.data.phone || "",
          location: res.data.location || "",
          bio: res.data.bio || ""
        });
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.put("/user/update-details", formData);
      
      // Update LocalStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      // Dispatch event to update navbar
      window.dispatchEvent(new Event("storage"));

      navigate("/profile");
    } catch (error) {
      alert("Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 py-10">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                placeholder="Your Name"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                placeholder="City, State"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Bio / About Me</label>
            <div className="relative">
              <FileText className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                placeholder="Tell us a little about yourself..."
              ></textarea>
            </div>
          </div>

          {/* Save Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-600/20 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditProfile;