import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Store } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = ({ onBack }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));


      if (res.data.user?.role) {
        localStorage.setItem("role", res.data.user.role);
      } else if (res.data.role) {
        localStorage.setItem("role", res.data.role);
      }
      setError("");

      alert("Login successful");
      navigate("/");
      // redirect / close modal

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    // Background with dot pattern simulation
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
      style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '24px 24px' }}>

      <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg w-full max-w-[450px]">

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-blue-600">
            <Store size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome Back</h1>
          <p className="text-slate-500 text-sm">Log in to continue to Mini OLX</p>
        </div>

        {/* Login Form */}
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="email"
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-slate-800 bg-slate-50/30"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-11 pr-11 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-slate-800 bg-slate-50/30"
              />
              <button
                type="button"

                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <a href="#" className="text-blue-600 text-sm font-semibold hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-sm">
            {loading ? "Logging In..." : "Log In"}
          </button>
          {error && (
            <p className="text-red-500 text-sm text-center mt-2">
              {error}
            </p>
          )}
        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup">
              <button onClick={() => { }} className="text-blue-600 font-bold hover:underline">
                Sign Up
              </button>
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;