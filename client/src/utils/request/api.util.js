import { axiosJSON, axiosMultipart } from "./axiosInstance";

const api = {
  get: (url, params = {}) => axiosJSON.get(url, { params }),

  post: (url, data = {}) => axiosJSON.post(url, data),

  put: (url, data = {}) => axiosJSON.put(url, data),

  delete: (url, params = {}) => axiosJSON.delete(url, { params }),

  postMultipart: (url, formData) => axiosMultipart.post(url, formData),

  putMultipart: (url, formData) => axiosMultipart.put(url, formData),
};

export default api;
