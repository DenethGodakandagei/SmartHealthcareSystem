import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Add a request interceptor to include token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // adjust key if needed
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
