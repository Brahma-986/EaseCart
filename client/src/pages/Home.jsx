import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ProductCard from '../components/ProductCard'
import { fetchProducts, setFilters, clearFilters } from '../slices/productSlice'
import { addToCart } from '../slices/cartSlice'

export default function Home() {
  const dispatch = useDispatch()
  const { products, filters, isLoading, error } = useSelector((state) => state.products)
  const [localFilters, setLocalFilters] = useState({
    query: '',
    minPrice: 0,
    maxPrice: 10000,
  })

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

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

  return (
    <div className="bg-transparent">
      <header className="container-px pt-10">
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
