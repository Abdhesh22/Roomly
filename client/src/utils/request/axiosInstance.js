import axios from "axios";

// 🔧 Shared config values
const BASE_URL = "/";
const TIMEOUT = 10000;

// 🔐 Auth + Error Interceptors
const applyInterceptors = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/";
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// 📦 For JSON APIs
const axiosJSON = applyInterceptors(
  axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    headers: {
      "Content-Type": "application/json",
    },
  })
);

// 📁 For FormData/file upload (Content-Type set automatically)
const axiosMultipart = applyInterceptors(
  axios.create({
    baseURL: BASE_URL,
    timeout: 100000,
  })
);

export { axiosJSON, axiosMultipart };
