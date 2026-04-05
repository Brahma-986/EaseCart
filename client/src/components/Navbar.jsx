import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../slices/authSlice'

export default function Navbar() {
  const dispatch = useDispatch()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalItems } = useSelector((state) => state.cart)
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const wishlistCount = useSelector((state) => state.engagement.wishlist.length)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const linkClass = ({ isActive }) =>
    `block rounded-xl px-3 py-2.5 text-sm font-semibold transition lg:inline-block ${
      isActive
        ? 'bg-blue-50 text-blue-800 ring-1 ring-blue-100'
        : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
    }`

  const handleLogout = () => {
    dispatch(logout())
    setMenuOpen(false)
  }

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl shadow-nav">
        <div className="container-px flex h-16 items-center justify-between gap-3">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2.5 font-extrabold text-lg tracking-tight text-slate-900"
          >
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-600 text-[10px] font-black uppercase tracking-wider text-white shadow-soft ring-1 ring-white/20"
              aria-hidden
            >
              EC
            </span>
            <span className="hidden sm:inline">EaseCart</span>
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex lg:flex-wrap lg:justify-end">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/cart" className={linkClass}>
              <span className="mr-1.5">Cart</span>
              <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-lg bg-blue-600 px-1.5 text-[11px] font-bold text-white tabular-nums">
                {totalItems}
              </span>
            </NavLink>
            <NavLink to="/wishlist" className={linkClass}>
              <span className="mr-1.5">Wishlist</span>
              <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-lg bg-rose-500 px-1.5 text-[11px] font-bold text-white tabular-nums">
                {wishlistCount}
              </span>
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
            <NavLink to="/contact" className={linkClass}>
              Contact
            </NavLink>
            <NavLink to="/feedback" className={linkClass}>
              Feedback
            </NavLink>

            {isAuthenticated ? (
              <>
                {user?.role === 'customer' && (
                  <>
                    <NavLink to="/customer-dashboard" className={linkClass}>
                      Dashboard
                    </NavLink>
                    <NavLink to="/announcements" className={linkClass}>
                      Announcements
                    </NavLink>
                  </>
                )}
                {(user?.role === 'manager' || user?.role === 'admin') && (
                  <>
                    <NavLink to="/manager-dashboard" className={linkClass}>
                      Manager
                    </NavLink>
                    <NavLink to="/reports" className={linkClass}>
                      Reports
                    </NavLink>
                  </>
                )}
                {user?.role === 'admin' && (
                  <NavLink to="/admin-dashboard" className={linkClass}>
                    Admin
                  </NavLink>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="ml-1 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="ml-1 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm"
              aria-label={`Cart, ${totalItems} items`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.5 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-800 shadow-sm"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="mobile-nav"
            className="absolute right-0 top-16 max-h-[calc(100dvh-4rem)] w-full max-w-sm overflow-y-auto border-l border-slate-200/80 bg-white/95 p-4 pb-8 shadow-glass backdrop-blur-xl animate-slide-down"
          >
            <div className="flex flex-col gap-1">
              <NavLink to="/" className={linkClass}>
                Home
              </NavLink>
              <NavLink to="/wishlist" className={linkClass}>
                <span className="flex w-full items-center justify-between">
                  Wishlist
                  <span className="rounded-lg bg-rose-500 px-2 py-0.5 text-xs font-bold text-white">
                    {wishlistCount}
                  </span>
                </span>
              </NavLink>
              <NavLink to="/about" className={linkClass}>
                About
              </NavLink>
              <NavLink to="/contact" className={linkClass}>
                Contact
              </NavLink>
              <NavLink to="/feedback" className={linkClass}>
                Feedback
              </NavLink>

              {isAuthenticated ? (
                <>
                  {user?.role === 'customer' && (
                    <>
                      <NavLink to="/customer-dashboard" className={linkClass}>
                        Dashboard
                      </NavLink>
                      <NavLink to="/announcements" className={linkClass}>
                        Announcements
                      </NavLink>
                    </>
                  )}
                  {(user?.role === 'manager' || user?.role === 'admin') && (
                    <>
                      <NavLink to="/manager-dashboard" className={linkClass}>
                        Manager
                      </NavLink>
                      <NavLink to="/reports" className={linkClass}>
                        Reports
                      </NavLink>
                    </>
                  )}
                  {user?.role === 'admin' && (
                    <NavLink to="/admin-dashboard" className={linkClass}>
                      Admin
                    </NavLink>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 w-full rounded-xl border border-slate-200 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-4">
                  <NavLink to="/login" className={`${linkClass({ isActive: false })} text-center`}>
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="btn btn-primary justify-center py-3"
                    onClick={() => setMenuOpen(false)}
                  >
                    Create account
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
