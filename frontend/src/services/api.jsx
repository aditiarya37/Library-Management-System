import axios from "axios";

const API_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
};

export const bookAPI = {
  getAll: () => api.get("/books"),
  create: (data) => api.post("/books", data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
};

export const borrowAPI = {
  borrow: (bookId) => api.post(`/borrow/${bookId}`),
  return: (recordId) => api.post(`/borrow/return/${recordId}`),
  getUserHistory: () => api.get("/borrow/history"),
  getAllRecords: () => api.get("/borrow/all"),
};

export default api;
