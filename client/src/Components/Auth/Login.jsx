import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Code, Eye, EyeOff, Github, Chrome, Mail, Lock, ArrowRight, Sparkles, Zap, Users, Folder } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { login } = useAuth();
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
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        console.log('✅ Login successful! Redirecting to dashboard...');
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const features = [
    { icon: <Zap className="w-3 h-3 md:w-4 md:h-4" />, text: "Access 10+ languages", color: "text-yellow-400" },
    { icon: <Users className="w-3 h-3 md:w-4 md:h-4" />, text: "Real-time collaboration", color: "text-blue-400" },
    { icon: <Folder className="w-3 h-3 md:w-4 md:h-4" />, text: "Cloud storage", color: "text-purple-400" }
  ];

  const stats = [
    { value: "10+", label: "Languages", color: "text-cyan-400", icon: <Code className="w-3 h-3 md:w-4 md:h-4" /> },
    { value: "200+", label: "Developers", color: "text-emerald-400", icon: <Users className="w-3 h-3 md:w-4 md:h-4" /> },
    { value: "100+", label: "Projects", color: "text-purple-400", icon: <Folder className="w-3 h-3 md:w-4 md:h-4" /> }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 -left-10 w-60 h-60 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 -right-10 w-60 h-60 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-10 w-60 h-60 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <div className="w-full max-w-6xl max-h-[90vh]">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center h-full"
          >
            
            {/* Left Side - Branding & Info */}
            <motion.div variants={itemVariants} className="space-y-4 md:space-y-6">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 md:space-x-3"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-75"></div>
                  <img src="/assests/codeflow_icon.png" alt="CodeFlow Icon" className="relative w-8 h-8 md:w-10 md:h-10" />
                </div>
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  CodeFlow
                </span>
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-amber-400" />
              </motion.div>

              <div className="space-y-3 md:space-y-4">
                <motion.h1 
                  variants={itemVariants}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
                >
                  Welcome Back
                  <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Developer
                  </span>
                </motion.h1>
                <motion.p 
                  variants={itemVariants}
                  className="text-sm md:text-base lg:text-lg text-gray-300 leading-relaxed"
                >
                  Sign in to access your projects and continue coding.
                </motion.p>
              </div>

              {/* Features List */}
              <motion.div variants={itemVariants} className="space-y-2 md:space-y-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-2 text-gray-300"
                  >
                    <div className={`p-1.5 md:p-2 rounded-lg bg-gray-800/50 ${feature.color}`}>
                      {feature.icon}
                    </div>
                    <span className="text-xs md:text-sm">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Stats */}
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-3 gap-2 md:gap-3 pt-4 md:pt-6 border-t border-gray-800/30"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-2 md:p-3 rounded-xl bg-gray-800/20 backdrop-blur-sm border border-gray-700/30"
                  >
                    <div className="flex items-center justify-center space-x-1 md:space-x-2 mb-1">
                      <div className={`${stat.color}`}>
                        {stat.icon}
                      </div>
                      <div className={`text-base md:text-xl font-bold ${stat.color}`}>{stat.value}</div>
                    </div>
                    <div className="text-gray-400 text-xs">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Side - Login Form */}
            <motion.div variants={itemVariants} className="relative">
              <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 border border-gray-700/50 shadow-2xl">
                <div className="text-center mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">
                    Sign In
                  </h2>
                  <p className="text-gray-400 text-xs md:text-sm">
                    Enter your credentials
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 md:p-3 mb-3 md:mb-4"
                  >
                    <p className="text-red-400 text-xs text-center">{error}</p>
                  </motion.div>
                )}

                {/* Social Login Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mb-4 md:mb-6">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="flex-1 flex items-center justify-center space-x-1 md:space-x-2 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 border border-gray-700 rounded-lg md:rounded-xl py-2 md:py-3 px-3 transition-all duration-300 hover:border-blue-500/50 text-xs md:text-sm"
                  >
                    <Chrome className="w-3 h-3 md:w-4 md:h-4" />
                    <span>Google</span>
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="flex-1 flex items-center justify-center space-x-1 md:space-x-2 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 border border-gray-700 rounded-lg md:rounded-xl py-2 md:py-3 px-3 transition-all duration-300 hover:border-purple-500/50 text-xs md:text-sm"
                  >
                    <Github className="w-3 h-3 md:w-4 md:h-4" />
                    <span>GitHub</span>
                  </motion.button>
                </div>

                {/* Divider */}
                <div className="flex items-center mb-4 md:mb-6">
                  <div className="flex-1 border-t border-gray-700/30"></div>
                  <span className="px-2 md:px-3 text-gray-400 text-xs">OR</span>
                  <div className="flex-1 border-t border-gray-700/30"></div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                  {/* Email Field */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-300">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 md:w-4 md:h-4" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg md:rounded-xl pl-8 md:pl-10 pr-3 py-2 md:py-3 text-sm focus:outline-none focus:border-blue-500 transition-all duration-300"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-300">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 md:w-4 md:h-4" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg md:rounded-xl pl-8 md:pl-10 pr-8 md:pr-10 py-2 md:py-3 text-sm focus:outline-none focus:border-blue-500 transition-all duration-300"
                        placeholder="Enter password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-0.5"
                      >
                        {showPassword ? <EyeOff className="w-3 h-3 md:w-4 md:h-4" /> : <Eye className="w-3 h-3 md:w-4 md:h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-1 md:space-x-2">
                      <input 
                        type="checkbox" 
                        className="w-3 h-3 bg-gray-800/50 border-gray-700 rounded focus:ring-blue-500 focus:ring-1 focus:ring-offset-1 focus:ring-offset-gray-900" 
                      />
                      <span className="text-xs text-gray-300">Remember me</span>
                    </label>
                    <Link to="/forgot-password">
                      <button type="button" className="text-xs text-blue-500 hover:text-blue-400 transition-colors">
                        Forgot password?
                      </button>
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 md:py-3 px-4 rounded-lg md:rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    {loading ? (
                      <>
                        <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Register Link */}
                <div className="text-center mt-4 md:mt-6 pt-4 border-t border-gray-700/30">
                  <p className="text-gray-400 text-xs md:text-sm">
                    Don't have an account?{' '}
                    <Link 
                      to="/register"
                      className="text-blue-500 hover:text-blue-400 font-semibold transition-colors flex items-center justify-center space-x-1 mx-auto"
                    >
                      <span>Create account</span>
                      <ArrowRight className="w-2 h-2 md:w-3 md:h-3" />
                    </Link>
                  </p>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-2 -right-2 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-2 -left-2 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;