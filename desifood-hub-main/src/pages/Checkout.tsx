import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { clearCart } from '@/store/cartSlice'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { ArrowLeft, MapPin, CreditCard, Clock } from 'lucide-react'
import { createOrder } from '@/store/order/orderSlice'

export default function Checkout() {
  const { items, total } = useAppSelector(state => state.cart)
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    specialInstructions: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
   

    const payload = {
      name: formData.fullName,
      phone: formData.phone,
      streetAddress: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      specialInstructions: formData.specialInstructions,
      paymentMethod: 'COD',
      items: items.map(i => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        total: i.price * i.quantity,
        size: i.size,
        pieces: i.pieces
      })),
      totalAmount: total,
      userId: user?.id
    }
let userId = user?.id
if(!userId){
  toast.error('First login to place order')
  return
}
 setIsLoading(true)
    try {
      await (dispatch(createOrder(payload)) as any).unwrap()
      toast.success('Order placed successfully!')
      dispatch(clearCart())
      navigate('/')
    } catch (err) {
      toast.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Add some items to your cart before checkout</p>
            <Button onClick={() => navigate('/')} className="bg-gradient-primary text-primary-foreground">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="lg:flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mr-4 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Button>
          <h1 className="text-xl lg:text-3xl font-bold text-foreground">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div>
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <MapPin className="h-5 w-5" />
                  Delivery Information
                </CardTitle>
                <CardDescription>
                  Please provide your delivery details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-foreground">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="bg-surface-container border-border focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-foreground">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="03xxxxxxxxx"
                        required
                        className="bg-surface-container border-border focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-foreground">Street Address *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="House # / Street / Area"
                      required
                      className="bg-surface-container border-border focus:border-primary min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-foreground">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Karachi"
                        required
                        className="bg-surface-container border-border focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode" className="text-foreground">Postal Code</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="75500"
                        className="bg-surface-container border-border focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialInstructions" className="text-foreground">Special Instructions</Label>
                    <Textarea
                      id="specialInstructions"
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleInputChange}
                      placeholder="Any special instructions for delivery..."
                      className="bg-surface-container border-border focus:border-primary"
                    />
                  </div>

                  {/* Payment Method */}
                  <Card className="bg-surface-elevated border-border">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-sm text-foreground">
                        <CreditCard className="h-4 w-4" />
                        Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-3 p-3 bg-surface-container rounded-lg border border-primary">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">Cash on Delivery</p>
                          <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Placing Order..." : `Place Order - ₨${total}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-card border-border shadow-card sticky top-24">
              <CardHeader>
                <CardTitle className="text-foreground">Order Summary</CardTitle>
                <CardDescription>
                  Review your items before placing the order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                        {item.pieces && <p className="text-xs text-muted-foreground">Pieces: {item.pieces}</p>}
                      </div>
                      <p className="font-medium text-foreground">₨{item.price * item.quantity}</p>
                    </div>
                  ))}
                  
                  <Separator className="bg-border" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">₨{total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span className="text-green-500">Free</span>
                    </div>
                    <Separator className="bg-border" />
                    <div className="flex justify-between font-bold">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">₨{total}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-surface-container rounded-lg border border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Estimated delivery: 30-45 minutes</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}