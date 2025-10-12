import React from 'react'

export default function About() {
  return (
    <div className="container-px py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About EaseCart</h1>
          <p className="text-xl text-gray-600">
            Your trusted partner in online shopping
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At EaseCart, we believe that shopping should be simple, secure, and enjoyable. 
              Our mission is to provide you with a seamless e-commerce experience that combines 
              the best products with exceptional service.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We're committed to making your online shopping journey as smooth as possible, 
              from browsing our carefully curated selection to receiving your orders at your doorstep.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Why Choose Us</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-900">Quality Products</h3>
                  <p className="text-gray-600">Carefully selected items from trusted brands</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-900">Fast Shipping</h3>
                  <p className="text-gray-600">Quick and reliable delivery to your doorstep</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-900">24/7 Support</h3>
                  <p className="text-gray-600">Round-the-clock customer service</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-900">Secure Payments</h3>
                  <p className="text-gray-600">Your financial information is always protected</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Our Story</h2>
          <p className="text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
            EaseCart was founded with a simple vision: to make online shopping effortless and enjoyable. 
            What started as a small team of passionate individuals has grown into a comprehensive e-commerce 
            platform that serves thousands of customers worldwide. We continue to innovate and improve our 
            services to provide you with the best shopping experience possible.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Prices</h3>
            <p className="text-gray-600">Competitive pricing on all our products</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
            <p className="text-gray-600">100% satisfaction or your money back</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Same-day shipping on select items</p>
          </div>
        </div>
      </div>
    </div>
  )
}