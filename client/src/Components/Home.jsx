import React, { useState, useEffect } from "react";
import {
  Code,
  Shield,
  Zap,
  Github,
  Star,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Globe,
  Users,
  Cpu,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description:
        "Blazing fast code compilation and execution with near-zero latency",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Sandbox",
      description:
        "Isolated execution environment with enterprise-grade security",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "10+ Languages",
      description:
        "From Python to JavaScript, with real-time syntax highlighting",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Live Collaboration",
      description: "Real-time pair programming with multiple cursors",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "AI Assistant",
      description: "Built-in AI code completion and debugging",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Access",
      description: "Access your projects from anywhere in the world",
      gradient: "from-indigo-500 to-blue-500",
    },
  ];

  const stats = [
    { value: "10+", label: "Languages", color: "text-cyan-400" },
    { value: "200+", label: "Developers", color: "text-emerald-400" },
    { value: "100+", label: "Projects", color: "text-purple-400" },
    { value: "24/7", label: "Uptime", color: "text-amber-400" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const codeLines = [
    { text: "// Welcome to CodeFlow", color: "text-cyan-400" },
    { text: "function greetDeveloper() {", color: "text-gray-400" },
    { text: "  const message = '🚀 Ready to code?';", color: "text-white" },
    { text: "  console.log(message);", color: "text-emerald-400" },
    { text: "  return <CodeFlow />;", color: "text-amber-400" },
    { text: "}", color: "text-gray-400" },
    { text: "// Start your journey...", color: "text-cyan-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gray-900/90 backdrop-blur-lg border-b border-gray-800"
            : ""
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <img
                src="/assests/codeflow_logo.png"
                alt="CodeFlow Logo"
                className="w-6 h-6"
              />
            </motion.div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-4"
              >
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    Sign In
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobile && isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-800"
            >
              <div className="container mx-auto px-4 py-6 space-y-3">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors"
                  >
                    Sign In
                  </motion.button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                  >
                    Start Free Trial
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <main className="relative z-10 pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left Content */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-gray-300">
                  The Future of Online Coding
                </span>
              </div>

              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-7xl font-bold leading-tight"
              >
                Code, Compile &{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                  Collaborate
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-300 leading-relaxed"
              >
                The ultimate cloud development environment with real-time
                collaboration, AI-powered assistance, and seamless deployment.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/40 flex items-center justify-center space-x-3 w-full sm:w-auto"
                  >
                    <Star className="w-6 h-6" />
                    <span>Start Coding Free</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>

                <a
                  href="https://github.com/Rohits906/Code-Editor"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-500 text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 flex items-center justify-center space-x-3 w-full sm:w-auto"
                  >
                    <Github className="w-6 h-6" />
                    <span>Star on GitHub</span>
                  </motion.button>
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50"
                  >
                    <div
                      className={`text-2xl md:text-3xl font-bold ${stat.color}`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm mt-1">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Code Preview */}
            <motion.div variants={itemVariants} className="relative">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative bg-gray-900/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-gray-700/50 shadow-2xl overflow-hidden"
              >
                {/* Animated gradient border */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl"></div>

                {/* Window controls */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm text-gray-400">main.js</div>
                </div>

                {/* Code editor */}
                <div className="font-mono text-xs md:text-sm space-y-1">
                  {codeLines.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`flex items-start ${line.color}`}
                    >
                      <span className="text-gray-500 w-6 md:w-8 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="truncate">{line.text}</span>
                      {index === 3 && (
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="ml-2 h-4 md:h-5 w-[2px] bg-white"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Terminal */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 p-3 md:p-4 bg-black/50 rounded-xl border border-gray-800"
                >
                  <div className="text-green-400 text-sm">$ npm start</div>
                  <div className="text-white text-sm mt-1">
                    🚀 Server running on port 3000
                  </div>
                  <div className="text-cyan-400 text-sm mt-1">
                    ✨ CodeFlow ready!
                  </div>
                </motion.div>

                {/* Floating elements */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-3 -right-3 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
                />
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                    rotate: [0, -5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute -bottom-3 -left-3 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        id="features"
        className="relative z-10 py-16 md:py-20"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 mb-4">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-gray-300">Powerful Features</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Everything you need{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                to code better
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Professional tools designed for modern developers
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gray-900/30 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-gray-700/50 hover:border-transparent transition-all duration-300 h-full">
                  <div
                    className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base">
                    {feature.description}
                  </p>
                  <motion.div
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    className="h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-50 mt-4"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative z-10 py-16 md:py-20"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
            <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-gray-700/50">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Ready to start{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    coding today?
                  </span>
                </h2>
                <p className="text-gray-300 text-base md:text-lg mb-8">
                  Join 200+ developers building amazing projects with CodeFlow
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 md:px-8 py-3 md:py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-base md:text-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/40"
                    >
                      Start Free Trial
                    </motion.button>
                  </Link>
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 md:px-8 py-3 md:py-4 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-500 text-base md:text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      Sign In
                    </motion.button>
                  </Link>
                </div>
                <p className="text-gray-400 text-sm mt-6">
                  No credit card required • Free forever plan available
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative z-10 pt-12 pb-8 border-t border-gray-800/50"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-75"></div>
                <img
                  src="/assests/codeflow_logo.png"
                  alt="CodeFlow Logo"
                  className="relative w-6 h-6"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                CodeFlow
              </span>
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                The cloud development environment of the future
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-800/50 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 CodeFlow. Built with ❤️ for developers worldwide.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;
