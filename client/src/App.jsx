import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import Login from "./Components/Auth/Login.jsx";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;
