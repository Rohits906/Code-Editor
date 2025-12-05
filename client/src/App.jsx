import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/Home.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Dashboard from './Components/Dashboard.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import Login from './Components/Auth/Login.jsx';
import Register from './Components/Auth/Register.jsx';
import Layout from './Layout/layout.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

const App = () => {
  return (
    <ThemeProvider>
       <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Add other protected routes here */}
            </Route>
          </Routes>
       </AuthProvider>
    </ThemeProvider>
  );
}

export default App;