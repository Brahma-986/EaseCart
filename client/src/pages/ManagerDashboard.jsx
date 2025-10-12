import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchOrders } from '../slices/orderSlice'
import { fetchComplaints } from '../slices/complaintSlice'
import { fetchProducts } from '../slices/productSlice'
import { fetchAnnouncements } from '../slices/announcementSlice'

export default function ManagerDashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { orders, isLoading: ordersLoading } = useSelector(state => state.orders)
  const { complaints, isLoading: complaintsLoading } = useSelector(state => state.complaints)
  const { products } = useSelector(state => state.products)
  const { announcements } = useSelector(state => state.announcements)

  useEffect(() => {
    dispatch(fetchOrders())
    dispatch(fetchComplaints())
    dispatch(fetchProducts())
    dispatch(fetchAnnouncements())
  }, [dispatch])

  const pendingOrders = Array.isArray(orders) ? orders.filter(order => order.status === 'pending') : []
  const recentComplaints = Array.isArray(complaints) ? complaints.filter(complaint => complaint.status === 'open').slice(0, 3) : []
  const lowStockProducts = Array.isArray(products) ? products.filter(product => product.stock < 10) : []

  return (
    <div className="container-px py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manager Dashboard</h1>
        <p className="text-gray-600">Manage your store operations and inventory</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
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
              <p className="text-sm font-medium text-gray-600">Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
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
              <p className="text-sm font-medium text-gray-600">Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{complaints.length}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockProducts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/products/manage" className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-blue-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <div>
                <h3 className="font-medium text-gray-900">Add Product</h3>
                <p className="text-sm text-gray-600">Add new products to inventory</p>
              </div>
            </div>
          </Link>

          <Link to="/orders" className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-green-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <div>
                <h3 className="font-medium text-gray-900">View Orders</h3>
                <p className="text-sm text-gray-600">Manage customer orders</p>
              </div>
            </div>
          </Link>

          <Link to="/announcements" className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-purple-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <div>
                <h3 className="font-medium text-gray-900">Post Announcement</h3>
                <p className="text-sm text-gray-600">Share updates with customers</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/orders" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </Link>
          </div>
          
          {ordersLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Array.isArray(orders) ? orders.slice(0, 5).map((order) => (
                <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order._id.slice(-6)}</p>
                      <p className="text-sm text-gray-600">
                        {order.user?.name || 'Customer'} • {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${order.totalPrice?.toFixed(2) || '0.00'}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-4">No orders available</p>
              )}
            </div>
          )}
        </div>

        {/* Recent Complaints */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Complaints</h2>
            <Link to="/complaints" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </Link>
          </div>
          
          {complaintsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : recentComplaints.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">No open complaints</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentComplaints.map((complaint) => (
                <div key={complaint._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{complaint.title}</p>
                      <p className="text-sm text-gray-600">
                        {complaint.user?.name || 'Customer'} • {complaint.category}
                      </p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      complaint.priority === 'high' ? 'bg-red-100 text-red-800' :
                      complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {complaint.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Low Stock Products */}
      {lowStockProducts.length > 0 && (
        <div className="mt-8">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Low Stock Products</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lowStockProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={product.images?.[0]?.url || product.image}
                            alt={product.name}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          product.stock === 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.stock} left
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/products/manage/${product._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Additional Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/reports" className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-purple-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div>
                <h3 className="font-medium text-gray-900">View Reports</h3>
                <p className="text-sm text-gray-600">Analytics and performance metrics</p>
              </div>
            </div>
          </Link>

          <Link to="/profile" className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-green-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <h3 className="font-medium text-gray-900">Update Profile</h3>
                <p className="text-sm text-gray-600">Manage your account settings</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}