import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:1430',
});

// Add a request interceptor to include the JWT token in the Authorization header
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;
