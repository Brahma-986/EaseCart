import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ProductCard from '../components/ProductCard'
import { HERO_COVER_URL } from '../utils/images'
import { fetchProducts } from '../slices/productSlice'
import { addToCart } from '../slices/cartSlice'

export default function Home() {
  const dispatch = useDispatch()
  const { products, filters, isLoading, error } = useSelector((state) => state.products)
  const recentlyViewed = useSelector((state) => state.engagement.recentlyViewed)
  const [localFilters, setLocalFilters] = useState({
    query: '',
    minPrice: 0,
    maxPrice: 10000,
  })
  const [flashEndsAt] = useState(() => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000))
  const [now, setNow] = useState(() => Date.now())
  const [couponMessage, setCouponMessage] = useState('')

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const handleAddToCart = (product) => {
    dispatch(addToCart(product))
  }

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleResetFilters = () => {
    setLocalFilters({ query: '', minPrice: 0, maxPrice: 10000 })
  }

  const filteredProducts = Array.isArray(products) ? products.filter(p => {
    const matchesQuery = !localFilters.query || p.name.toLowerCase().includes(localFilters.query.toLowerCase()) || p.description.toLowerCase().includes(localFilters.query.toLowerCase())
    const withinPrice = p.price >= localFilters.minPrice && p.price <= localFilters.maxPrice
    return matchesQuery && withinPrice
  }) : []
  const sortedByRating = [...filteredProducts].sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0))
  const topSelling = sortedByRating.slice(0, 4)
  const trending = [...filteredProducts].sort((a, b) => (b.stock || 0) - (a.stock || 0)).slice(0, 4)
  const msLeft = Math.max(0, flashEndsAt.getTime() - now)
  const dd = String(Math.floor(msLeft / (1000 * 60 * 60 * 24))).padStart(2, '0')
  const hh = String(Math.floor((msLeft / (1000 * 60 * 60)) % 24)).padStart(2, '0')
  const mm = String(Math.floor((msLeft / (1000 * 60)) % 60)).padStart(2, '0')
  const ss = String(Math.floor((msLeft / 1000) % 60)).padStart(2, '0')
  const copyCoupon = async (code) => {
    await navigator.clipboard.writeText(code)
    setCouponMessage(`${code} copied`)
    setTimeout(() => setCouponMessage(''), 1800)
  }

  return (
    <div className="bg-transparent">
      <header className="container-px pt-8 sm:pt-12">
        <div className="mb-6 flex justify-center sm:justify-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-gradient-to-r from-rose-600 to-orange-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-rose-500/25">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            50% off selected products — limited time
          </div>
        </div>
        <div className="card overflow-hidden ring-slate-900/[0.07]">
          <div className="grid items-center gap-8 bg-hero-mesh bg-radial-fade p-8 md:grid-cols-2 md:p-10 lg:p-12">
            <div className="order-2 md:order-1">
              <p className="section-eyebrow">New season</p>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[2.75rem] lg:leading-[1.1]">
                Everything you need—beautifully priced.
              </h1>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-slate-600">
                Sleek tech and daily essentials with a calm checkout flow and clear delivery expectations.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#catalog" className="btn btn-primary px-6 py-3">
                  Shop now
                </a>
                <a href="#catalog" className="btn btn-outline px-6 py-3">
                  Browse catalog
                </a>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative overflow-hidden rounded-2xl shadow-glass ring-1 ring-slate-900/5">
                <img
                  alt="Shopping and delivery — EaseCart"
                  className="h-56 w-full object-cover sm:h-64 md:h-80"
                  src={HERO_COVER_URL}
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="container-px py-8">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card group p-6 transition hover:shadow-lg">
            <p className="section-eyebrow text-rose-600">Flash sale</p>
            <h3 className="mt-2 font-mono text-2xl font-bold tracking-tight text-slate-900">
              {dd}:{hh}:{mm}:{ss}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Countdown creates urgency during promo windows—use it with real inventory caps.
            </p>
          </div>
          <div className="card p-6 transition hover:shadow-lg">
            <p className="section-eyebrow">Coupons</p>
            <p className="mt-2 text-sm text-slate-600">Tap to copy at checkout.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['SAVE20', 'FLASH50', 'FREESHIP'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => copyCoupon(c)}
                  className="rounded-lg border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-xs font-bold tracking-wide text-blue-800 transition hover:border-blue-300 hover:bg-blue-100"
                >
                  {c}
                </button>
              ))}
            </div>
            {couponMessage && (
              <p className="mt-3 text-xs font-semibold text-emerald-700">{couponMessage}</p>
            )}
          </div>
          <div className="card p-6 transition hover:shadow-lg">
            <p className="section-eyebrow text-violet-600">Trusted</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              <span className="font-semibold text-slate-900">120k</span> followers ·{' '}
              <span className="font-semibold text-slate-900">4.8/5</span> rating ·{' '}
              <span className="font-semibold text-slate-900">18k+</span> verified reviews
            </p>
          </div>
        </div>
      </section>

      <section className="container-px pb-6">
        <div className="grid gap-4 md:grid-cols-3">
          <a
            href="/?campaign=instagram"
            className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-md shadow-pink-500/20"
              aria-hidden
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <p className="mt-3 font-bold text-slate-900">Instagram landing</p>
            <p className="mt-1 text-sm text-slate-600">Creator picks and viral products</p>
            <span className="link-subtle mt-4 inline-block">Explore →</span>
          </a>
          <a
            href="/?campaign=retargeting"
            className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-500/20"
              aria-hidden
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <p className="mt-3 font-bold text-slate-900">Retargeting</p>
            <p className="mt-1 text-sm text-slate-600">Win back abandoned carts</p>
            <span className="link-subtle mt-4 inline-block">Explore →</span>
          </a>
          <a
            href="/?campaign=whatsapp"
            className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20"
              aria-hidden
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <p className="mt-3 font-bold text-slate-900">WhatsApp promo</p>
            <p className="mt-1 text-sm text-slate-600">Quick bundles and shareable offers</p>
            <span className="link-subtle mt-4 inline-block">Explore →</span>
          </a>
        </div>
      </section>

      {topSelling.length > 0 && (
        <section className="container-px py-6">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-eyebrow">Bestsellers</p>
              <h2 className="section-title mt-1">Top selling products</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {topSelling.map((p) => (
              <ProductCard key={`top-${p._id || p.id}`} product={p} onAdd={handleAddToCart} badge="Top Seller" />
            ))}
          </div>
        </section>
      )}

      {trending.length > 0 && (
        <section className="container-px py-6">
          <div className="mb-6">
            <p className="section-eyebrow text-violet-600">Hot right now</p>
            <h2 className="section-title mt-1">Trending</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {trending.map((p) => (
              <ProductCard key={`trend-${p._id || p.id}`} product={p} onAdd={handleAddToCart} badge="Trending" />
            ))}
          </div>
        </section>
      )}

      {recentlyViewed.length > 0 && (
        <section className="container-px py-6">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-eyebrow text-slate-500">Your history</p>
              <h2 className="section-title mt-1">Recently viewed</h2>
            </div>
            <Link to="/wishlist" className="link-subtle self-start sm:self-auto">
              View wishlist
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recentlyViewed.slice(0, 4).map((p) => (
              <ProductCard key={`recent-${p._id || p.id}`} product={p} onAdd={handleAddToCart} badge="Viewed" />
            ))}
          </div>
        </section>
      )}

      <section className="container-px py-10" id="catalog">
        <div className="mb-8 border-b border-slate-200/80 pb-8">
          <p className="section-eyebrow">Catalog</p>
          <h2 className="section-title mt-2">All products</h2>
          <p className="mt-2 max-w-2xl text-slate-600">Search and narrow by price range. Results update instantly.</p>
        </div>

        <div className="mb-6 grid items-end gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Search</label>
            <input
              value={localFilters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              placeholder="Search by name or description…"
              className="input mt-2"
            />
          </div>
          <button type="button" className="btn btn-outline h-11 w-full md:w-auto" onClick={handleResetFilters}>
            Clear filters
          </button>
        </div>

        <div className="card mb-8 p-6 sm:p-8">
          <p className="text-sm font-semibold text-slate-800">Price range</p>
          <div className="mt-5 grid gap-8 md:grid-cols-2">
            <div>
              <label className="flex items-center justify-between text-sm font-medium text-slate-600">
                <span>Minimum</span>
                <span className="badge">${localFilters.minPrice}</span>
              </label>
              <input
                type="range"
                min={0}
                max={10000}
                value={localFilters.minPrice}
                onChange={(e) =>
                  handleFilterChange('minPrice', Math.min(Number(e.target.value), localFilters.maxPrice))
                }
                className="mt-3 w-full"
              />
            </div>
            <div>
              <label className="flex items-center justify-between text-sm font-medium text-slate-600">
                <span>Maximum</span>
                <span className="badge">${localFilters.maxPrice}</span>
              </label>
              <input
                type="range"
                min={0}
                max={10000}
                value={localFilters.maxPrice}
                onChange={(e) =>
                  handleFilterChange('maxPrice', Math.max(Number(e.target.value), localFilters.minPrice))
                }
                className="mt-3 w-full"
              />
            </div>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">${localFilters.minPrice}</span> –{' '}
            <span className="font-semibold text-slate-700">${localFilters.maxPrice}</span>
          </p>
        </div>

        {isLoading ? (
          <div className="card flex flex-col items-center justify-center gap-3 p-16 text-center text-slate-600">
            <svg className="h-8 w-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24" aria-hidden>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading products…
          </div>
        ) : error ? (
          <div className="card border border-red-100 bg-red-50/50 p-10 text-center text-red-700">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="card p-12 text-center text-slate-600">
            <p className="font-semibold text-slate-800">No matches</p>
            <p className="mt-2 text-sm">Try widening the price range or clearing your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(p => (
              <ProductCard key={p._id || p.id} product={p} onAdd={handleAddToCart} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
