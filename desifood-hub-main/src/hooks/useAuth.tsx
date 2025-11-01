import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { requestOtp, verifyOtp, updateProfile, logout, setUser } from '@/store/auth/authSlice'
import { toast } from 'sonner'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading: reduxLoading, isAuthenticated, error } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true); // add local loading

  // Check if user is logged in from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser && !user) {
        try {
          const parsedUser = JSON.parse(savedUser);
          dispatch(setUser(parsedUser));
        } catch {
          localStorage.removeItem('user');
        }
      }
      setLoading(false); // done initializing
    };

    initAuth();
  }, [dispatch, user]);

  const sendOTP = async (email: string) => {
    try {
      const response = await dispatch(requestOtp(email)).unwrap()
      return { success: true, message: response.message || 'OTP sent successfully' }
    } catch (error: any) {
      return { success: false, message: error || 'Failed to send OTP' }
    }
  }

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const response = await dispatch(verifyOtp({ email, code: otp })).unwrap()
      return { success: true, message: response.message || 'OTP verified successfully' }
    } catch (error: any) {
      return { success: false, message: error || 'Invalid OTP' }
    }
  }

  const signUp = async (email: string) => {
    // For signup, we'll just send OTP for now
    // In a full implementation, you might have a separate signup endpoint
    return sendOTP(email)
  }

  const signIn = async (email: string) => {
    // For sign in, we'll just send OTP for now
    return sendOTP(email)
  }

  const signOut = async () => {
    dispatch(logout())
    toast.success('Logout successfully done!')
    return { success: true, message: 'Signed out successfully' }
  }

  const updateProfileInfo = async (id: string, profileData: any) => {
    try {
      const response = await dispatch(updateProfile({ id, profileData })).unwrap()
      return { success: true, message: 'Profile updated successfully', data: response }
    } catch (error: any) {
      return { success: false, message: error || 'Failed to update profile' }
    }
  }

return {
    user,
    loading: loading || reduxLoading, // combine both
    isAuthenticated,
    sendOTP,
    verifyOTP,
    signUp,
    signIn,
    signOut,
    updateProfile: updateProfileInfo,
  };
};