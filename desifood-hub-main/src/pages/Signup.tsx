import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export default function Signup() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive"
      })
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive"
      })
      return false
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      })
      return false
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  const handleSignup = async () => {
    if (!validateForm()) return

    try {
      setLoading(true)

      const response = await axios.post(
        `${API_URL}/auth/register`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      )

      toast({
        title: "Success",
        description: response.data.message || "Account created successfully!",
      })

      setTimeout(() => navigate('/login'), 2000)
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Signup failed. Please try again!"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
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
            <CardTitle className="text-2xl font-bold text-orange-700">Create Account</CardTitle>
            <CardDescription className="text-gray-600">
              Sign up with your email and password
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <User className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="flex items-center gap-2 mt-1 relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password (min 6 chars)"
                    value={formData.password}
                    onChange={handleChange}
                    className="pr-10"
                  />
                  {showPassword ? (
                    <EyeOff
                      onClick={() => setShowPassword(false)}
                      className="w-5 h-5 text-gray-500 cursor-pointer absolute right-2"
                    />
                  ) : (
                    <Eye
                      onClick={() => setShowPassword(true)}
                      className="w-5 h-5 text-gray-500 cursor-pointer absolute right-2"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="flex items-center gap-2 mt-1 relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pr-10"
                  />
                  {showConfirmPassword ? (
                    <EyeOff
                      onClick={() => setShowConfirmPassword(false)}
                      className="w-5 h-5 text-gray-500 cursor-pointer absolute right-2"
                    />
                  ) : (
                    <Eye
                      onClick={() => setShowConfirmPassword(true)}
                      className="w-5 h-5 text-gray-500 cursor-pointer absolute right-2"
                    />
                  )}
                </div>
              </div>
            </div>

            <Button
              onClick={handleSignup}
              disabled={loading}
              className="w-full mt-6 bg-orange-600 hover:bg-orange-700"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>

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
