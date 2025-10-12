import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product, onAdd }) {
  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock < 10

  return (
    <div className="card overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product._id || product.id}`}>
        <div className="aspect-square overflow-hidden relative">
          <img 
            src={product.image || product.images?.[0]?.url} 
            alt={product.name} 
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Out of Stock
              </span>
            </div>
          )}
          {isLowStock && !isOutOfStock && (
            <div className="absolute top-2 right-2">
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Low Stock
              </span>
            </div>
          )}
          {product.category && (
            <div className="absolute top-2 left-2">
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold capitalize">
                {product.category}
              </span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id || product.id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
        
        {product.brand && (
          <p className="mt-1 text-xs text-gray-500 font-medium">
            Brand: {product.brand}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.stock > 0 && (
              <p className="text-xs text-gray-500">
                {product.stock} in stock
              </p>
            )}
          </div>
          <button 
            className={`btn ${isOutOfStock ? 'btn-disabled' : 'btn-primary'}`}
            onClick={(e) => { 
              e.preventDefault(); 
              if (!isOutOfStock) onAdd(product) 
            }}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>

        {product.rating && product.rating.average > 0 && (
          <div className="mt-2 flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
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
            <span className="ml-1 text-sm text-gray-600">
              ({product.rating.count})
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
