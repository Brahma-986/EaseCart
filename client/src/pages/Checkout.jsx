import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from '../slices/cartSlice'
import { createOrder, createRazorpayOrder, verifyRazorpayPayment } from '../slices/orderSlice'
import { loadRazorpayScript } from '../utils/razorpay'

export default function Checkout() {
  const nav = useNavigate()
  const dispatch = useDispatch()
  const { items, totalAmount, totalItems } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
  const [isProcessing, setIsProcessing] = useState(false)

  const calculateTax = () => totalAmount * 0.1 // 10% tax
  const calculateShipping = () => totalAmount > 100 ? 0 : 10 // Free shipping over $100
  const calculateTotal = () => totalAmount + calculateTax() + calculateShipping()

  const cartItemsForApi = items.map((item) => ({
    product: item._id || item.id,
    quantity: item.quantity
  }))

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    if (!user) {
      alert('Please log in to place an order.')
      nav('/login', { state: { from: { pathname: '/checkout' } } })
      setIsProcessing(false)
      return
    }

    const formData = new FormData(e.target)
    const paymentMethod = formData.get('paymentMethod')
    const shippingAddress = {
      street: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      zipCode: formData.get('zip'),
      country: formData.get('country') || 'USA'
    }

    if (paymentMethod === 'razorpay') {
      try {
        const created = await dispatch(createRazorpayOrder({ items: cartItemsForApi })).unwrap()
        const rp = created.data
        const Razorpay = await loadRazorpayScript()

        const options = {
          key: rp.keyId,
          amount: String(rp.amount),
          currency: rp.currency,
          order_id: rp.razorpayOrderId,
          name: 'EaseCart',
          description: 'Order payment',
          prefill: {
            name: formData.get('name') || user.name || '',
            email: formData.get('email') || user.email || ''
          },
          theme: { color: '#2563eb' },
          handler: async (response) => {
            try {
              const result = await dispatch(
                verifyRazorpayPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  items: cartItemsForApi,
                  shippingAddress,
                  paymentMethod: 'razorpay'
                })
              ).unwrap()
              dispatch(clearCart())
              nav('/confirm', { state: { order: result.data } })
            } catch (err) {
              console.error('Razorpay verify failed:', err)
              alert(typeof err === 'string' ? err : err?.message || 'Payment verification failed.')
            } finally {
              setIsProcessing(false)
            }
          },
          modal: {
            ondismiss: () => setIsProcessing(false)
          }
        }

        const rzp = new Razorpay(options)
        rzp.on('payment.failed', (res) => {
          console.error('Razorpay payment failed:', res)
          const msg = res?.error?.description || 'Payment failed.'
          alert(msg)
          setIsProcessing(false)
        })
        rzp.open()
      } catch (error) {
        console.error('Razorpay checkout failed:', error)
        const errorMessage = typeof error === 'string' ? error : error?.message || 'Could not start payment.'
        alert(`Error: ${errorMessage}`)
        setIsProcessing(false)
      }
      return
    }

    const orderData = {
      items: items.map(item => ({
        product: item._id || item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image || item.images?.[0]?.url
      })),
      shippingAddress,
      paymentMethod,
      taxPrice: calculateTax(),
      shippingPrice: calculateShipping(),
      totalPrice: calculateTotal()
    }

    try {
      const result = await dispatch(createOrder(orderData)).unwrap()
      dispatch(clearCart())
      nav('/confirm', { state: { order: result.data } })
    } catch (error) {
      console.error('Order creation failed:', error)
      const errorMessage = error || 'Failed to place order. Please try again.'
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-px py-8">
        <div className="card p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-px py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <p className="text-gray-600 mt-2">Complete your order</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Information */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  className="input w-full" 
                  name="name" 
                  placeholder="John Doe" 
                  defaultValue={user?.name || ''} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  className="input w-full" 
                  name="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  defaultValue={user?.email || ''} 
                  required 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input 
                  className="input w-full" 
                  name="address" 
                  placeholder="123 Main Street" 
                  defaultValue={user?.address?.street || ''} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input 
                  className="input w-full" 
                  name="city" 
                  placeholder="New York" 
                  defaultValue={user?.address?.city || ''} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input 
                  className="input w-full" 
                  name="state" 
                  placeholder="NY" 
                  defaultValue={user?.address?.state || ''} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input 
                  className="input w-full" 
                  name="zip" 
                  placeholder="10001" 
                  defaultValue={user?.address?.zipCode || ''} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select 
                  className="input w-full" 
                  name="country" 
                  defaultValue={user?.address?.country || 'USA'}
                  required
                >
                  <option value="USA">United States</option>
                  <option value="India">India</option>
                  <option value="Canada">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Pay with Razorpay (UPI, cards, netbanking). Charges are in INR; your cart total in USD is converted on the server using the configured rate.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="razorpay" 
                      defaultChecked 
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <svg className="w-6 h-6 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                      </svg>
                      Razorpay (recommended)
                    </div>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="card" 
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                      </svg>
                      Credit/Debit Card (demo)
                    </div>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="paypal" 
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      PayPal
                    </div>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="bank-transfer" 
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Bank Transfer
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            {/* Order Items */}
            <div className="space-y-3 mb-6">
              {items.map(item => (
                <div key={item._id || item.id} className="flex gap-3">
                  <img 
                    src={item.image || item.images?.[0]?.url} 
                    alt={item.name} 
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 border-t pt-4">
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
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full mt-6 text-center"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </button>
            
            <Link 
              to="/cart" 
              className="btn btn-outline w-full mt-3 text-center"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
