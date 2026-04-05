import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchReports } from '../slices/analyticsSlice'
import { fetchComplaints } from '../slices/complaintSlice'
import { fetchProducts } from '../slices/productSlice'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

export default function Reports() {
  const dispatch = useDispatch()
  const { data, isLoading, error } = useSelector((state) => state.analytics)
  const { complaints } = useSelector((state) => state.complaints)
  const { products } = useSelector((state) => state.products)

  const [timeRange, setTimeRange] = useState('6months')

  const monthsMap = { '1month': 1, '3months': 3, '6months': 6, '1year': 12 }

  useEffect(() => {
    dispatch(fetchReports({ months: monthsMap[timeRange] || 6 }))
    dispatch(fetchComplaints())
    dispatch(fetchProducts())
  }, [dispatch, timeRange])

  const d = data || {}
  const salesData = d.monthlyData || []
  const orderStatusData = d.orderStatusData || []
  const categoryData = d.categoryData || []
  const segments = d.userSegments || {}
  const totalRevenue = d.totalRevenue ?? 0
  const totalOrders = d.totalOrders ?? 0
  const totalUsers = d.totalUsers ?? 0
  const avgOrderValue = d.avgOrderValue ?? 0
  const totalComplaints = complaints?.length || 0
  const resolvedComplaints = complaints?.filter((c) => c.status === 'resolved').length || 0

  if (isLoading && !data) {
    return (
      <div className="container-px py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="container-px py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Comprehensive insights into your business performance</p>
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mr-3">Time Range:</label>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="input w-40">
          <option value="1month">Last Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700">{error}</div>
      )}

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
              <p className="text-2xl font-bold text-gray-900">${Number(totalRevenue).toLocaleString()}</p>
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
              <p className="text-sm font-medium text-gray-600">Support Tickets</p>
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
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Segmentation */}
      <div className="card p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Segmentation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-700">New Customers</p>
            <p className="text-2xl font-bold text-blue-900">{segments.newCustomers ?? 0}</p>
            <p className="text-xs text-blue-600 mt-1">Registered in last 30 days</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-700">Frequent Buyers</p>
            <p className="text-2xl font-bold text-green-900">{segments.frequentBuyers ?? 0}</p>
            <p className="text-xs text-green-600 mt-1">3+ orders</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <p className="text-sm font-medium text-amber-700">Inactive Users</p>
            <p className="text-2xl font-bold text-amber-900">{segments.inactiveUsers ?? 0}</p>
            <p className="text-xs text-amber-600 mt-1">No order in 90+ days</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-3">Total customers: {segments.total ?? 0}</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue & Orders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => (typeof v === 'number' && v > 100 ? `$${v.toLocaleString()}` : v)} />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} name="Revenue ($)" />
              <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>
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
                {orderStatusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" name="Products" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-700">Avg Order Value</span>
              <span className="font-semibold">${Number(avgOrderValue).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Resolution Rate</span>
              <span className="font-semibold">
                {totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Total Products</span>
              <span className="font-semibold">{products?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Orders per User</span>
              <span className="font-semibold">
                {totalUsers > 0 ? (totalOrders / totalUsers).toFixed(1) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Statistics Table */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Breakdown</h3>
        <div className="space-y-3">
          {orderStatusData.map((s) => (
            <div key={s.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: s.color || '#8884d8' }}
                />
                <span className="text-gray-700">{s.name}</span>
              </div>
              <span className="font-semibold">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
