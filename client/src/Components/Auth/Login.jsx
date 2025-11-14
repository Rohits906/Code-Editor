import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Code, Eye, EyeOff, Github, Chrome, Mail, Lock, ArrowRight, User, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          console.log('Login successful, navigating to dashboard...');
          navigate('/dashboard');
        } else {
          setError(result.error);
        }
      } else {
        const result = await register(
          formData.firstName, 
          formData.lastName, 
          formData.email, 
          formData.password
        );
        
        if (result.success) {
          console.log('Registration successful, navigating to dashboard...');
          navigate('/dashboard');
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center py-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Branding & Info */}
        <div className="space-y-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Code className="w-8 h-8" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              CodeFlow
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              {isLogin ? 'Welcome Back to' : 'Join'} 
              <span className="block bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {isLogin ? 'Your Workspace' : 'CodeFlow'}
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              {isLogin 
                ? 'Sign in to access your projects, collaborate with your team, and continue your coding journey.'
                : 'Create your account to start coding, collaborate with developers worldwide, and bring your ideas to life.'
              }
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Access 50+ programming languages</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Real-time collaboration</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Cloud storage for your projects</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-800">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">50K+</div>
              <div className="text-gray-400 text-sm">Developers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">100K+</div>
              <div className="text-gray-400 text-sm">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">99.9%</div>
              <div className="text-gray-400 text-sm">Uptime</div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-gray-400">
              {isLogin ? 'Enter your credentials to continue' : 'Fill in your details to get started'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Social Login Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button 
              type="button"
              className="flex-1 flex items-center justify-center space-x-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-xl py-3 px-6 transition-all duration-300 hover:border-blue-500/50"
            >
              <Chrome className="w-5 h-5" />
              <span>Google</span>
            </button>
            <button 
              type="button"
              className="flex-1 flex items-center justify-center space-x-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-xl py-3 px-6 transition-all duration-300 hover:border-purple-500/50"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="px-4 text-gray-400 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields - Only show for registration */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-blue-500 transition-all duration-300"
                      placeholder="John"
                      required={!isLogin}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-blue-500 transition-all duration-300"
                      placeholder="Doe"
                      required={!isLogin}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-blue-500 transition-all duration-300"
                  placeholder="abc@gmail.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl pl-12 pr-12 py-4 focus:outline-none focus:border-blue-500 transition-all duration-300"
                  placeholder="********"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password - Only for login */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" />
                  <span className="text-sm text-gray-300">Remember me</span>
                </label>
                <button type="button" className="text-sm text-blue-500 hover:text-blue-400 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button - FIXED: Removed invalid navigate prop */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="text-center mt-8 pt-6 border-t border-gray-700">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={toggleAuthMode}
                className="text-blue-500 hover:text-blue-400 font-semibold transition-colors flex items-center justify-center space-x-1 mx-auto"
              >
                <span>{isLogin ? 'Create account' : 'Sign in'}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;