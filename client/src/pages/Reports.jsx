import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchOrderStats } from '../slices/orderSlice'
import { fetchComplaints } from '../slices/complaintSlice'
import { fetchUsers } from '../slices/userSlice'
import { fetchProducts } from '../slices/productSlice'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

export default function Reports() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { orders, stats: orderStats } = useSelector((state) => state.orders)
  const { complaints } = useSelector((state) => state.complaints)
  const { users } = useSelector((state) => state.users)
  const { products } = useSelector((state) => state.products)

  const [timeRange, setTimeRange] = useState('6months')

  useEffect(() => {
    dispatch(fetchOrderStats())
    dispatch(fetchComplaints())
    dispatch(fetchProducts())
    if (user?.role === 'admin') {
      dispatch(fetchUsers())
    }
  }, [dispatch, user])

  // Sample data for charts (in real app, this would come from API)
  const salesData = [
    { month: 'Jan', sales: 12000, orders: 45 },
    { month: 'Feb', sales: 19000, orders: 67 },
    { month: 'Mar', sales: 15000, orders: 52 },
    { month: 'Apr', sales: 25000, orders: 89 },
    { month: 'May', sales: 22000, orders: 78 },
    { month: 'Jun', sales: 30000, orders: 95 }
  ]

  const orderStatusData = [
    { name: 'Pending', value: 25, color: '#FFA500' },
    { name: 'Shipped', value: 150, color: '#0088FE' },
    { name: 'Delivered', value: 275, color: '#00C49F' },
    { name: 'Cancelled', value: 15, color: '#FF4444' }
  ]

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#8884d8' },
    { name: 'Home', value: 25, color: '#82ca9d' },
    { name: 'Sports', value: 20, color: '#ffc658' },
    { name: 'Other', value: 20, color: '#ff7300' }
  ]

  const complaintData = [
    { month: 'Jan', complaints: 5, resolved: 4 },
    { month: 'Feb', complaints: 8, resolved: 7 },
    { month: 'Mar', complaints: 12, resolved: 10 },
    { month: 'Apr', complaints: 6, resolved: 6 },
    { month: 'May', complaints: 9, resolved: 8 },
    { month: 'Jun', complaints: 4, resolved: 3 }
  ]

  const totalRevenue = salesData.reduce((sum, item) => sum + item.sales, 0)
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0)
  const totalComplaints = complaints?.length || 0
  const resolvedComplaints = complaints?.filter(c => c.status === 'resolved').length || 0

  return (
    <div className="container-px py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Comprehensive insights into your business performance</p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Time Range:</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input w-40"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{totalComplaints}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{users?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sales Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']} />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Product Categories */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Complaints Trend */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaints Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={complaintData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="complaints" stroke="#ff4444" strokeWidth={2} name="Complaints" />
              <Line type="monotone" dataKey="resolved" stroke="#00C49F" strokeWidth={2} name="Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Statistics */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Statistics</h3>
          <div className="space-y-4">
            {orderStatusData.map((status) => (
              <div key={status.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3" 
                    style={{ backgroundColor: status.color }}
                  ></div>
                  <span className="text-gray-700">{status.name}</span>
                </div>
                <span className="font-semibold">{status.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-3">
            {products?.slice(0, 5).map((product, index) => (
              <div key={product._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 truncate">{product.name}</span>
                </div>
                <span className="font-semibold">${product.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-700">Avg Order Value</span>
              <span className="font-semibold">${(totalRevenue / totalOrders).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Complaint Resolution Rate</span>
              <span className="font-semibold">
                {totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Total Products</span>
              <span className="font-semibold">{products?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Active Users</span>
              <span className="font-semibold">{users?.filter(u => u.isActive).length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}