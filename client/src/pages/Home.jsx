import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ProductCard from '../components/ProductCard'
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
      <header className="container-px pt-10">
        <div className="mb-4 rounded-xl bg-red-600 text-white px-4 py-2 text-center font-semibold tracking-wide">
          50% OFF selected products today
        </div>
        <div className="card overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 items-center p-8 bg-radial-fade">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">EaseCart</p>
              <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">Everything you need—beautifully priced.</h1>
              <p className="mt-3 text-gray-600">Sleek tech & daily essentials with fast shipping.</p>
              <div className="mt-5 flex gap-3">
                <a href="#catalog" className="btn btn-primary">Shop now</a>
                <a href="#catalog" className="btn btn-outline">Browse</a>
              </div>
            </div>
            <img alt="hero" className="rounded-2xl w-full object-cover h-64 md:h-80" src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop" />
          </div>
        </div>
      </header>

      <section className="container-px py-6">
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-600">Flash Sale</p>
            <h3 className="text-xl font-bold mt-1">Ends in {dd}:{hh}:{mm}:{ss}</h3>
            <p className="text-sm text-gray-600 mt-2">Urgency timer boosts conversion during promotion windows.</p>
          </div>
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Coupons</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {['SAVE20', 'FLASH50', 'FREESHIP'].map((c) => (
                <button key={c} onClick={() => copyCoupon(c)} className="badge hover:bg-blue-100">
                  {c}
                </button>
              ))}
            </div>
            {couponMessage && <p className="text-xs text-green-700 mt-2">{couponMessage}</p>}
          </div>
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">Social Proof</p>
            <p className="mt-2 text-sm text-gray-700">120k followers • 4.8/5 rating • 18k+ verified reviews</p>
          </div>
        </div>
      </section>

      <section className="container-px pb-4">
        <div className="grid md:grid-cols-3 gap-4">
          <a href="/?campaign=instagram" className="card p-4 hover:shadow-lg">
            <p className="font-semibold">Instagram Ad Landing</p>
            <p className="text-sm text-gray-600 mt-1">Creator picks and viral products</p>
          </a>
          <a href="/?campaign=retargeting" className="card p-4 hover:shadow-lg">
            <p className="font-semibold">Retargeting Landing</p>
            <p className="text-sm text-gray-600 mt-1">Bring back abandoned cart users</p>
          </a>
          <a href="/?campaign=whatsapp" className="card p-4 hover:shadow-lg">
            <p className="font-semibold">WhatsApp Promo Landing</p>
            <p className="text-sm text-gray-600 mt-1">Quick checkout + offer bundles</p>
          </a>
        </div>
      </section>

      {topSelling.length > 0 && (
        <section className="container-px py-4">
          <h2 className="text-xl font-bold mb-4">Top Selling Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {topSelling.map((p) => (
              <ProductCard key={`top-${p._id || p.id}`} product={p} onAdd={handleAddToCart} badge="Top Seller" />
            ))}
          </div>
        </section>
      )}

      {trending.length > 0 && (
        <section className="container-px py-4">
          <h2 className="text-xl font-bold mb-4">Trending Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {trending.map((p) => (
              <ProductCard key={`trend-${p._id || p.id}`} product={p} onAdd={handleAddToCart} badge="Trending" />
            ))}
          </div>
        </section>
      )}

      {recentlyViewed.length > 0 && (
        <section className="container-px py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recently Viewed</h2>
            <a href="/wishlist" className="text-sm text-blue-600 hover:text-blue-700">View all</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recentlyViewed.slice(0, 4).map((p) => (
              <ProductCard key={`recent-${p._id || p.id}`} product={p} onAdd={handleAddToCart} badge="Viewed" />
            ))}
          </div>
        </section>
      )}

      <section className="container-px py-8" id="catalog">
        <div className="mb-6 grid md:grid-cols-3 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Search</label>
            <input
              value={localFilters.query}
              onChange={e => handleFilterChange('query', e.target.value)}
              placeholder="Search products..."
              className="input mt-1"
            />
          </div>
          <button className="btn btn-outline h-10" onClick={handleResetFilters}>Clear filters</button>
        </div>

        <div className="card p-5 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Min Price: <span className="badge">${localFilters.minPrice}</span></label>
              <input type="range" min={0} max={10000} value={localFilters.minPrice}
                onChange={e => handleFilterChange('minPrice', Math.min(Number(e.target.value), localFilters.maxPrice))}
                className="w-full" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Max Price: <span className="badge">${localFilters.maxPrice}</span></label>
              <input type="range" min={0} max={10000} value={localFilters.maxPrice}
                onChange={e => handleFilterChange('maxPrice', Math.max(Number(e.target.value), localFilters.minPrice))}
                className="w-full" />
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-600">Showing ${localFilters.minPrice} – ${localFilters.maxPrice}</p>
        </div>

        {isLoading ? (
          <div className="card p-10 text-center text-gray-600">Loading products...</div>
        ) : error ? (
          <div className="card p-10 text-center text-red-600">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="card p-10 text-center text-gray-600">No products match your filters.</div>
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
