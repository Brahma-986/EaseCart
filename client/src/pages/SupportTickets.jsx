import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchComplaints } from '../slices/complaintSlice'

export default function SupportTickets() {
  const dispatch = useDispatch()
  const { complaints, isLoading } = useSelector((state) => state.complaints)

  useEffect(() => {
    dispatch(fetchComplaints())
  }, [dispatch])

  const statusColor = (s) => {
    switch (s) {
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="container-px py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Support Tickets</h1>
          <p className="text-gray-600 mt-1">View and track your support requests</p>
        </div>
        <Link to="/feedback" className="btn btn-primary">New Ticket</Link>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" />
        </div>
      ) : !complaints?.length ? (
        <div className="card p-12 text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No tickets yet</h3>
          <p className="mt-2 text-gray-500">Submit feedback or report an issue to create a support ticket.</p>
          <Link to="/feedback" className="btn btn-primary mt-6 inline-block">Submit Feedback</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((t) => (
            <div key={t._id} className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{t.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{t.category} • {new Date(t.createdAt).toLocaleDateString()}</p>
                  <p className="text-gray-600 mt-2 line-clamp-2">{t.message}</p>
                </div>
                <span className={`self-start sm:self-center px-3 py-1 text-sm font-medium rounded-full ${statusColor(t.status)}`}>
                  {t.status}
                </span>
              </div>
              {t.response?.message && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm font-medium text-gray-700">Response from support:</p>
                  <p className="text-gray-600 mt-1">{t.response.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
