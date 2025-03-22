import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location = '/auth';
    }
    return Promise.reject(error);
  }
);

export const bookingAPI = {
  bookRide: (data) => api.post('/booking/book', data),
  getSuggestions: (data) => api.post('/booking/suggest', data),
  getHistory: (studentId) => api.get(`/booking/history/${studentId}`),
  getFrequentRoutes: (studentId) => api.get(`/booking/frequent_routes/${studentId}`),
  getExpenseReport: (studentId) => api.get(`/booking/expense_report/${studentId}`),
};

export default api;