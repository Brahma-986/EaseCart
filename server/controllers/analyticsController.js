const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

function getMonthLabel(date) {
  return date.toLocaleString('default', { month: 'short' });
}

const getReports = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const [orderStats, monthlyRevenue, statusBreakdown, categoryData, userSegments, userCount] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalPrice' },
            totalOrders: { $sum: 1 },
            avgOrderValue: { $avg: '$totalPrice' }
          }
        }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate }, status: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            revenue: { $sum: '$totalPrice' },
            orders: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Product.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 }, revenue: { $sum: 0 } } }
      ]),
      getSegments(),
      User.countDocuments({ role: 'customer' })
    ]);

    const stats = orderStats[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 };

    const monthlyData = [];
    for (let i = 0; i < months; i++) {
      const d = new Date(startDate);
      d.setMonth(d.getMonth() + i);
      const m = monthlyRevenue.find(
        (r) => r._id.year === d.getFullYear() && r._id.month === d.getMonth() + 1
      );
      monthlyData.push({
        month: getMonthLabel(d),
        sales: m?.revenue || 0,
        orders: m?.orders || 0
      });
    }

    const statusColors = { delivered: '#00C49F', shipped: '#0088FE', processing: '#FFA500', pending: '#FFA500', cancelled: '#FF4444' };
    const orderStatusData = statusBreakdown.map((s) => ({
      name: s._id.charAt(0).toUpperCase() + s._id.slice(1),
      value: s.count,
      color: statusColors[s._id] || '#8884d8'
    }));

    const categoryChartData = categoryData.map((c, i) => ({
      name: c._id.charAt(0).toUpperCase() + c._id.slice(1),
      value: c.count,
      color: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c', '#d0ed57'][i % 6]
    }));

    res.json({
      success: true,
      data: {
        totalRevenue: stats.totalRevenue,
        totalOrders: stats.totalOrders,
        totalUsers: userCount,
        avgOrderValue: stats.avgOrderValue,
        monthlyData,
        orderStatusData,
        categoryData: categoryChartData,
        userSegments,
        months
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

async function getSegments() {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const customers = await User.find({ role: 'customer' }).select('_id createdAt');
  const orderAgg = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: '$user',
        totalSpent: { $sum: '$totalPrice' },
        orderCount: { $sum: 1 },
        lastOrder: { $max: '$createdAt' }
      }
    }
  ]);

  const orderMap = new Map(orderAgg.map((o) => [o._id.toString(), o]));

  let newCustomers = 0;
  let frequentBuyers = 0;
  let inactiveUsers = 0;

  for (const u of customers) {
    const ord = orderMap.get(u._id.toString());
    const orderCount = ord?.orderCount || 0;
    const lastOrder = ord?.lastOrder;
    const isNew = u.createdAt >= thirtyDaysAgo;
    const isFrequent = orderCount >= 3;
    const isInactive = !lastOrder || lastOrder < ninetyDaysAgo;

    if (isNew) newCustomers++;
    if (isFrequent) frequentBuyers++;
    if (isInactive) inactiveUsers++;
  }

  return {
    newCustomers,
    frequentBuyers,
    inactiveUsers,
    total: customers.length
  };
}

module.exports = { getReports };
