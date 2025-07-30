import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gym-related API calls
export const fetchGyms = () => API.get('/gyms');
export const fetchGymDetails = (id) => API.get(`/gyms/${id}`);

// Booking-related API calls
export const createBooking = (bookingData) => API.post('/bookings', bookingData);
export const getUserBookings = () => API.get('/bookings/my-bookings');

// Auth-related API calls
export const register = (userData) => API.post('/auth/register', userData);
export const login = (credentials) => API.post('/auth/login', credentials);

export default API;