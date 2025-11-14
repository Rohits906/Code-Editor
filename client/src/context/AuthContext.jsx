import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock user data for demo
  const mockUser = {
    _id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: import.meta.env.VITE_LOGIN_EMAIL,
    name: 'Admin User'
  };

  // Mock token (just for localStorage consistency)
  const mockToken = 'mock_jwt_token_12345';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation - accept only demo credentials
      if (email === import.meta.env.VITE_LOGIN_EMAIL && password === import.meta.env.VITE_LOGIN_PASSWORD) {
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setIsAuthenticated(true);
        setUser(mockUser);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: 'Invalid email or password.' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  };

  const register = async (firstName, lastName, email, password) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock registration - always succeed for demo
      const newUser = {
        _id: Date.now().toString(),
        firstName,
        lastName,
        email,
        name: `${firstName} ${lastName}`
      };

      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setIsAuthenticated(true);
      setUser(newUser);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (!token || !savedUser) {
        return { success: false, error: 'No user data found' };
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userData = JSON.parse(savedUser);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Get current user error:', error);
      return { success: false, error: 'Failed to get user data' };
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
    getCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};