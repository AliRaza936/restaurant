import express from 'express'
import { 
  getSalesData, 
  getDashboardStats, 
  getTopProducts, 
  getTopCategories,
  getOrderStats
} from '../controller/analytics.js'

let analyticsRoute = express.Router()

analyticsRoute.get('/sales', getSalesData)
analyticsRoute.get('/dashboard', getDashboardStats)
analyticsRoute.get('/products/top', getTopProducts)
analyticsRoute.get('/categories/top', getTopCategories)
analyticsRoute.get('/orders/stats', getOrderStats)

export default analyticsRoute