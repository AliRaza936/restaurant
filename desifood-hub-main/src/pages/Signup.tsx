import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Lock, User, CheckCircle } from 'lucide-react'
import Footer from '@/components/Footer'

export default function Signup() {
  
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [showOTP, setShowOTP] = useState(false)
  const [step, setStep] = useState<'details' | 'otp'>('details')
  const { sendOTP, verifyOTP, signUp, loading } = useAuth()
  const { toast } = useToast()

  const handleSendOTP = async () => {
    

    if (!email) {
      toast({
        title: "Error",
        description: `Please enter your email`,
        variant: "destructive"
      })
      return
    }

    // First create the user
    const signUpResult = await signUp(email)
    if (signUpResult.success) {
      // Then send OTP
      const otpResult = await sendOTP(email)
      if (otpResult.success) {
        setStep('otp')
        setShowOTP(true)
        toast({
          title: "Success",
          description: `OTP sent to your email`
        })
      } else {
        toast({
          title: "Error",
          description: otpResult.message,
          variant: "destructive"
        })
      }
    } else {
      toast({
        title: "Error",
        description: signUpResult.message,
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
        description: "Account created successfully! ",
        duration: 5000
      })
      // Redirect to login page
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
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

  const handleBackToDetails = () => {
    setStep('details')
    setShowOTP(false)
    setOtp('')
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
            <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
            <CardDescription className="text-gray-600">
              Sign up with OTP verification via email
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {step === 'details' ? (
              <>
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

                <Button
                  onClick={handleSendOTP}
                  disabled={loading || !email}
                  className="w-full mt-6 bg-orange-600 hover:bg-orange-700"
                >
                  {loading ? 'Creating Account...' : 'Create Account & Send OTP'}
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Account Created!</h3>
                  <p className="text-sm text-gray-600">
                    Please verify your email with the OTP sent to:
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{email}</p>
                </div>

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

                <Button 
                  onClick={handleBackToDetails} 
                  variant="ghost"
                  className="w-full"
                >
                  Back to Details
                </Button>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        
      
      </div>
    </div>
  )
}