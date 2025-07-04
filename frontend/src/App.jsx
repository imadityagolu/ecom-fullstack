import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/admit/Login';
import Register from './components/admit/Register';
import ClientLogin from './components/client/Login';
import ClientRegister from './components/client/Register';
import './App.css'
import AdmitDashboard from './components/admit/Dashboard';
import ClientDashboard from './components/client/Dashboard';
import AdmitProtectedRoute from './components/admit/ProtectedRoute';
import ClientProtectedRoute from './components/client/ProtectedRoute';
import EditClient from './components/admit/EditClient';
import AddProduct from './components/client/AddProduct';
import AllProducts from './components/allproducts/AllProducts';
import UserLogin from './components/users/Login';
import UserRegister from './components/users/Register';
import UserDashboard from './components/users/Dashboard';
import UserProtectedRoute from './components/users/ProtectedRoute';
import PlaceOrder from './components/users/PlaceOrder';
import Cart from './components/users/Cart';
import Wishlist from './components/users/Wishlist';
import ProductDetails from './components/allproducts/ProductDetails';
import ForgotPassword from './components/users/ForgotPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllProducts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <AdmitProtectedRoute>
            <AdmitDashboard />
          </AdmitProtectedRoute>
        } />
        <Route path="/client/login" element={<ClientLogin />} />
        <Route path="/client/register" element={<ClientRegister />} />
        <Route path="/client/dashboard" element={
          <ClientProtectedRoute>
            <ClientDashboard />
          </ClientProtectedRoute>
        } />
        <Route path="/dashboard/client/:id" element={
          <AdmitProtectedRoute>
            <EditClient />
          </AdmitProtectedRoute>
        } />
        <Route path="/client/addproduct" element={
          <ClientProtectedRoute>
            <AddProduct />
          </ClientProtectedRoute>
        } />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/dashboard" element={
          <UserProtectedRoute>
            <UserDashboard />
          </UserProtectedRoute>
        } />
        <Route path="/user/placeorder" element={<PlaceOrder />} />
        <Route path="/user/cart" element={<Cart />} />
        <Route path="/user/wishlist" element={
          <UserProtectedRoute>
            <Wishlist />
          </UserProtectedRoute>
        } />
        <Route path="/user/forgot-password" element={<ForgotPassword />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
