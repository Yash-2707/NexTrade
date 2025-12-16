import React from 'react'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Home from './Pages/Home'
import LoginPage from './Pages/Loginpage'
import SignupPage from './Pages/SignupPage'
import CategoriesPage from './Pages/CategoriesPage'
import AllCategories from './Pages/AllCategoriesPage'
import ProductPage from './Pages/ProductPage'
import AddProduct from './Pages/AddProduct'
import ProfilePage from './Pages/ProfilePage'
import MyProducts from './Pages/MyProducts'
import EditProduct from './Pages/EditProduct'
import ProductList from './Pages/ProductList'
const App = () => {
  return (
   
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/productlist' element={<ProductList />} />
        <Route path='/category' element={<CategoriesPage />} />
        <Route path='/allcategories' element={<AllCategories />} />
        <Route path='/product/:id' element={<ProductPage />} />
        <Route path='/addproduct' element={<AddProduct />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/myproducts' element={<MyProducts />} />
        <Route path='/editproduct/:id' element={<EditProduct />} />

      </Routes>
   

   
    
   
  )
}

export default App
