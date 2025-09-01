import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

let createProduct = async (formData) => {
  try {
    const axiosResponse = await axios.post(`${API_URL}/product/create`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return axiosResponse.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again!";
    return Promise.reject(errorMessage);
  }
};

let getAllProducts = async () => {
  try {
    const axiosResponse = await axios.get(`${API_URL}/product/all`, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return axiosResponse.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again!";
    return Promise.reject(errorMessage);
  }
};

let getSingleProduct = async (id) => {
  try {
    const axiosResponse = await axios.get(`${API_URL}/product/single/${id}`, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return axiosResponse.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again!";
    return Promise.reject(errorMessage);
  }
};

let updateProduct = async (id, formData) => {
  try {
    const axiosResponse = await axios.put(`${API_URL}/product/update/${id}`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return axiosResponse.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again!";
    return Promise.reject(errorMessage);
  }
};

let deleteProduct = async (id) => {
  try {
    const axiosResponse = await axios.delete(`${API_URL}/product/delete/${id}`, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return axiosResponse.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again!";
    return Promise.reject(errorMessage);
  }
};

let productService = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};

export default productService;
