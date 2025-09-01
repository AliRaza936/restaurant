import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
let createCat = async (inputs:any) => {
  try {
    let axiosResponce = await axios.post(`${API_URL}/category/create`,inputs, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return axiosResponce.data;
  } catch (error) {
    let errorMessage =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again!";
   
    return Promise.reject(errorMessage);
  }
};
let getAllCat = async () => {
  try {
    let axiosResponce = await axios.get(`${API_URL}/category/all`, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return axiosResponce.data;
  } catch (error) {
    let errorMessage =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again!";
   
    return Promise.reject(errorMessage);
  }
};
let deleteCat = async (id) => {
  try {
    let axiosResponce = await axios.delete(`${API_URL}/category/delete/${id}`, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return axiosResponce.data;
  } catch (error) {
    let errorMessage =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again!";
   
    return Promise.reject(errorMessage);
  }
};
let updateCat = async ({id,name}) => {
  try {
    let axiosResponce = await axios.put(`${API_URL}/category/update/${id}`, {name},{
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return axiosResponce.data;
  } catch (error) {
    let errorMessage =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again!";
   
    return Promise.reject(errorMessage);
  }
};


let catService = {
  createCat,
  getAllCat,
  deleteCat,updateCat
 
};

export default catService;
