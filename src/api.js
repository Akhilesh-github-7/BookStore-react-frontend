import axios from 'axios';

export const BASE_URL = 'https://bookstore-backend-3ujv.onrender.com';

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

export const getMediaURL = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  
  // Normalize path: ensure it starts with / and remove redundant public/ prefix if present
  let normalizedPath = url.startsWith('/') ? url : `/${url}`;
  if (normalizedPath.startsWith('/public/')) {
    normalizedPath = normalizedPath.replace('/public/', '/');
  }
  
  return `${BASE_URL}${normalizedPath}`;
};

API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export default API;
