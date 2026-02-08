import axios from 'axios';

export const BASE_URL = 'https://bookstore-backend-3ujv.onrender.com';

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

export const getMediaURL = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  
  // For legacy local paths, prepend BASE_URL
  // Ensure path starts with /
  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  
  // Handle public/ prefix if it exists in legacy paths
  const cleanPath = normalizedPath.startsWith('/public/') 
    ? normalizedPath.replace('/public/', '/') 
    : normalizedPath;
    
  return `${BASE_URL}${cleanPath}`;
};

API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export default API;
