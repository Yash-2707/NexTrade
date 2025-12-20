import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Page Imports
import Home from './Pages/Home';
import LoginPage from './Pages/Loginpage'; // Ensure capitalization matches file
import SignupPage from './Pages/SignupPage';
import AllCategories from './Pages/AllCategoriesPage';
import ProductList from './Pages/ProductList';
import ProductPage from './Pages/ProductPage';
import AddProduct from './Pages/AddProduct';
import EditProduct from './Pages/EditProduct';
import MyProducts from './Pages/MyProducts';
import ProfilePage from './Pages/ProfilePage';
import EditProfile from './Pages/EditProfile';
import ChatPage from './Pages/ChatPage';

// Component Imports
import Navbar from './Component/Navbar';
import Footer from './Component/Footer';

// --- Utility: Scroll To Top ---
// This ensures the page always starts at the top when navigating
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- Utility: Protected Route ---
// This redirects unauthenticated users to the Login page
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const location = useLocation();

  // Pages where we hide the footer (Chat needs full height, Auth pages look cleaner without it)
  const hideFooterRoutes = ['/chat', '/login', '/signup'];
  const showFooter = !hideFooterRoutes.some(path => location.pathname.startsWith(path));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* Utility to handle scrolling */}
      <ScrollToTop />

      {/* Navbar is visible everywhere */}
      <Navbar />

      {/* Main Content Area - Grows to fill space */}
      <main className="flex-grow">
        <Routes>
          
          {/* --- PUBLIC ROUTES (Accessible by everyone) --- */}
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/productlist' element={<ProductList />} />
          <Route path='/allcategories' element={<AllCategories />} />
          <Route path='/product/:id' element={<ProductPage />} />

          {/* --- PROTECTED ROUTES (Login Required) --- */}
          
          {/* Seller Actions */}
          <Route path='/addproduct' element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          } />
          
          <Route path='/editproduct/:id' element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          } />
          
          <Route path='/myproducts' element={
            <ProtectedRoute>
              <MyProducts />
            </ProtectedRoute>
          } />

          {/* Profile Actions */}
          <Route path='/profile' element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path='/editprofile' element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          } />

          {/* Chat System */}
          <Route path='/chat' element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />
          
          <Route path='/chat/:chatId' element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />

        </Routes>
      </main>

      {/* Conditional Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

export default App;