import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProduct } from '../slices/productSlice'
import { addToCart } from '../slices/cartSlice'
import { addRecentlyViewed, toggleWishlist } from '../slices/engagementSlice'
import SafeProductImage from '../components/SafeProductImage'
import { formatCategoryLabel, getProductRating } from '../utils/productDisplay'

const TABS = [
  { id: 'description', label: 'Description' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'shipping', label: 'Shipping & returns' },
]

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { product, isLoading, error } = useSelector((state) => state.products)
  const wishlist = useSelector((state) => state.engagement.wishlist)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    dispatch(fetchProduct(id))
  }, [dispatch, id])

  useEffect(() => {
    setSelectedImage(0)
    setQuantity(1)
    setActiveTab('description')
  }, [id])

  useEffect(() => {
    if (product && (product._id || product.id)) {
      dispatch(addRecentlyViewed(product))
    }
  }, [dispatch, product])

  const gallery = useMemo(() => {
    if (!product) return []
    const fromApi = Array.isArray(product.images) ? product.images : []
    const withFallback =
      fromApi.length > 0 ? fromApi : product.image ? [{ url: product.image, alt: product.name }] : []
    return withFallback.filter((img) => img?.url)
  }, [product])

  const handleAddToCart = () => {
    if (!product) return
    dispatch(addToCart({ ...product, quantity }))
  }

  const handleBuyNow = () => {
    if (!product) return
    dispatch(addToCart({ ...product, quantity }))
    navigate('/cart')
  }

  if (isLoading) {
    return (
      <div className="container-px py-8">
        <div className="animate-pulse">
          <div className="mb-8 h-4 w-2/3 max-w-md rounded bg-slate-200" />
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="aspect-square rounded-2xl bg-slate-200" />
              <div className="mt-4 grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((k) => (
                  <div key={k} className="aspect-square rounded-xl bg-slate-100" />
                ))}
              </div>
            </div>
            <div className="space-y-4 lg:col-span-5">
              <div className="h-8 rounded-lg bg-slate-200" />
              <div className="h-4 w-3/4 rounded bg-slate-100" />
              <div className="h-10 w-40 rounded bg-slate-200" />
              <div className="h-12 rounded-xl bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-px py-8">
        <div className="card p-8 text-center">
          <p className="text-lg font-semibold text-red-600">Couldn&apos;t load this product</p>
          <p className="mt-2 text-slate-600">{error}</p>
          <Link to="/" className="btn btn-primary mt-6 inline-flex">
            Back to shop
          </Link>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container-px py-8">
        <div className="card p-8 text-center">
          <p className="text-lg font-semibold text-slate-800">Product not found</p>
          <Link to="/" className="btn btn-primary mt-6 inline-flex">
            Back to shop
          </Link>
        </div>
      </div>
    )
  }

  const { average: ratingAvg, count: ratingCount } = getProductRating(product)
  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock < 10
  const isWishlisted = wishlist.some((p) => (p._id || p.id) === (product._id || product.id))
  const categoryLabel = formatCategoryLabel(product.category)
  const productSku = (product._id || product.id || '').toString().slice(-8).toUpperCase()
  const mainImage = gallery[selectedImage]?.url

  return (
    <div className="container-px py-6 sm:py-10">
      <nav className="mb-6 text-sm" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-600">
          <li>
            <Link to="/" className="font-medium text-blue-600 transition hover:text-blue-700">
              Home
            </Link>
          </li>
          <li className="text-slate-300" aria-hidden>
            /
          </li>
          <li>
            <Link to="/#catalog" className="font-medium text-blue-600 transition hover:text-blue-700">
              Shop
            </Link>
          </li>
          {categoryLabel && (
            <>
              <li className="text-slate-300" aria-hidden>
                /
              </li>
              <li className="capitalize text-slate-500">{categoryLabel}</li>
            </>
          )}
          <li className="text-slate-300" aria-hidden>
            /
          </li>
          <li className="max-w-[200px] truncate font-semibold text-slate-900 sm:max-w-md" title={product.name}>
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <div className="card overflow-hidden p-2 sm:p-3 lg:sticky lg:top-24">
            <div className="aspect-square overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-900/5">
              <SafeProductImage
                key={mainImage || selectedImage}
                src={mainImage}
                alt={gallery[selectedImage]?.alt || product.name}
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                {gallery.map((img, index) => (
                  <button
                    key={img.url + index}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg ring-2 transition ${
                      selectedImage === index ? 'ring-blue-600' : 'ring-transparent hover:ring-slate-200'
                    }`}
                    aria-label={`Show image ${index + 1}`}
                  >
                    <SafeProductImage
                      src={img.url}
                      alt={img.alt || `${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            <p className="mt-3 text-center text-xs text-slate-400">Select a thumbnail to change the main image</p>
          </div>
        </div>

        {/* Buy box + info */}
        <div className="lg:col-span-5">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {product.category && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-800 ring-1 ring-blue-100">
                  {categoryLabel}
                </span>
              )}
              {product.brand && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/80">
                  {product.brand}
                </span>
              )}
              <span className="text-xs font-medium text-slate-400">SKU: EC-{productSku}</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{product.name}</h1>

            <div id="reviews" className="flex flex-wrap items-center gap-3">
              {ratingAvg > 0 ? (
                <>
                  <div className="flex items-center gap-0.5" aria-label={`${ratingAvg.toFixed(1)} out of 5 stars`}>
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(ratingAvg) ? 'text-amber-400' : 'text-slate-200'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{ratingAvg.toFixed(1)}</span>
                  <span className="text-sm text-slate-500">
                    {ratingCount > 0 ? `${ratingCount.toLocaleString()} verified ratings` : 'Customer rating'}
                  </span>
                </>
              ) : (
                <span className="text-sm text-slate-500">No ratings yet — be the first to review</span>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm ring-1 ring-slate-900/[0.04]">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className="text-sm text-slate-500">Price includes applicable taxes at checkout</span>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                {isOutOfStock ? (
                  <p className="flex items-center gap-2 font-semibold text-red-600">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                    Out of stock — get notified when it&apos;s back
                  </p>
                ) : isLowStock ? (
                  <p className="flex items-center gap-2 font-semibold text-amber-700">
                    <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                    Only {product.stock} left — order soon
                  </p>
                ) : (
                  <p className="flex items-center gap-2 font-medium text-emerald-700">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    In stock — ships in 1–2 business days
                  </p>
                )}
                <p className="text-slate-600">Estimated delivery: <strong className="text-slate-800">3–5 business days</strong> (contiguous US)</p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => dispatch(toggleWishlist(product))}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    isWishlisted
                      ? 'border-rose-200 bg-rose-50 text-rose-800'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {isWishlisted ? '♥ Saved to wishlist' : '♡ Add to wishlist'}
                </button>
              </div>

              {!isOutOfStock && (
                <div className="mt-5 space-y-4 border-t border-slate-100 pt-5">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-sm font-semibold text-slate-700">Quantity</span>
                    <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white shadow-sm">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-4 py-2.5 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="min-w-[2.5rem] border-x border-slate-200 px-3 py-2.5 text-center text-sm font-bold tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                        className="px-4 py-2.5 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                        disabled={quantity >= product.stock}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-slate-500">Max {product.stock} per order</span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <button type="button" onClick={handleAddToCart} className="btn btn-primary py-3.5 text-base">
                      Add to cart
                    </button>
                    <button type="button" onClick={handleBuyNow} className="btn btn-outline py-3.5 text-base font-semibold">
                      Buy now
                    </button>
                  </div>
                  <p className="text-center text-sm font-semibold text-slate-800">
                    Subtotal: ${(Number(product.price) * quantity).toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            <ul className="grid gap-3 sm:grid-cols-3">
              {[
                { t: 'Secure checkout', d: 'Encrypted payments' },
                { t: 'Easy returns', d: '30-day policy' },
                { t: 'Support', d: 'Help center 24/7' },
              ].map((item) => (
                <li key={item.t} className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3 text-center text-xs">
                  <p className="font-bold text-slate-800">{item.t}</p>
                  <p className="mt-0.5 text-slate-500">{item.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs — full width below grid */}
      <div className="mt-12 border-t border-slate-200/80 pt-10">
        <div className="flex flex-wrap gap-6 border-b border-slate-200" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`mb-[-1px] border-b-2 pb-3 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="card mt-6 p-6 sm:p-8" role="tabpanel">
          {activeTab === 'description' && (
            <div className="max-w-none">
              <p className="text-base leading-relaxed text-slate-700">{product.description}</p>
              <p className="mt-4 text-sm text-slate-500">
                Have questions? <Link to="/contact" className="font-semibold text-blue-600 hover:text-blue-700">Contact us</Link>{' '}
                — we usually reply within one business day.
              </p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-slate-50/50">
                    <th className="w-1/3 px-4 py-3 font-semibold text-slate-700">Brand</th>
                    <td className="px-4 py-3 text-slate-600">{product.brand || '—'}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-3 font-semibold text-slate-700">Category</th>
                    <td className="px-4 py-3 capitalize text-slate-600">{categoryLabel || '—'}</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <th className="px-4 py-3 font-semibold text-slate-700">Availability</th>
                    <td className="px-4 py-3 text-slate-600">
                      {isOutOfStock ? 'Out of stock' : `${product.stock} units`}
                    </td>
                  </tr>
                  {product.weight != null && (
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-700">Weight</th>
                      <td className="px-4 py-3 text-slate-600">{product.weight} kg</td>
                    </tr>
                  )}
                  {product.dimensions && (
                    <tr className="bg-slate-50/50">
                      <th className="px-4 py-3 font-semibold text-slate-700">Dimensions (L×W×H)</th>
                      <td className="px-4 py-3 text-slate-600">
                        {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                      </td>
                    </tr>
                  )}
                  <tr>
                    <th className="px-4 py-3 font-semibold text-slate-700">Product ID</th>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{String(product._id || product.id)}</td>
                  </tr>
                </tbody>
              </table>
              {product.tags && product.tags.length > 0 && (
                <div className="border-t border-slate-100 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tags</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-slate-700">
              <p>
                <strong className="text-slate-900">Shipping:</strong> Orders placed before 2pm ship the same business day.
                Standard shipping is free on orders over $100; otherwise a flat $10 rate applies.
              </p>
              <p>
                <strong className="text-slate-900">Returns:</strong> Unopened items in original packaging may be returned within 30 days
                for a full refund. Opened electronics may be subject to a restocking fee per policy.
              </p>
              <p>
                <strong className="text-slate-900">Warranty:</strong> Manufacturer warranty applies where stated. EaseCart facilitates
                returns but does not extend warranty beyond the brand&apos;s terms.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
