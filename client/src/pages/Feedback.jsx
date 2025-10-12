import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createComplaint } from '../slices/complaintSlice'

export default function Feedback() {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    category: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      alert('Please log in to submit feedback')
      return
    }

    setIsSubmitting(true)
    
    try {
      await dispatch(createComplaint(formData)).unwrap()
      setIsSubmitted(true)
      setFormData({ title: '', message: '', category: 'general' })
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      alert('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="container-px py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
          <p className="text-gray-600 mb-8">
            Your feedback has been submitted successfully. We'll review it and get back to you soon.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="btn btn-primary"
          >
            Submit Another Feedback
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-px py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Send Us Feedback</h1>
          <p className="text-gray-600">
            We value your opinion and would love to hear from you
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="input w-full"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="general">General Feedback</option>
                <option value="product">Product Issue</option>
                <option value="shipping">Shipping Problem</option>
                <option value="order">Order Issue</option>
                <option value="website">Website Problem</option>
                <option value="suggestion">Suggestion</option>
              </select>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="input w-full"
                placeholder="Brief description of your feedback"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="input w-full"
                placeholder="Please provide detailed feedback..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            {!isAuthenticated && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      Please <a href="/login" className="font-medium underline">log in</a> to submit feedback.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setFormData({ title: '', message: '', category: 'general' })}
                className="btn btn-outline"
                disabled={isSubmitting}
              >
                Clear
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || !isAuthenticated}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600">support@easecart.com</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600">Mon-Fri 9AM-6PM EST</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">General Feedback</span>
                <span className="font-medium">2-3 business days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Product Issues</span>
                <span className="font-medium">1-2 business days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Urgent Issues</span>
                <span className="font-medium">Same day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}