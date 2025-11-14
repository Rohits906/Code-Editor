import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Code, LogOut, Settings, User, FileCode, Share2 } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Code className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                CodeFlow
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <User className="w-5 h-5" />
                <span>Welcome, {user?.firstName || user?.name || 'User'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-600 hover:border-red-500 hover:text-red-400 transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              CodeFlow Editor
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your powerful online code editor with real-time collaboration, multiple language support, and cloud storage.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <FileCode className="w-8 h-8 text-blue-500" />
              <h3 className="text-xl font-semibold">New Project</h3>
            </div>
            <p className="text-gray-400">Start a new coding project with your favorite language</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="w-8 h-8 text-green-500" />
              <h3 className="text-xl font-semibold">My Projects</h3>
            </div>
            <p className="text-gray-400">Access and manage your existing projects</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <Share2 className="w-8 h-8 text-purple-500" />
              <h3 className="text-xl font-semibold">Collaborate</h3>
            </div>
            <p className="text-gray-400">Invite team members and code together in real-time</p>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 mb-8">
          <h3 className="text-xl font-semibold mb-4">User Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">Name</p>
              <p className="text-white">{user?.firstName} {user?.lastName}</p>
            </div>
            <div>
              <p className="text-gray-400">Email</p>
              <p className="text-white">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Code Editor Preview */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex space-x-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="font-mono text-sm">
            <div className="text-gray-400">// Welcome to CodeFlow Editor</div>
            <div className="text-gray-400 mt-4">function <span className="text-blue-400">quickStart</span>() {'{'}</div>
            <div className="text-green-400 ml-4">console.<span className="text-yellow-400">log</span>(<span className="text-orange-400">'Hello, {user?.firstName || 'User'}!'</span>);</div>
            <div className="text-gray-400">{'}'}</div>
            <div className="text-gray-400 mt-4"><span className="text-blue-400">quickStart</span>();</div>
            <div className="text-gray-400 mt-4">// Output: "Hello, {user?.firstName || 'User'}!"</div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Recent Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['React App', 'Node.js API', 'Python Script', 'HTML Website', 'CSS Framework', 'JavaScript Game'].map((project, index) => (
              <div key={index} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-center space-x-2 mb-2">
                  <FileCode className="w-4 h-4 text-blue-500" />
                  <h3 className="font-semibold">{project}</h3>
                </div>
                <p className="text-gray-400 text-sm">Last modified: Today</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;