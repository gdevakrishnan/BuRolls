import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BASE_URL}/api/v1/auth`;

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
    return response;
  } catch (err) {
    return { error: true, message: err.response?.data || "Login failed" };
  }
};
