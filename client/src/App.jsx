import React, { useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
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
import Contact from './pages/Contact'
import SupportTickets from './pages/SupportTickets'
import Wishlist from './pages/Wishlist'
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
    <div className="flex min-h-screen flex-col bg-transparent">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support-tickets" element={<ProtectedRoute><SupportTickets /></ProtectedRoute>} />
          <Route path="/wishlist" element={<Wishlist />} />
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
      <footer className="mt-auto border-t border-slate-200/80 bg-white/60 py-12 backdrop-blur-md">
        <div className="container-px">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 font-extrabold tracking-tight text-slate-900">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-[10px] font-black text-white shadow-soft">
                  EC
                </span>
                EaseCart
              </div>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600">
                Curated tech and everyday essentials with a checkout flow built for speed and clarity.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Shop</p>
              <ul className="mt-4 space-y-2 text-sm font-medium text-slate-600">
                <li>
                  <Link to="/#catalog" className="transition hover:text-blue-600">
                    Catalog
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="transition hover:text-blue-600">
                    Cart
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" className="transition hover:text-blue-600">
                    Wishlist
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Support</p>
              <ul className="mt-4 space-y-2 text-sm font-medium text-slate-600">
                <li>
                  <Link to="/contact" className="transition hover:text-blue-600">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/feedback" className="transition hover:text-blue-600">
                    Feedback
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="transition hover:text-blue-600">
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200/80 pt-8 text-center text-sm text-slate-500 sm:flex-row sm:text-left">
            <span>© {new Date().getFullYear()} EaseCart. All rights reserved.</span>
            <span className="text-slate-400">Built for learning and demos.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
