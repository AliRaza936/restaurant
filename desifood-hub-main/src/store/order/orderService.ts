import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const createOrder = async (payload) => {
  try {
    const res = await axios.post(`${API_URL}/order/create`, payload, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(message);
  }
};

const getAllOrders = async () => {
  try {
    const res = await axios.get(`${API_URL}/order/all`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(message);
  }
};

const getOrderById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/order/single/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(message);
  }
};

const updateOrderStatus = async ({ id, status, paymentMethod }) => {
  try {
    const res = await axios.put(`${API_URL}/order/update/${id}`, { status, paymentMethod }, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(message);
  }
};

const deleteOrder = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/order/delete/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(message);
  }
};
const userOrder = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/order/userOrder/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(message);
  }
};

const orderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  userOrder
};

export default orderService;
