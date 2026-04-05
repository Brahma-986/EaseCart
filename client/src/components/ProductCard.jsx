import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleWishlist } from '../slices/engagementSlice'
import SafeProductImage from './SafeProductImage'
import { formatCategoryLabel, getProductRating } from '../utils/productDisplay'

export default function ProductCard({ product, onAdd, badge = '', showShare = true }) {
  const dispatch = useDispatch()
  const wishlist = useSelector((state) => state.engagement.wishlist)
  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock < 10
  const productPath = `/product/${product._id || product.id}`
  const productUrl = `${window.location.origin}${productPath}`
  const shareText = `Check out ${product.name} on EaseCart!`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${productUrl}`)}`
  const isWishlisted = wishlist.some((p) => (p._id || p.id) === (product._id || product.id))
  const { average: ratingAvg, count: ratingCount } = getProductRating(product)

  return (
    <article className="card flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:ring-1 hover:ring-blue-100/80">
      <Link
        to={productPath}
        className="group/link flex min-h-0 flex-1 flex-col rounded-t-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        aria-label={`View ${product.name} — full details`}
      >
        <div className="relative aspect-square overflow-hidden">
          <SafeProductImage
            src={product.image || product.images?.[0]?.url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover/link:scale-105"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/55 backdrop-blur-[2px]">
              <span className="rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-800 shadow-lg">
                Out of stock
              </span>
            </div>
          )}
          {isLowStock && !isOutOfStock && (
            <div className="absolute right-2 top-2">
              <span className="rounded-lg bg-amber-400 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-950 shadow-sm">
                Low stock
              </span>
            </div>
          )}
          {badge && (
            <div className="absolute bottom-2 left-2">
              <span className="rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-md">
                {badge}
              </span>
            </div>
          )}
          {product.category && (
            <div className="absolute left-2 top-2">
              <span className="rounded-lg bg-slate-900/80 px-2.5 py-1 text-[11px] font-semibold capitalize tracking-wide text-white backdrop-blur-sm">
                {formatCategoryLabel(product.category)}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3 className="line-clamp-2 text-base font-bold text-slate-900 transition-colors group-hover/link:text-blue-600">
            {product.name}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-600">{product.description}</p>

          {product.brand && (
            <p className="mt-2 text-xs font-medium text-slate-500">Brand: {product.brand}</p>
          )}

          {ratingAvg > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-3.5 w-3.5 ${i < Math.floor(ratingAvg) ? 'text-amber-400' : 'text-slate-200'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs font-medium text-slate-500">
                {ratingAvg.toFixed(1)}
                {ratingCount > 0 ? ` (${ratingCount})` : ''}
              </span>
            </div>
          )}

          <div className="mt-auto border-t border-slate-100/90 pt-3">
            <div className="flex items-end justify-between gap-2">
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  ${Number(product.price).toFixed(2)}
                </span>
                {product.stock > 0 && (
                  <p className="text-xs font-medium text-slate-500">{product.stock} in stock</p>
                )}
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                Details
                <svg className="h-4 w-4 transition group-hover/link:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="space-y-3 border-t border-slate-100 px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              isWishlisted
                ? 'border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100'
                : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
            onClick={() => dispatch(toggleWishlist(product))}
          >
            {isWishlisted ? '♥ Saved' : '♡ Wishlist'}
          </button>
          <button
            type="button"
            className={`btn flex-1 min-w-[8rem] ${isOutOfStock ? 'btn-disabled' : 'btn-primary'}`}
            onClick={(e) => {
              e.preventDefault()
              if (!isOutOfStock) onAdd(product)
            }}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>

        {showShare && (
          <div className="flex flex-wrap gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-emerald-200/80 bg-emerald-50/80 px-2.5 py-1 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              WhatsApp
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-pink-200/80 bg-pink-50/80 px-2.5 py-1 text-xs font-semibold text-pink-800 transition hover:bg-pink-100"
            >
              Instagram
            </a>
          </div>
        )}
      </div>
    </article>
  )
}
