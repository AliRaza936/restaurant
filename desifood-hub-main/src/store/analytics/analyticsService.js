import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const getSalesData = async (period = '30d') => {
  try {
    const res = await axios.get(`${API_URL}/analytics/sales?period=${period}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(message);
  }
};

const getDashboardStats = async () => {
  try {
    const res = await axios.get(`${API_URL}/analytics/dashboard`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(message);
  }
};

const getTopProducts = async (limit = 10) => {
  try {
    const res = await axios.get(`${API_URL}/analytics/products/top?limit=${limit}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(message);
  }
};

const getTopCategories = async (limit = 10) => {
  try {
    const res = await axios.get(`${API_URL}/analytics/categories/top?limit=${limit}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(message);
  }
};

const getOrderStats = async () => {
  try {
    const res = await axios.get(`${API_URL}/analytics/orders/stats`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(message);
  }
};

const analyticsService = {
  getSalesData,
  getDashboardStats,
  getTopProducts,
  getTopCategories,
  getOrderStats,
};

export default analyticsService;