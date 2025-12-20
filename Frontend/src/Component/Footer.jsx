import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Brand & About */}
          <div className="space-y-6">
            <Logo />
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              The next-generation marketplace to buy, sell, and discover amazing deals near you. Safe, fast, and local.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm hover:shadow-md"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="font-bold text-slate-900 mb-6 text-base tracking-wide uppercase">Quick Links</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link to="/" className="hover:text-blue-600 hover:underline transition-all">Home</Link></li>
              <li><Link to="/productlist" className="hover:text-blue-600 hover:underline transition-all">Browse Products</Link></li>
              <li><Link to="/addproduct" className="hover:text-blue-600 hover:underline transition-all">Sell Item</Link></li>
              <li><Link to="/chat" className="hover:text-blue-600 hover:underline transition-all">Messages</Link></li>
            </ul>
          </div>

          {/* 3. Support */}
          <div>
            <h3 className="font-bold text-slate-900 mb-6 text-base tracking-wide uppercase">Support</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-blue-600 hover:underline transition-all">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-600 hover:underline transition-all">Safety Tips</a></li>
              <li><a href="#" className="hover:text-blue-600 hover:underline transition-all">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-600 hover:underline transition-all">Privacy Policy</a></li>
            </ul>
          </div>

          {/* 4. Contact Info */}
          <div>
            <h3 className="font-bold text-slate-900 mb-6 text-base tracking-wide uppercase">Contact Us</h3>
            <ul className="space-y-5 text-sm text-slate-500">
              <li className="flex items-start gap-3 group">
                <MapPin size={20} className="text-blue-600 shrink-0 mt-0.5 group-hover:text-blue-700 transition-colors" />
                <span className="leading-relaxed">123 Market Street,<br />Tech City, India 400001</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone size={20} className="text-blue-600 shrink-0 group-hover:text-blue-700 transition-colors" />
                <span className="group-hover:text-slate-700 transition-colors">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail size={20} className="text-blue-600 shrink-0 group-hover:text-blue-700 transition-colors" />
                <span className="group-hover:text-slate-700 transition-colors">support@nextrade.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-slate-400 text-sm">
            © {currentYear} <span className="font-semibold text-slate-600">NexTrade</span>. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Cookies</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;