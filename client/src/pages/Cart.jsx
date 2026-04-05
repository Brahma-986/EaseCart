import React from 'react'
import { Link } from 'react-router-dom'
import SafeProductImage from '../components/SafeProductImage'
import { useSelector, useDispatch } from 'react-redux'
import { incrementQuantity, decrementQuantity, removeFromCart, clearCart } from '../slices/cartSlice'

export default function Cart() {
  const dispatch = useDispatch()
  const { items, totalAmount, totalItems } = useSelector((state) => state.cart)
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  const calculateTax = () => totalAmount * 0.1 // 10% tax
  const calculateShipping = () => totalAmount > 100 ? 0 : 10 // Free shipping over $100
  const calculateTotal = () => totalAmount + calculateTax() + calculateShipping()

  return (
    <div className="container-px py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600 mt-2">
          {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item._id || item.id} className="card p-6">
                <div className="flex gap-4">
                  <Link to={`/product/${item._id || item.id}`} className="flex-shrink-0">
                    <SafeProductImage
                      src={item.image || item.images?.[0]?.url}
                      alt={item.name}
                      className="h-24 w-24 rounded-lg object-cover transition-opacity hover:opacity-90"
                    />
                  </Link>
                  
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item._id || item.id}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    {item.brand && (
                      <p className="text-sm text-gray-500 mt-1">Brand: {item.brand}</p>
                    )}
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end space-y-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button 
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                        onClick={() => dispatch(decrementQuantity(item._id || item.id))}
                        disabled={item.quantity <= 1}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center font-medium">
                        {item.quantity}
                      </span>
                      <button 
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                        onClick={() => dispatch(incrementQuantity(item._id || item.id))}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button 
                      className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                      onClick={() => dispatch(removeFromCart(item._id || item.id))}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <button 
                className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                onClick={() => dispatch(clearCart())}
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">${totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${calculateTax().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {calculateShipping() === 0 ? 'Free' : `$${calculateShipping().toFixed(2)}`}
                  </span>
                </div>
                
                {calculateShipping() > 0 && (
                  <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                    Add ${(100 - totalAmount).toFixed(2)} more for free shipping!
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {!isAuthenticated ? (
                <div className="mt-6 space-y-3">
                  <div className="text-center text-sm text-gray-600 mb-3">
                    Please log in to proceed with checkout
                  </div>
                  <Link 
                    to="/login" 
                    state={{ from: { pathname: '/checkout' } }}
                    className="btn btn-primary w-full text-center"
                  >
                    Login to Checkout
                  </Link>
                </div>
              ) : (
                <Link 
                  to="/checkout" 
                  className="btn btn-primary w-full mt-6 text-center"
                >
                  Proceed to Checkout
                </Link>
              )}
              
              <Link 
                to="/" 
                className="btn btn-outline w-full mt-3 text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
