import axios from "axios";

const API_URL = "http://localhost:5000/api"; 

export const getAccessToken = () => localStorage.getItem("access_token");

export const saveToken = (token) => {
  if (token) localStorage.setItem("access_token", token);
};

export const logoutUser = () => {
  localStorage.clear();
  window.location.href = "/login";
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});


api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logoutUser();
    }
    return Promise.reject(error);
  }
);

export default api;