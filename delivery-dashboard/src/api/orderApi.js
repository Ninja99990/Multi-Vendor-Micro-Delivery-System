import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080/api',
});

// --- REQUEST INTERCEPTOR ---
api.interceptors.request.use(
  (config) => {
    // Basic Authentication (username/password)
    const username = import.meta.env.VITE_API_USERNAME || '';
    const password = import.meta.env.VITE_API_PASSWORD || '';
    
    if (username && password) {
      // Create Basic Auth header
      const credentials = btoa(`${username}:${password}`);
      config.headers.Authorization = `Basic ${credentials}`;
    }
    
    // Also check for Bearer token (for JWT if needed)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- RESPONSE INTERCEPTOR (Global Error Handling) ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logic for expired tokens: redirect to login
      console.error("Session expired. Redirecting...");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const orderApi = {
  placeOrder: async (payload) => {
    const response = await api.post('/orders/place', payload);
    return response.data;
  },
  getRiderLocations: async () => {
    const response = await api.get('/riders/locations');
    return response.data;
  },
  getAllOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  getOrderByOrderNumber: async (orderNumber) => {
    const response = await api.get(`/orders/order-number/${orderNumber}`);
    return response.data;
  },
  getOrdersByCustomerId: async (customerId) => {
    const response = await api.get(`/orders/customer/${customerId}`);
    return response.data;
  },
  updateOrderStatus: async (id, status, riderId = null) => {
    const response = await api.put(`/orders/${id}/status`, { status, riderId });
    return response.data;
  },
  assignRider: async (orderId, riderId) => {
    const response = await api.put(`/orders/${orderId}/assign-rider/${riderId}`);
    return response.data;
  },
};

// Named exports for direct import
export const placeOrder = orderApi.placeOrder;
export const getRiderLocations = orderApi.getRiderLocations;
export const getAllOrders = orderApi.getAllOrders;
export const getOrderById = orderApi.getOrderById;
export const updateOrderStatus = orderApi.updateOrderStatus;