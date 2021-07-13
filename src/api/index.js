import axios from "axios";

const jwt = localStorage.getItem("token");

const api = axios.create({
  baseURL: "http://localhost:4000",

  headers: {
    "content-type": "application/json",
    Authorization: "Bearer " + jwt,
  },
});

const upload = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "content-type": "multipart/form-data",
  },
});

// Auth
export const me = async () => {
  return await api.get(`/auth/me`);
};

export const postLogin = async (data) => {
  return await api.post(`/auth/login`, data);
};

export const postSignup = async (data) => {
  return await api.post(`/auth/signup`, data);
};

export const postGoogleLogin = async (data) => {
  return await api.post(`/auth/google`, data);
};

export const postFacebookLogin = async (data) => {
  return await api.post(`/auth/facebook`, data);
};

export const putUser = async (id, data) => {
  return await api.put(`/auth/${id}`, data);
};

// change-password
export const postChangePassword = async (data) => {
  return await api.post(`/auth/change-password`, data);
};

// forgot-password
export const getOtp = async (data) => {
  return await api.post(`/auth/forgot-password/get-otp`, data);
};

export const verifyOtp = async (data) => {
  return await api.post(`/auth/forgot-password/verify-otp`, data);
};

export const postForgotPassword = async (data) => {
  return await api.post(`/auth/forgot-password/create-new-password`, data);
};

// Payments
export const postStripe = async (data) => {
  return await api.post(`/payment/stripe`, data);
};

// Upload File
export const uploadImage = async (data) => {
  return await upload.post(`/upload/images`, data);
};

export const uploadVideo = async (data) => {
  return await upload.post(`/upload/videos`, data);
};

export const uploadPDF = async (data) => {
  return await upload.post(`/upload/pdf`, data);
};
