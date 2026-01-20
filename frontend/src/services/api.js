import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add Telegram Init Data if available
api.interceptors.request.use((config) => {
  const tgData = window.Telegram?.WebApp?.initData;
  if (tgData) {
    config.headers['X-Telegram-Init-Data'] = tgData;
  }
  
  // For Admin (dev only for now, or stored in local storage)
  const adminSecret = localStorage.getItem('adminSecret');
  if (adminSecret) {
    config.headers['X-Admin-Secret'] = adminSecret;
  }
  
  return config;
});

export const productsApi = {
  getAll: () => api.get('/api/products').then(res => res.data),
  getById: (id) => api.get(`/api/products/${id}`).then(res => res.data),
};

export const ordersApi = {
  create: (data) => api.post('/api/orders', data).then(res => res.data),
  getById: (id) => api.get(`/api/orders/${id}`).then(res => res.data),
  getMyOrders: () => api.get('/api/orders').then(res => res.data), // TODO: Filter by user
};

export const adminApi = {
  getVerifications: () => api.get('/api/admin/h2h/verifications').then(res => res.data),
  getOrders: (day) => api.get(`/api/admin/h2h/orders?day=${day || 'today'}`).then(res => res.data),
  updateStatus: (id, status) => api.patch(`/api/admin/h2h/orders/${id}/status`, { status }).then(res => res.data),
  updateVerification: (id, status) => api.patch(`/api/admin/h2h/orders/${id}/verification`, { verificationStatus: status }).then(res => res.data),
};

export default api;
