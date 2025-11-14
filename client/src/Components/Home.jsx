import React, { useState } from 'react';
import { Code, Shield, Zap, Github, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Blazing fast code compilation and execution"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure",
      description: "Your code is safe and secure in our environment"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Multi-language",
      description: "Support for 50+ programming languages"
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Code className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              CodeFlow
            </span>
          </div>
          <div className="flex space-x-4">
            <Link to="/login" className="px-6 py-2 rounded-lg border border-gray-600 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
              Login
            </Link>
            <button 
              onClick={() => setIsRegisterOpen(true)}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
            >
              Register Now
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Code, Compile & 
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"> Collaborate</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                The ultimate online code editor with real-time collaboration, 
                multi-language support, and powerful debugging tools.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setIsRegisterOpen(true)}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 flex items-center justify-center space-x-2"
              >
                <Star className="w-5 h-5" />
                <span>Start Coding Free</span>
              </button>
              <button className="px-8 py-4 rounded-xl border border-gray-600 hover:border-blue-500 text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 flex items-center justify-center space-x-2">
                <Github className="w-5 h-5" />
                <span>View on GitHub</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">50+</div>
                <div className="text-gray-400">Languages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">10K+</div>
                <div className="text-gray-400">Developers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">1M+</div>
                <div className="text-gray-400">Projects</div>
              </div>
            </div>
          </div>

          {/* Right Content - Code Preview */}
          <div className="relative">
            <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
              <div className="flex space-x-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="font-mono text-sm">
                <div className="text-gray-400">// Welcome to CodeFlow</div>
                <div className="text-gray-400 mt-2">function <span className="text-blue-400">helloWorld</span>() {'{'}</div>
                <div className="text-green-400 ml-4">console.<span className="text-yellow-400">log</span>(<span className="text-orange-400">'Hello, Developer!'</span>);</div>
                <div className="text-gray-400">{'}'}</div>
                <div className="mt-4 text-gray-400">// Start coding now...</div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">CodeFlow</span>?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Built for developers, by developers. Experience the future of online coding.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:-translate-y-2"
            >
              <div className="text-blue-500 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Register Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Join CodeFlow</h3>
              <button 
                onClick={() => setIsRegisterOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input 
                  type="password" 
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  placeholder="Create a password"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-800 mt-16">
        <div className="text-center text-gray-400">
          <p>© 2025 CodeFlow. Built with ❤️ for developers worldwide.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;