import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { removeFromCart, incrementQuantity, decrementQuantity, clearCart } from '@/store/cartSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import Footer from '@/components/Footer'
import { useEffect } from 'react'

export default function Cart() {
  const { items, total, itemCount } = useAppSelector(state => state.cart)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id))
    toast({
      title: "Item removed",
      description: "Item has been removed from cart"
    })
  }

  useEffect(()=>{
    window.scrollTo(0,0)
  },[])
  const handleIncrement = (id: string) => {
    dispatch(incrementQuantity(id))
  }

  const handleDecrement = (id: string) => {
    dispatch(decrementQuantity(id))
  }

  const handleClearCart = () => {
    dispatch(clearCart())
    toast({
      title: "Cart cleared",
      description: "All items have been removed from cart"
    })
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Please add items to cart before checkout",
        variant: "destructive"
      })
      return
    }
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingCart className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious food to get started!</p>
          <Link to="/">
            <Button className="bg-orange-600 hover:bg-orange-700">
              Browse Menu
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
   <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 ">
  <div className=" mx-auto p-4">
    {/* Header */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
      <div className="flex items-center gap-4">
        <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Link>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {items?.length} items
        </Badge>
      </div>
      <Button 
        onClick={handleClearCart}
        variant="outline"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Clear Cart
      </Button>
    </div>

    <div className="flex flex-col lg:flex-row gap-6">
      {/* Cart Items */}
      <div className="lg:flex-2">
        <Card>
          <CardHeader>
            <CardTitle>Cart Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex  flex-col sm:flex-row items-center sm:items-start gap-4 p-4 border rounded-lg bg- shadow-sm">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded-lg"
                />
                <div className="flex-1 gap-3 flex flex-col sm:flex-row sm:justify-between w-full">
                  <div>
                    <h3 className="font-semibold text-white">{item.name}</h3>
                    <p className="text-orange-600 font-medium">Rs {item.price.toFixed(2)}</p>
                    {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                    {item.pieces && <p className="text-sm text-gray-500">Pieces: {item.pieces}</p>}
                  </div>
                  <div className="flex items-center gap-1 mt-2 sm:mt-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDecrement(item.id)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleIncrement(item.id)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="mt-2 sm:mt-0 text-right">
                    <p className="font-semibold text-white">
                      Rs{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div className="lg:flex-1">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span>Rs {total.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>Rs {(total).toFixed(2)}</span>
              </div>
            </div>
            
            <Button 
              onClick={handleCheckout}
              className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-3"
            >
              Proceed to Checkout
            </Button>
            
          
          </CardContent>
        </Card>
      </div>
    </div>
    <br />
  </div>
  <Footer />
</div>

  )
}
