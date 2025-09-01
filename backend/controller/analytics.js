import db from '../database/db.js'

// Get sales data for charts
const getSalesData = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const endDate = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }
    
    // Get daily sales data
    const [rows] = await db.execute(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        SUM(total_amount) as revenue
      FROM orders 
      WHERE created_at >= ? AND created_at <= ?
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [startDate, endDate]);
    
    return res.status(200).send({
      success: true,
      result: rows
    });
  } catch (error) {
    console.error('Error getting sales data:', error);
    return res.status(500).send({ 
      success: false, 
      message: 'Failed to get sales data: ' + error.message 
    });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get total orders
    const [totalOrdersResult] = await db.execute(`
      SELECT COUNT(*) as count FROM orders
    `);
    
    // Get total revenue
    const [totalRevenueResult] = await db.execute(`
      SELECT SUM(total_amount) as total FROM orders
    `);
    
    // Get pending orders
    const [pendingOrdersResult] = await db.execute(`
      SELECT COUNT(*) as count FROM orders WHERE status = 'pending'
    `);
    
    // Get today's orders
    const [todayOrdersResult] = await db.execute(`
      SELECT COUNT(*) as count FROM orders 
      WHERE DATE(created_at) = CURDATE()
    `);
    
    // Get today's revenue
    const [todayRevenueResult] = await db.execute(`
      SELECT SUM(total_amount) as total FROM orders 
      WHERE DATE(created_at) = CURDATE()
    `);
    
    const stats = {
      totalOrders: totalOrdersResult[0].count || 0,
      totalRevenue: totalRevenueResult[0].total || 0,
      pendingOrders: pendingOrdersResult[0].count || 0,
      todayOrders: todayOrdersResult[0].count || 0,
      todayRevenue: todayRevenueResult[0].total || 0
    };
    
    return res.status(200).send({
      success: true,
      result: stats
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return res.status(500).send({ 
      success: false, 
      message: 'Failed to get dashboard stats: ' + error.message 
    });
  }
};

// Get top products
const getTopProducts = async (req, res) => {
  try {
    let { limit = 10 } = req.query;
    limit = parseInt(limit) || 10; // ensure it's a number, fallback 10

    // NOTE: can't use ? placeholder in LIMIT
    const [rows] = await db.execute(`
      SELECT 
        product_name,
        SUM(quantity) as total_quantity,
        SUM(quantity * price) as total_revenue
      FROM order_items
      GROUP BY product_name
      ORDER BY total_quantity DESC
      LIMIT ${limit}
    `);

    return res.status(200).send({
      success: true,
      result: rows
    });
  } catch (error) {
    console.error('Error getting top products:', error);
    return res.status(500).send({ 
      success: false, 
      message: 'Failed to get top products: ' + error.message 
    });
  }
};


// Get top categories
const getTopCategories = async (req, res) => {
  try {
    // This would require joining with a products table that has categories
    // For now, we'll return mock data or implement based on product names
    const [rows] = await db.execute(`
      SELECT 
        product_name,
        SUM(quantity) as total_quantity
      FROM order_items
      GROUP BY product_name
      ORDER BY total_quantity DESC
      LIMIT 10
    `);
    
    // In a real implementation, you would map product names to categories
    // For now, we'll return the data as is
    return res.status(200).send({
      success: true,
      result: rows
    });
  } catch (error) {
    console.error('Error getting top categories:', error);
    return res.status(500).send({ 
      success: false, 
      message: 'Failed to get top categories: ' + error.message 
    });
  }
};

// Get order statistics by status
const getOrderStats = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        status,
        COUNT(*) as count
      FROM orders
      GROUP BY status
    `);
    
    return res.status(200).send({
      success: true,
      result: rows
    });
  } catch (error) {
    console.error('Error getting order stats:', error);
    return res.status(500).send({ 
      success: false, 
      message: 'Failed to get order stats: ' + error.message 
    });
  }
};

export { 
  getSalesData, 
  getDashboardStats, 
  getTopProducts, 
  getTopCategories,
  getOrderStats
};