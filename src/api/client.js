import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
client.interceptors.request.use(
  (config) => {
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

// Response interceptor for handling errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (credentials) => client.post('/auth/login', credentials),
  register: (userData) => client.post('/auth/register', userData),
  getProfile: () => client.get('/auth/me'),
  updateProfile: (data) => client.put('/auth/update-profile', data),
};

export const cars = {
  getAll: (filters) => client.get('/cars', { params: filters }),
  getById: (id) => client.get(`/cars/${id}`),
  addRating: (id, data) => client.post(`/cars/${id}/ratings`, data),
};

export const bookings = {
  create: (data) => client.post('/bookings', data),
  getMyBookings: () => client.get('/bookings/my-bookings'),
  getById: (id) => client.get(`/bookings/${id}`),
  updateStatus: (id, status) => client.patch(`/bookings/${id}/status`, { status }),
};

export const payments = {
  initialize: (data) => client.post('/payments/initialize', data),
  process: (id, data) => client.post(`/payments/process/${id}`, data),
  getById: (id) => client.get(`/payments/${id}`),
  getHistory: () => client.get('/payments'),
};

export default client;