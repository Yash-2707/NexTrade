import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Heart,
  Share2,
  MapPin,
  Star,
  Phone,
  MessageSquare,
  ShieldAlert,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import Navbar from '../Component/Navbar';

// --- Sub-Components ---

const Breadcrumbs = ({ title }) => (
  <div className="flex items-center text-sm text-slate-500 mb-6 overflow-x-auto whitespace-nowrap">
    <a href="/" className="hover:text-blue-600">Home</a>
    <ChevronRight size={16} className="mx-2 text-slate-400 flex-shrink-0" />
    <a href="#" className="hover:text-blue-600">Products</a>
    <ChevronRight size={16} className="mx-2 text-slate-400 flex-shrink-0" />
    <span className="text-slate-800 font-medium truncate">{title || "Product"}</span>
  </div>
);

const ImageGallery = ({ images, isFeatured }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  // Guard clause if images are missing
  if (!images || images.length === 0) return <div className="bg-gray-200 h-96 rounded-xl flex items-center justify-center">No Images</div>;

  return (
    <div className="space-y-4">
      {/* Main Large Image */}
      <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-[4/3] border border-gray-200">
        <img
          src={images[selectedImage]}
          alt="Product Main"
          className="w-full h-full object-contain object-center"
        />

        {/* Tags & Actions over image */}
        {isFeatured && (
          <span className="absolute top-4 left-4 bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase shadow-sm">
            Featured
          </span>
        )}
        <div className="absolute bottom-4 right-4 flex gap-3">
          <button className="bg-white p-2.5 rounded-full shadow-md text-slate-700 hover:text-red-500 transition-colors">
            <Heart size={20} />
          </button>
          <button className="bg-white p-2.5 rounded-full shadow-md text-slate-700 hover:text-blue-600 transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Thumbnail List */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.slice(0, 3).map((img, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative rounded-lg overflow-hidden bg-gray-100 aspect-square cursor-pointer border-2 transition-all ${selectedImage === index ? 'border-blue-600' : 'border-transparent hover:border-blue-300'
                }`}
            >
              <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
          {/* Placeholder if there are more than 3 images */}
          {images.length > 3 && (
            <div className="rounded-lg overflow-hidden bg-gray-200 aspect-square cursor-pointer flex items-center justify-center text-slate-500 font-medium text-sm hover:bg-gray-300 transition-colors">
              +{images.length - 3} more
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ProductDescription = ({ description }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 mt-8 shadow-sm">
    <h2 className="text-xl font-bold text-slate-900 mb-4">Description</h2>
    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
      {description}
    </p>
  </div>
);

const Sidebar = ({ data }) => {
  // Safe encode for map url
  const locationQuery = encodeURIComponent(data.location || "New York, USA");
  
  return (
    <div className="space-y-6">
      {/* 1. Product Price & Details Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md">
            {data.conditionTag}
          </span>
          <span className="text-slate-500 text-sm flex items-center gap-1">
            <span className="inline-block w-4 h-4 bg-gray-200 rounded-full"></span>
            {data.postedDate}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          {data.title}
        </h1>

        <div className="flex justify-between items-center mb-6">
          <span className="text-3xl font-bold text-blue-600">{data.price}</span>
          <div className="flex items-center text-slate-500 text-sm">
            <MapPin size={16} className="mr-1" />
            {data.location}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-y-4 text-sm border-t border-gray-100 pt-6">
          {Object.entries(data.details).map(([key, value]) => (
            <div key={key}>
              <dt className="text-slate-500 mb-1">{key}</dt>
              <dd className="text-slate-900 font-semibold">{value || "N/A"}</dd>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Seller Information Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-900">Seller Information</h2>
          <button className="text-slate-400 hover:text-slate-600">
            <MoreVertical size={20} />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img
              src={data.seller.image}
              alt={data.seller.name}
              className="w-16 h-16 rounded-full object-cover border border-gray-200"
            />
            {data.seller.isOnline && (
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{data.seller.name}</h3>
            {/* Conditional Rendering for Rating - only show if reviews exist */}
            {data.seller.reviews > 0 ? (
                <div className="flex items-center text-sm mt-1">
                <Star size={16} className="text-yellow-400 fill-current mr-1" />
                <span className="font-semibold mr-1">{data.seller.rating}</span>
                <span className="text-slate-500">({data.seller.reviews} reviews)</span>
                </div>
            ) : (
                <div className="flex items-center text-sm mt-1 text-slate-500">
                    No reviews yet
                </div>
            )}
            
            <p className="text-slate-500 text-xs mt-1">Member since {data.seller.memberSince}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <Phone size={20} />
            Contact Seller
          </button>
          <button className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <MessageSquare size={20} />
            Chat Now
          </button>
        </div>
      </div>

      {/* 3. Safety Tip Card */}
      <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 flex gap-4 shadow-sm">
        <ShieldAlert size={28} className="text-blue-600 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Safety Tip</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Avoid paying in advance. Meet in a safe, public place to inspect the item before buying.
          </p>
        </div>
      </div>

      {/* 4. Map Location Card (Dynamic Embed) */}
      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm h-56 relative group bg-gray-100">
         {/* Live Google Maps Embed Iframe - No API Key required for basic embed */}
         <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight="0" 
            marginWidth="0" 
            title="Seller Location"
            src={`https://maps.google.com/maps?q=${locationQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
         ></iframe>
         
         {/* Overlay Label */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 font-medium text-xs text-slate-800 pointer-events-none">
          <MapPin size={14} className="text-red-500" fill="currentColor" />
          {data.location}
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

const ProductPage = () => {
  const { id } = useParams();
  const productId = id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch product from backend by ID
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        const product = await response.json();

        if (!response.ok) {
          console.error(product.message);
          setLoading(false);
          return;
        }

        // Helper to format date
        const formatDate = (dateString) => {
            if (!dateString) return "N/A";
            const date = new Date(dateString);
            return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' }); // e.g., October 2023
        };

        // Determine Seller Image (Use real image, or generate one based on initials)
        const getSellerImage = (seller) => {
            if (seller?.image) return seller.image;
            if (seller?.profileImage) return seller.profileImage;
            const name = seller?.name || "User";
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
        };

        // Transform backend data
        const formattedProduct = {
          id: product._id,
          title: product.title,
          price: `$${product.price}`,
          location: product.location || "Unknown Location",
          postedDate: formatDate(product.createdAt),
          conditionTag: product.condition ? (product.condition.charAt(0).toUpperCase() + product.condition.slice(1)) : "Used",
          isFeatured: false, 
          details: {
            Brand: product.brand || "Generic",
            Model: product.title, // Or specific model field if you have it
            Condition: product.condition || "N/A",
            Category: product.category || "N/A"
          },
          description: product.description,
          images: product.images && product.images.length > 0 
            ? product.images.map(img => img.url) 
            : ["https://via.placeholder.com/600x400?text=No+Image"], // Fallback image
          
          // REAL SELLER MAPPING
          seller: {
            id: product.seller?._id,
            name: product.seller?.name || "Verified Seller",
            rating: product.seller?.rating || 0, // Assuming 0 if new seller
            reviews: product.seller?.reviews || 0,
            memberSince: formatDate(product.seller?.createdAt || new Date()),
            isOnline: true, // You might need a socket logic for real 'online' status, true is fine for UI demo
            image: getSellerImage(product.seller)
          }
        };

        setData(formattedProduct);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-slate-600">
        <ShieldAlert size={48} className="text-red-400 mb-4" />
        <p className="text-lg font-semibold">Product not found</p>
        <a href="/" className="mt-4 text-blue-600 hover:underline">Go back home</a>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pass dynamic title to breadcrumbs */}
        <Breadcrumbs title={data.title} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Description */}
          <div className="lg:col-span-2">
            <ImageGallery images={data.images} isFeatured={data.isFeatured} />
            <ProductDescription description={data.description} />
          </div>

          {/* Right Column - Details & Seller Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar data={data} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;