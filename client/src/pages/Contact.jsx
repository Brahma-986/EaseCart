import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { submitContact, reset } from '../slices/contactSlice'

export default function Contact() {
  const dispatch = useDispatch()
  const { submitted, error } = useSelector((state) => state.contact)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(submitContact(form))
  }

  if (submitted) {
    return (
      <div className="container-px py-16">
        <div className="card p-10 max-w-lg mx-auto text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Message Sent</h2>
          <p className="text-gray-600 mt-2 mb-6">Thank you for reaching out. We'll get back to you soon.</p>
          <button onClick={() => dispatch(reset())} className="btn btn-primary">Send Another Message</button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-px py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600">Have a question? Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="input w-full"
                placeholder="What is this about?"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                className="input w-full"
                placeholder="Your message..."
                required
              />
            </div>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
            )}
            <button type="submit" className="btn btn-primary w-full">Send Message</button>
          </form>
        </div>

        <div className="mt-12 card p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Other Ways to Reach Us</h3>
          <div className="space-y-2 text-gray-600">
            <p>📧 support@easecart.com</p>
            <p>📞 +1 (555) 123-4567</p>
            <p>🕐 Mon–Fri 9AM–6PM EST</p>
          </div>
        </div>
      </div>
    </div>
  )
}
