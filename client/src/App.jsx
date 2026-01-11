import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/Home.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Dashboard from './Components/Dashboard.jsx';
import Projects from './Components/Projects.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import Login from './Auth/Login.jsx';
import Register from './Auth/Register.jsx';
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
              <Route path="/projects" element={<Projects />} />
              {/* Add other protected routes here */}
            </Route>
          </Routes>
       </AuthProvider>
    </ThemeProvider>
  );
}

export default App;