import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Mail,
    Store,
    ShieldCheck,
    ChevronDown,
    LogOut,
    Home
} from 'lucide-react';


const ProfilePage = () => {
    // Mock User Data
    const navigate = useNavigate();
    const [user, setUser] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
            navigate("/login"); // ❌ Not logged in
            return;
        }

        setUser(JSON.parse(storedUser));
    }, [navigate]);

    // 🚪 Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    // ⏳ Prevent crash before data loads
    if (!user) return null;

    // 📅 Format date
    const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
    });

    if (!user) return null; // avoid UI flash

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-slate-900 p-4 md:p-8">

            <div className="max-w-xl mx-auto">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <Home size={16} className="text-slate-400" />
                    <span>Home</span>
                    <span className="text-slate-300">›</span>
                    <span className="text-slate-800 font-medium">My Profile</span>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">

                    {/* Blue Header Banner */}
                    <div className="h-32 bg-blue-500 w-full relative"></div>

                    {/* Profile Content */}
                    <div className="px-8 pb-8">

                        {/* Avatar - Negative margin to overlap banner */}
                        <div className="relative -mt-16 mb-4 flex justify-center">
                            <div className="p-1.5 bg-white rounded-full">
                                <div className="w-28 h-28 rounded-full bg-orange-100 overflow-hidden border-4 border-white shadow-sm flex items-center justify-center">
                                    {/* Using a vector-style avatar to match the UI aesthetic closely */}
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="text-center space-y-3 mb-10">
                            <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>

                            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                                <Mail size={16} />
                                <span>{user.email}</span>
                            </div>

                            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold mt-2">
                                <Store size={16} />
                                <span>{user.role === "seller" ? "Seller" : "Buyer"}</span>
                            </div>
                        </div>

                        {/* Security Settings Section */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold">
                                <ShieldCheck className="text-blue-500" size={20} />
                                <h3>Security Settings</h3>
                            </div>

                            {/* Change Password Accordion/Button */}
                            <button className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-lg p-4 flex items-center justify-between transition-colors group text-left">
                                <div>
                                    <p className="font-semibold text-slate-900 text-sm">Change Password</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Update your password to keep your account secure</p>
                                </div>
                                <ChevronDown size={20} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                            </button>
                        </div>

                        {/* Sign Out Button */}
                        <button
                            onClick={handleLogout}

                            className="w-full border border-red-100 text-red-500 hover:bg-red-50 font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors mb-6">
                            <LogOut size={18} />
                            Sign Out
                        </button>

                        {/* Footer Meta */}
                        <div className="text-center text-xs text-slate-400">
                            <p>Member since {memberSince} • Mini OLX </p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfilePage;