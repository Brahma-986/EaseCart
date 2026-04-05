import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../slices/authSlice'

export default function Navbar() {
  const dispatch = useDispatch()
  const { totalItems } = useSelector((state) => state.cart)
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const wishlistCount = useSelector((state) => state.engagement.wishlist.length)

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-white/70 text-gray-900' : 'text-gray-700 hover:text-gray-900 hover:bg-white/60'}`

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <nav className="sticky top-0 z-30 bg-white/60 backdrop-blur border-b border-white/60">
      <div className="container-px flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-lg tracking-tight">
          <span className="inline-block h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-soft"></span>
          EaseCart
        </Link>
        <div className="flex items-center gap-1">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/cart" className={linkClass}>
            <span className="mr-1">Cart</span>
            <span className="inline-flex items-center justify-center rounded-md min-w-5 px-1 bg-blue-600 text-white text-xs">{totalItems}</span>
          </NavLink>
          <NavLink to="/wishlist" className={linkClass}>
            <span className="mr-1">Wishlist</span>
            <span className="inline-flex items-center justify-center rounded-md min-w-5 px-1 bg-pink-600 text-white text-xs">{wishlistCount}</span>
          </NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
          <NavLink to="/feedback" className={linkClass}>Feedback</NavLink>

          {isAuthenticated ? (
            <>
              {user?.role === 'customer' && (
                <>
                  <NavLink to="/customer-dashboard" className={linkClass}>Dashboard</NavLink>
                  <NavLink to="/announcements" className={linkClass}>Announcements</NavLink>
                </>
              )}
              {(user?.role === 'manager' || user?.role === 'admin') && (
                <>
                  <NavLink to="/manager-dashboard" className={linkClass}>Manager</NavLink>
                  <NavLink to="/reports" className={linkClass}>Reports</NavLink>
                </>
              )}
              {user?.role === 'admin' && (
                <NavLink to="/admin-dashboard" className={linkClass}>Admin</NavLink>
              )}
              <button onClick={handleLogout} className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white/60">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Login</NavLink>
              <NavLink to="/register" className={linkClass}>Register</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
