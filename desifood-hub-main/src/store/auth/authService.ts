import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Request OTP
const requestOtp = async (email: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/request-otp`,
      { email },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again!";
    return Promise.reject(errorMessage);
  }
};

// Verify OTP
const verifyOtp = async (email: string, code: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/verify-otp`,
      { email, code },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again!";
    return Promise.reject(errorMessage);
  }
};

// Update profile
const updateProfile = async (id: string, profileData: any) => {
  try {
    const response = await axios.put(
      `${API_URL}/auth/profile/${id}`,
      profileData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again!";
    return Promise.reject(errorMessage);
  }
};
const getSingleUser = async (id: string, ) => {
  try {
    const response = await axios.get(
      `${API_URL}/auth/userData/${id}`,
      
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again!";
    return Promise.reject(errorMessage);
  }
};

const authService = {
  requestOtp,
  verifyOtp,
  updateProfile,
  getSingleUser
};

export default authService;