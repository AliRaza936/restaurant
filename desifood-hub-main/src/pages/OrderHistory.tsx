import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, History, Package, Star, Calendar, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAppDispatch } from '@/store/hooks'
import {  getUserOrderById } from '@/store/order/orderSlice'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import Footer from '@/components/Footer'

export default function OrderHistory() {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const orderState: any = useSelector((state: RootState) => state.orders)
  const { orders, loading } = orderState
  const [userOrders, setUserOrders] = useState<any[]>([])

 useEffect(() => {
  if (user?.id) {
    dispatch(getUserOrderById(user.id))
  }
}, [dispatch, user?.id])

  useEffect(() => {
    if (orders && user) {
      // Filter orders by user ID
      const filteredOrders = orders.filter((order: any) => order.user_id === user.id)
      setUserOrders(filteredOrders)
    }
  }, [orders, user])


  return (
 <div className="min-h-screen  bg-gradient-to-br from-orange-50 to-red-50 ">
      <div className="p-4 mx-auto ">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {userOrders.length} orders
            </Badge>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p>Loading orders...</p>
          </div>
        ) : userOrders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <History className="w-24 h-24 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">No order history</h2>
              <p className="text-gray-600 mb-6">Start ordering delicious food to see your order history here!</p>
              <Link to="/">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Browse Menu
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-6">
            {userOrders.map((order) => (
              <Card key={order.id} className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-blue-500" />
                      <div>
                        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                        <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {order.status}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 text-right">
                      <Badge className={`px-2 py-1 rounded ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="space-y-3">
                    {(order.items && (typeof order.items === 'string' ? JSON.parse(order.items) : order.items)).map((item: any, idx: number) => (
                      <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-gray-100 last:border-b-0 gap-2">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <span className="text-sm font-medium">{item.quantity}x</span>
                          <span className="text-white">{item.product_name}</span>
                          {item.size && <span className="text-xs text-gray-500">({item.size})</span>}
                          {item.pieces && <span className="text-xs text-gray-500">({item.pieces} pcs)</span>}
                        </div>
                        <span className="text-gray-600 font-medium sm:ml-4">₨{item.price}</span>
                      </div>
                    ))}
                    <div className="pt-3  border-gray-200 flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-orange-600">₨{order.total_amount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
  
    </div>
  )
}
