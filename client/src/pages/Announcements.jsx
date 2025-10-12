import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAnnouncements, markAnnouncementAsRead } from '../slices/announcementSlice'
import { createAnnouncement } from '../slices/announcementSlice'

export default function Announcements() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { announcements, isLoading } = useSelector((state) => state.announcements)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetRole: 'all',
    priority: 'medium'
  })

  useEffect(() => {
    dispatch(fetchAnnouncements())
  }, [dispatch])

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(createAnnouncement(formData)).unwrap()
      setFormData({ title: '', message: '', targetRole: 'all', priority: 'medium' })
      setShowCreateForm(false)
    } catch (error) {
      console.error('Failed to create announcement:', error)
    }
  }

  const handleMarkAsRead = (announcementId) => {
    dispatch(markAnnouncementAsRead(announcementId))
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const canCreateAnnouncements = user?.role === 'manager' || user?.role === 'admin'

  return (
    <div className="container-px py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
            <p className="text-gray-600">Stay updated with the latest news and updates</p>
          </div>
          {canCreateAnnouncements && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Post Announcement
            </button>
          )}
        </div>
      </div>

      {/* Create Announcement Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Create New Announcement</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="Enter announcement title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="input w-full"
                    placeholder="Enter announcement message"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                    <select
                      name="targetRole"
                      value={formData.targetRole}
                      onChange={handleInputChange}
                      className="input w-full"
                    >
                      <option value="all">All Users</option>
                      <option value="customer">Customers Only</option>
                      <option value="manager">Managers Only</option>
                      <option value="admin">Admins Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="input w-full"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Post Announcement
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Announcements List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading announcements...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No announcements</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new announcement.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              className={`card p-6 border-l-4 ${
                announcement.priority === 'urgent' ? 'border-red-500' :
                announcement.priority === 'high' ? 'border-orange-500' :
                announcement.priority === 'medium' ? 'border-yellow-500' :
                'border-green-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(announcement.priority)}`}>
                      {announcement.priority.toUpperCase()}
                    </span>
                    {announcement.targetRole !== 'all' && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {announcement.targetRole.toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4">{announcement.message}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span>Posted by {announcement.createdBy?.name || 'System'}</span>
                    <span>•</span>
                    <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                    {announcement.expiresAt && (
                      <>
                        <span>•</span>
                        <span>Expires {new Date(announcement.expiresAt).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>

                {!announcement.readBy?.includes(user?._id) && (
                  <button
                    onClick={() => handleMarkAsRead(announcement._id)}
                    className="ml-4 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}