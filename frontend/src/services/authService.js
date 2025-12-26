import api from './api';

export const loginUser = async (data) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};


export const signupUser = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await api.post('/auth/forgot-password', data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post('/auth/reset-password', data);
  return response.data;
};

export const googleLogin = async (data) => {
  const response = await api.post('/auth/google-login', data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const verifyOtp = async (data) => {
  const response = await api.post('/auth/verify-otp', data);
  return response.data;
};
