import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import API from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < new Date().getTime()) {
          logout();
        } else {
          setUser(decodedToken);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        logout();
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await API.post('/auth/login', { email, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(jwtDecode(response.data.token));
        return { success: true };
      } else {
        return { success: false, message: 'Login failed: No token received.' };
      }
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'An error occurred during login.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await API.post('/auth/register', { username, email, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(jwtDecode(response.data.token));
        return { success: true };
      } else {
        return { success: false, message: 'Registration failed: No token received.' };
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'An error occurred during registration.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    window.location.href = '/login'; // Redirect to login page after logout
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const response = await API.put('/auth/profile', profileData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(jwtDecode(response.data.token));
        return { success: true };
      } else {
        // If backend doesn't return a new token, but returns updated user data
        setUser(prevUser => ({ ...prevUser, ...profileData }));
        return { success: true };
      }
    } catch (error) {
      console.error('Update profile error:', error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'Failed to update profile.' };
    } finally {
      setLoading(false);
    }
  };

  const updateProfileImage = async (imageFile) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('profileImage', imageFile);

      const response = await API.post('/auth/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(jwtDecode(response.data.token));
        return { success: true };
      } else {
        // If backend doesn't return a new token, but returns updated user data
        setUser(prevUser => ({ ...prevUser, profileImage: response.data.profileImage }));
        return { success: true };
      }
    } catch (error) {
      console.error('Update profile image error:', error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'Failed to update profile image.' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, updateProfileImage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
