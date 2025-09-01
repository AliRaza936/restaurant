import express from 'express'
import { allOrders, createOrder, deleteOrder, ordersByUser, singleOrder, updateOrderStatus } from '../controller/order.js'

let orderRoute = express.Router()

orderRoute.post('/create', createOrder)
orderRoute.get('/all', allOrders)
orderRoute.get('/single/:id', singleOrder)
orderRoute.put('/update/:id', updateOrderStatus)
orderRoute.delete('/delete/:id', deleteOrder)
orderRoute.get('/userOrder/:id', ordersByUser)

export default orderRoute


