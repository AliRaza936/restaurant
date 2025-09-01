import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Lock } from 'lucide-react'
import Footer from '@/components/Footer'

export default function Login() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [showOTP, setShowOTP] = useState(false)
  const { sendOTP, verifyOTP, signIn, loading } = useAuth()
  const { toast } = useToast()

  const handleSendOTP = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive"
      })
      return
    }

    // First check if email exists
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (!data.exists) {
        toast({
          title: "Error",
          description: "Email not registered. Please sign up first.",
          variant: "destructive"
        })
        return
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check email. Please try again.",
        variant: "destructive"
      })
      return
    }

    const result = await sendOTP(email)
    if (result.success) {
      setShowOTP(true)
      toast({
        title: "Success",
        description: result.message
      })
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive"
      })
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive"
      })
      return
    }

    const result = await verifyOTP(email, otp)
    if (result.success) {
      toast({
        title: "Success",
        description: "Login successful!"
      })
      // Redirect to home page or dashboard
      window.location.href = '/'
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive"
      })
    }
  }

  const handleResendOTP = () => {
    setOtp('')
    handleSendOTP()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to your account with OTP verification via email
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {!showOTP ? (
              <Button
                onClick={handleSendOTP}
                disabled={loading || !email}
                className="w-full mt-6 bg-orange-600 hover:bg-orange-700"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </Button>
            ) : (
              <div className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="otp">Enter OTP</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="otp"
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="text-center text-lg font-mono"
                    />
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    OTP sent to your email
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length !== 6}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                  <Button
                    onClick={handleResendOTP}
                    disabled={loading}
                    variant="outline"
                    className="px-4"
                  >
                    Resend
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-orange-600 hover:text-orange-700 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        
    
      </div>
    </div>
  )
}