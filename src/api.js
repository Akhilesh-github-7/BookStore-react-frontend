import axios from 'axios';

const API = axios.create({
  baseURL: 'https://bookstore-backend-3ujv.onrender.com/api', // Backend URL
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export default API;
