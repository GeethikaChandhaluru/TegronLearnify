import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('tn_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Let browser set Content-Type for FormData automatically
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Auth
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const resetPassword = (token, data) => API.put(`/auth/reset-password/${token}`, data);

// Books
export const getAllBooks = () => API.get('/books');
export const getBook = (id) => API.get(`/books/${id}`);
export const addBook = (formData) => API.post('/books', formData);
export const updateBook = (id, formData) => API.put(`/books/${id}`, formData);
export const deleteBook = (id) => API.delete(`/books/${id}`);

// Cart
export const getCart = () => API.get('/cart');
export const addToCart = (id) => API.post(`/cart/${id}`);
export const removeFromCart = (id) => API.delete(`/cart/${id}`);
export const clearCart = () => API.delete('/cart');

// Orders
export const buyNow = (id) => API.post(`/orders/buy-now/${id}`);
export const checkoutCart = () => API.post('/orders/checkout');
export const getMyOrders = () => API.get('/orders');
export const getPurchasedBooks = () => API.get('/orders/purchased');

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = () => API.get('/admin/users');
export const getAdminOrders = () => API.get('/admin/orders');
export const getAdminPurchased = () => API.get('/admin/purchased');

export const getAdminPayments = () => API.get('/admin/payments');