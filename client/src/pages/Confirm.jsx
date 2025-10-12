import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Confirm() {
  const location = useLocation()
  const order = location.state?.order

  return (
    <div className="container-px py-16">
      <div className="card p-10 mx-auto max-w-lg text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900">Order Confirmed!</h2>
        <p className="text-gray-600 mt-2">Thank you for your purchase!</p>
        
        {order && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Order Details:</h3>
            <p className="text-sm text-gray-600">
              <strong>Order ID:</strong> {order._id || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Total:</strong> ${order.totalPrice?.toFixed(2) || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Status:</strong> {order.status || 'Processing'}
            </p>
          </div>
        )}
        
        <div className="mt-8 space-y-3">
          <Link to="/" className="btn btn-primary w-full">
            Continue Shopping
          </Link>
          <Link to="/dashboard" className="btn btn-outline w-full">
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  )
}
