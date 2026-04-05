import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { addToCart } from '../slices/cartSlice'
import { clearRecentlyViewed, removeFromWishlist } from '../slices/engagementSlice'

export default function Wishlist() {
  const dispatch = useDispatch()
  const wishlist = useSelector((state) => state.engagement.wishlist)
  const recentlyViewed = useSelector((state) => state.engagement.recentlyViewed)

  return (
    <div className="container-px py-8 space-y-10">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">My Wishlist</h1>
          <span className="text-sm text-gray-600">{wishlist.length} item(s)</span>
        </div>
        {wishlist.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
            <Link to="/" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((p) => (
              <div key={p._id || p.id}>
                <ProductCard product={p} onAdd={(x) => dispatch(addToCart(x))} showShare={false} />
                <button
                  className="mt-2 text-xs text-red-600 hover:text-red-700"
                  onClick={() => dispatch(removeFromWishlist(p._id || p.id))}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recently Viewed</h2>
          {recentlyViewed.length > 0 && (
            <button className="text-sm text-gray-600 hover:text-gray-900" onClick={() => dispatch(clearRecentlyViewed())}>
              Clear
            </button>
          )}
        </div>
        {recentlyViewed.length === 0 ? (
          <div className="card p-8 text-center text-gray-600">No recently viewed products yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentlyViewed.map((p) => (
              <ProductCard key={`rv-${p._id || p.id}`} product={p} onAdd={(x) => dispatch(addToCart(x))} badge="Viewed" />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
