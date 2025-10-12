import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentUser } from './slices/authSlice'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Confirm from './pages/Confirm'
import Feedback from './pages/Feedback'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import CustomerDashboard from './pages/CustomerDashboard'
import ManagerDashboard from './pages/ManagerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Announcements from './pages/Announcements'
import Reports from './pages/Reports'
import Profile from './pages/Profile'
import SystemConfig from './pages/SystemConfig'

export default function App() {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    // Check if user has a token and get current user data
    if (token) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, token])
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/customer-dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/manager-dashboard" element={<ProtectedRoute roles={['manager', 'admin']}><ManagerDashboard /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/manager" element={<ProtectedRoute roles={['manager', 'admin']}><ManagerDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute roles={['manager', 'admin']}><Reports /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/system-config" element={<ProtectedRoute roles={['admin']}><SystemConfig /></ProtectedRoute>} />
        </Routes>
      </div>
      <footer className="mt-12 py-10 text-center text-sm text-gray-600">
        <div className="container-px">© {new Date().getFullYear()} EaseCart</div>
      </footer>
    </div>
  )
}
