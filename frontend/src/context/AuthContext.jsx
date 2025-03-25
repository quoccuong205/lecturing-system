import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get base API URL from environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Check if user data exists
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          
          if (userData && userData.username) {
            setUser(userData);
            setIsAuthenticated(true);
            
            // Set axios default headers
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          } else {
            // Clear invalid data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      });
      
      const { token } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      
      // Extract user info
      try {
        // Decode payload from JWT token
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        
        const userData = {
          id: payload.id,
          username: payload.username,
          role: payload.role
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        
        // Set axios default headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return { success: true };
      } catch (error) {
        console.error('Error decoding token:', error);
        return { success: false, message: 'Error processing login response' };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      await axios.post(`${API_URL}/auth/register`, userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear the authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    // Give a slight delay to ensure state updates before any navigation
    return new Promise(resolve => setTimeout(resolve, 100));
  };

  const updateProfile = async (userData) => {
    try {
      const response = await axios.put(`${API_URL}/users/profile`, userData);
      
      const updatedUser = {
        ...user,
        ...userData
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Update failed'
      };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
