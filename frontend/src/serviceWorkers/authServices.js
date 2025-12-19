import axios from "axios";
import api, { setAuthToken } from "./api";

const BASE_URL = `${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}/api/v1/auth`;

export const registerSuperUser = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/register-superadmin`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (err) {
    return { error: true, message: err.response?.data || "Register failed" };
  }
};


export const loginUser = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // set token for default api
    if (response?.data?.token) setAuthToken(response.data.token);
    return response;
  } catch (err) {
    return { error: true, message: err.response?.data || "Login failed" };
  }
};

export const me = async () => {
  try {
    const response = await api.get('/users/me');
    return response;
  } catch (err) {
    return { error: true, message: err.response?.data || 'Failed to fetch current user' };
  }
};

export const forgotPassword = async (payload) => {
  try {
    const response = await api.post('/auth/forgot-password', payload);
    return response;
  } catch (err) {
    return { error: true, message: err.response?.data || 'Failed to send temporary password' };
  }
};

export const changePassword = async (payload) => {
  try {
    const response = await api.post('/auth/change-password', payload);
    return response;
  } catch (err) {
    return { error: true, message: err.response?.data || 'Failed to change password' };
  }
};
