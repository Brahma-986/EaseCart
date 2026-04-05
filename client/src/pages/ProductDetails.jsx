import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProduct } from '../slices/productSlice'
import { addToCart } from '../slices/cartSlice'
import { addRecentlyViewed, toggleWishlist } from '../slices/engagementSlice'

export default function ProductDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { product, isLoading, error } = useSelector((state) => state.products)
  const wishlist = useSelector((state) => state.engagement.wishlist)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    dispatch(fetchProduct(id))
  }, [dispatch, id])

  useEffect(() => {
    if (product && (product._id || product.id)) {
      dispatch(addRecentlyViewed(product))
    }
  }, [dispatch, product])

  const handleAddToCart = () => {
    const productToAdd = { ...product, quantity }
    dispatch(addToCart(productToAdd))
  }

  if (isLoading) return (
    <div className="container-px py-8">
      <div className="animate-pulse">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-300 h-96 rounded-lg"></div>
          <div className="space-y-4">
            <div className="bg-gray-300 h-8 rounded"></div>
            <div className="bg-gray-300 h-4 rounded w-3/4"></div>
            <div className="bg-gray-300 h-6 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="container-px py-8">
      <div className="card p-8 text-center">
        <div className="text-red-600 text-xl mb-4">Error loading product</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </div>
  )

  if (!product) return (
    <div className="container-px py-8">
      <div className="card p-8 text-center">
        <div className="text-gray-600 text-xl mb-4">Product not found</div>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </div>
  )

  const images = product.images || [{ url: product.image }]
  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock < 10
  const isWishlisted = wishlist.some((p) => (p._id || p.id) === (product._id || product.id))

  return (
    <div className="container-px py-8">
      <nav className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800">← Back to Products</Link>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img 
              src={images[selectedImage]?.url} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img 
                    src={img.url} 
                    alt={`${product.name} ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium capitalize">
                {product.category}
              </span>
              {product.brand && (
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium">
                  {product.brand}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
          </div>

          {/* Rating */}
          {product.rating && product.rating.average > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating.average)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating.average.toFixed(1)} ({product.rating.count} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="text-3xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </div>
          <button
            onClick={() => dispatch(toggleWishlist(product))}
            className={`text-sm px-3 py-2 rounded border ${
              isWishlisted
                ? 'border-pink-300 text-pink-700 bg-pink-50'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {isWishlisted ? '♥ Remove from Wishlist' : '♡ Add to Wishlist'}
          </button>

          {/* Stock Status */}
          <div className="space-y-2">
            {isOutOfStock ? (
              <div className="flex items-center gap-2 text-red-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Out of Stock</span>
              </div>
            ) : isLowStock ? (
              <div className="flex items-center gap-2 text-yellow-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Only {product.stock} left in stock</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">In Stock ({product.stock} available)</span>
              </div>
            )}
          </div>

          {/* Quantity and Add to Cart */}
          {!isOutOfStock && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="btn btn-primary w-full text-lg py-3"
              >
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </button>
            </div>
          )}

          {/* Product Details */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-semibold">Product Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.weight && (
                <div>
                  <span className="font-medium text-gray-700">Weight:</span>
                  <span className="ml-2 text-gray-600">{product.weight} kg</span>
                </div>
              )}
              {product.dimensions && (
                <div>
                  <span className="font-medium text-gray-700">Dimensions:</span>
                  <span className="ml-2 text-gray-600">
                    {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                  </span>
                </div>
              )}
            </div>
            {product.tags && product.tags.length > 0 && (
              <div>
                <span className="font-medium text-gray-700">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
