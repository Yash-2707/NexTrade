import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios'; // ✅ Use centralized API
import {
  Heart,
  Share2,
  MapPin,
  Star,
  Phone,
  MessageSquare,
  ShieldAlert,
  MoreVertical,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

// --- Sub-Components ---

const Breadcrumbs = ({ title }) => (
  <nav className="flex items-center text-sm text-slate-500 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
    <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
    <ChevronRight size={16} className="mx-2 text-slate-400 flex-shrink-0" />
    <Link to="/productlist" className="hover:text-blue-600 transition-colors">Products</Link>
    <ChevronRight size={16} className="mx-2 text-slate-400 flex-shrink-0" />
    <span className="text-slate-900 font-medium truncate">{title || "Product"}</span>
  </nav>
);

const ImageGallery = ({ images, isFeatured }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) return (
    <div className="bg-gray-100 h-96 rounded-2xl flex items-center justify-center text-slate-400">
      No Images Available
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Main Large Image */}
      <div className="relative bg-white rounded-2xl overflow-hidden aspect-[4/3] border border-gray-100 shadow-sm group">
        <img
          src={images[selectedImage]}
          alt="Product Main"
          className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
        />

        {isFeatured && (
          <span className="absolute top-4 left-4 bg-yellow-400 text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Featured
          </span>
        )}
        
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white p-2.5 rounded-full shadow-lg text-slate-700 hover:text-red-500 hover:bg-red-50 transition-colors">
            <Heart size={20} />
          </button>
          <button className="bg-white p-2.5 rounded-full shadow-lg text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Thumbnail List */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((img, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative rounded-xl overflow-hidden bg-gray-50 aspect-square cursor-pointer border-2 transition-all ${
                selectedImage === index ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent hover:border-blue-300'
              }`}
            >
              <img src={img} alt={`Thumb ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductDescription = ({ description }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-8 mt-8 shadow-sm">
    <h2 className="text-xl font-bold text-slate-900 mb-4 border-b border-gray-100 pb-4">Description</h2>
    <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
      {description}
    </p>
  </div>
);

// --- Sidebar Component ---
const Sidebar = ({ data }) => {
  const navigate = useNavigate();
  
  // Safe encode for map url
  const locationQuery = encodeURIComponent(data.location || "India");

  const handleCall = () => {
    if (data.seller.phone) {
      window.location.href = `tel:${data.seller.phone}`;
    } else {
      alert("Seller has not provided a phone number.");
    }
  };

  const handleChat = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const myId = currentUser?._id || currentUser?.id;

    if (!currentUser) {
       navigate("/login");
       return;
    }

    if (!myId) {
       alert("Session Error. Please Logout and Login again.");
       return;
    }

    if (!data?.seller?.id) {
       alert("Error: Cannot find Seller ID.");
       return;
    }

    // Prevent chatting with yourself
    if (myId === data.seller.id) {
        alert("You cannot chat with yourself.");
        return;
    }

    try {
       // ✅ Using Centralized API
       const res = await api.post("/chat/conversation", { 
          senderId: myId, 
          receiverId: data.seller.id 
       });
       
       if (res.data._id) {
          navigate(`/chat/${res.data._id}`);
       } else {
          navigate("/chat");
       }
       
    } catch (err) {
       console.error("Chat Creation Error", err);
       alert("Could not start chat. Try again later.");
    }
  };

  return (
    <div className="space-y-6 sticky top-24">
      
      {/* 1. Price & Details */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            {data.conditionTag}
          </span>
          <span className="text-slate-400 text-xs font-medium">
            Posted {data.postedDate}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">
          {data.title}
        </h1>

        <div className="flex justify-between items-end mb-6">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{data.price}</span>
        </div>

        <div className="space-y-3 pt-6 border-t border-gray-50">
          {Object.entries(data.details).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center text-sm">
              <span className="text-slate-500">{key}</span>
              <span className="text-slate-900 font-semibold truncate max-w-[60%]">{value || "N/A"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Seller Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img
              src={data.seller.image}
              alt={data.seller.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{data.seller.name}</h3>
            <p className="text-xs text-slate-500">Member since {data.seller.memberSince}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleChat}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <MessageSquare size={18} />
            Chat
          </button>

          <button
            onClick={handleCall}
            className="flex items-center justify-center gap-2 bg-white border-2 border-slate-100 hover:border-blue-100 hover:bg-blue-50 text-slate-700 font-bold py-3 rounded-xl transition-all"
          >
            <Phone size={18} />
            Call
          </button>
        </div>
      </div>

      {/* 3. Location Map */}
      <div className="rounded-2xl border border-gray-200 overflow-hidden h-48 relative group">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          title="Location"
          // ✅ FIXED MAP URL
          src={`https://maps.google.com/maps?q=${locationQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
          className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
        ></iframe>
        
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2 text-xs font-bold text-slate-800 pointer-events-none">
          <MapPin size={14} className="text-red-500" />
          {data.location}
        </div>
      </div>

      {/* 4. Safety Tip */}
      <div className="bg-yellow-50 rounded-xl p-4 flex gap-3 border border-yellow-100">
        <ShieldAlert size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-yellow-800 leading-relaxed">
          <strong>Safety Tip:</strong> Never transfer money in advance. Meet the seller in a safe, public location.
        </p>
      </div>

    </div>
  );
};

// --- Main Page Component ---
const ProductPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        const product = response.data;

        const formatDate = (dateString) => {
          if (!dateString) return "Recently";
          return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        };

        const getSellerImage = (seller) => {
          if (seller?.profilePic) return seller.profilePic;
          return `https://ui-avatars.com/api/?name=${encodeURIComponent(seller?.name || "User")}&background=random&color=fff`;
        };

        const formattedProduct = {
          id: product._id,
          title: product.title,
          price: new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(product.price),
          location: product.location || "Unknown Location",
          postedDate: formatDate(product.createdAt),
          conditionTag: product.condition ? (product.condition.charAt(0).toUpperCase() + product.condition.slice(1)) : "Used",
          isFeatured: false,
          
          // ✅ BRAND LOGIC
          details: {
            Category: product.category?.charAt(0).toUpperCase() + product.category?.slice(1) || "N/A",
            ...(product.brand ? { Brand: product.brand } : {}), // Shows "Brand" only if exists
            Condition: product.condition || "N/A",
          },
          
          description: product.description,
          images: product.images && product.images.length > 0
            ? product.images.map(img => img.url)
            : [],
          
          seller: {
            id: product.seller?._id, 
            name: product.seller?.name || "Verified Seller",
            memberSince: formatDate(product.seller?.createdAt),
            image: getSellerImage(product.seller),
            phone: product.seller?.phone || ""
          }
        };

        setData(formattedProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-slate-600">
      <AlertCircle size={48} className="text-gray-300 mb-4" />
      <p className="text-lg font-semibold">Product not found</p>
      <Link to="/" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
        Go Home
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <Breadcrumbs title={data.title} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Images & Desc */}
          <div className="lg:col-span-2">
            <ImageGallery images={data.images} isFeatured={data.isFeatured} />
            <ProductDescription description={data.description} />
          </div>

          {/* Right: Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar data={data} />
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default ProductPage;