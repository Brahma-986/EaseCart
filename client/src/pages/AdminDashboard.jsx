import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchUsers } from '../slices/userSlice'
import { fetchOrders } from '../slices/orderSlice'
import { fetchComplaints } from '../slices/complaintSlice'
import { fetchProducts } from '../slices/productSlice'
import { fetchAnnouncements } from '../slices/announcementSlice'

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { users, isLoading: usersLoading } = useSelector(state => state.users)
  const { orders } = useSelector(state => state.orders)
  const { complaints } = useSelector(state => state.complaints)
  const { products } = useSelector(state => state.products)
  const { announcements } = useSelector(state => state.announcements)

  useEffect(() => {
    dispatch(fetchUsers())
    dispatch(fetchOrders())
    dispatch(fetchComplaints())
    dispatch(fetchProducts())
    dispatch(fetchAnnouncements())
  }, [dispatch])

  const activeUsers = Array.isArray(users) ? users.filter(u => u.isActive) : []
  const totalRevenue = Array.isArray(orders) ? orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0) : 0
  const pendingComplaints = Array.isArray(complaints) ? complaints.filter(c => c.status === 'open') : []

  return (
    <div className="container-px py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and user management</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Issues</p>
              <p className="text-2xl font-bold text-gray-900">{pendingComplaints.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link to="/users/manage" className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-blue-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <div>
                <h3 className="font-medium text-gray-900">Add User</h3>
                <p className="text-sm text-gray-600">Create new user accounts</p>
              </div>
            </div>
          </Link>

          <Link to="/reports" className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-purple-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div>
                <h3 className="font-medium text-gray-900">View Analytics</h3>
                <p className="text-sm text-gray-600">System performance metrics</p>
              </div>
            </div>
          </Link>

          <Link to="/announcements" className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-green-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <div>
                <h3 className="font-medium text-gray-900">Post Announcement</h3>
                <p className="text-sm text-gray-600">Global system announcements</p>
              </div>
            </div>
          </Link>

          <Link to="/system-config" className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-gray-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <h3 className="font-medium text-gray-900">System Settings</h3>
                <p className="text-sm text-gray-600">Configure system parameters</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* User Management */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
            <Link to="/users/manage" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Manage All
            </Link>
          </div>
          
          {usersLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(users) ? users.slice(0, 5).map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        No users available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* System Overview */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">System Overview</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">User Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {users?.filter(u => u.role === 'customer').length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Customers</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {users?.filter(u => u.role === 'manager').length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Managers</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Content Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Products</span>
                  <span className="font-semibold">{products.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-semibold">{orders.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Announcements</span>
                  <span className="font-semibold">{announcements.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Open Complaints</span>
                  <span className="font-semibold">{pendingComplaints.length}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Revenue Summary</h3>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">${totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent System Activity</h2>
          
          <div className="space-y-4">
            {Array.isArray(orders) ? orders.slice(0, 3).map((order) => (
              <div key={order._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    New order #{order._id.slice(-6)} from {order.user?.name || 'Customer'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  ${order.totalPrice?.toFixed(2) || '0.00'}
                </span>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">No recent orders available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}