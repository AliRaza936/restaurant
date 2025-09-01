import ObjectId from 'bson-objectid'
import dotenv from 'dotenv'
import  db  from '../database/db.js'
dotenv.config()

const ALLOWED_STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']

let createOrder = async (req, res) => {
  try {
    const {
      name,
      phone,
      streetAddress,
      city,
      postalCode,
      specialInstructions,
      paymentMethod,
      items,
      totalAmount,
      userId,
    } = req.body

    if (!name || !phone || !streetAddress || !city || !postalCode) {
      return res.status(400).send({ success: false, message: 'name, phone, streetAddress, city, postalCode are required' })
    }

    const id = ObjectId().toHexString()
    const status = 'pending'
    const payment = paymentMethod && String(paymentMethod).trim() !== '' ? paymentMethod : 'COD'

    const itemsJson = items ? (typeof items === 'string' ? items : JSON.stringify(items)) : null
    const total = typeof totalAmount === 'undefined' || totalAmount === null ? null : totalAmount

    // Insert main order
    const [orderResult] = await db.execute(
      `INSERT INTO orders (id, name, phone, street_address, city, postal_code, special_instructions, payment_method, status, total_amount, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, phone, streetAddress, city, postalCode, specialInstructions || null, payment, status, total, userId || null]
    )

    // Insert order items
    if (items && Array.isArray(items)) {
      for (const item of items) {
        await db.execute(
          `INSERT INTO order_items (order_id, product_name, size, pieces, quantity, price)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [id, item.name, item.size || null, item.pieces || null, item.quantity, item.price]
        )
      }
    }

    // Get the created order with items
    const [orderRows] = await db.execute(`SELECT * FROM orders WHERE id = ?`, [id])
    const [itemRows] = await db.execute(`SELECT * FROM order_items WHERE order_id = ?`, [id])
    
    return res.status(201).send({
      success: true,
      message: 'Order placed successfully',
      result: {
        ...orderRows[0],
        items: itemRows
      },
    })
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).send({ success: false, message: 'Failed to create order: ' + error.message })
  }
}

let allOrders = async (req, res) => {
  try {
    const [rows] = await db.execute(`SELECT * FROM orders ORDER BY created_at DESC`)
    
    // Add items to each order
    for (const order of rows) {
      const [items] = await db.execute(`SELECT * FROM order_items WHERE order_id = ?`, [order.id])
      order.items = items
    }
    
    return res.status(200).send({ success: true, result: rows })
  } catch (error) {
    console.error('Error getting all orders:', error);
    return res.status(500).send({ success: false, message: 'Failed to get orders: ' + error.message })
  }
}

let singleOrder = async (req, res) => {
  try {
    const { id } = req.params
    const [rows] = await db.execute(`SELECT * FROM orders WHERE id = ?`, [id])
    if (rows.length === 0) return res.status(404).send({ success: false, message: 'Order not found' })
    
    // Add items to the order
    const [items] = await db.execute(`SELECT * FROM order_items WHERE order_id = ?`, [id])
    rows[0].items = items
    
    return res.status(200).send({ success: true, result: rows[0] })
  } catch (error) {
    console.error('Error getting single order:', error);
    return res.status(500).send({ success: false, message: 'Failed to get order: ' + error.message })
  }
}

let updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const [existingRows] = await db.execute(`SELECT * FROM orders WHERE id = ?`, [id])
    if (existingRows.length === 0) return res.status(404).send({ success: false, message: 'Order not found' })

    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).send({ success: false, message: 'Invalid status value' })
    }

    const nextStatus = status || existingRows[0].status
 

    await db.execute(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [nextStatus, id]
    )

    const [updatedRows] = await db.execute(`SELECT * FROM orders WHERE id = ?`, [id])
    return res.status(200).send({ success: true, message: 'Order updated successfully', result: updatedRows[0] })
  } catch (error) {
    console.log(error)
    console.error('Error updating order status:', error);
    return res.status(500).send({ success: false, message: 'Failed to update order: ' + error.message })
  }
}

let deleteOrder = async (req, res) => {
  try {
    const { id } = req.params
    const [rows] = await db.execute(`SELECT * FROM orders WHERE id = ?`, [id])
    if (rows.length === 0) return res.status(404).send({ success: false, message: 'Order not found' })

    await db.execute(`DELETE FROM orders WHERE id = ?`, [id])
    return res.status(200).send({ success: true, message: 'Order deleted successfully' })
  } catch (error) {
    console.error('Error deleting order:', error);
    return res.status(500).send({ success: false, message: 'Failed to delete order: ' + error.message })
  }
}
let ordersByUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({ success: false, message: "userId is required" });
    }

    // Fetch orders for the user
    const [rows] = await db.execute(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).send({ success: false, message: "No orders found for this user" });
    }

    // Add items to each order
    for (const order of rows) {
      const [items] = await db.execute(`SELECT * FROM order_items WHERE order_id = ?`, [order.id]);
      order.items = items;
    }

    return res.status(200).send({ success: true, result: rows });
  } catch (error) {
    console.log("Error getting orders by user:", error);
    return res.status(500).send({ success: false, message: "Failed to get user orders: " + error.message });
  }
};


export { createOrder, allOrders, singleOrder, updateOrderStatus, deleteOrder, ordersByUser}


