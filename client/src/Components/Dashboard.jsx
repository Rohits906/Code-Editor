import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  Code, LogOut, Settings, User, FileCode, Share2, Plus, Trash2, Edit3,
  Activity, TrendingUp, Clock, Users2, Zap, Sparkles, Search, Bell,
  Copy, Play, Command, Filter, Star, Calendar, Target,
  Eye, Download, MessageCircle, GitBranch, Cpu, Rocket, LayoutTemplate
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [activity, setActivity] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    language: 'javascript',
    code: '// Start coding here...'
  });

  // Mock data for demonstration
  const mockAnalytics = {
    streak: 7,
    linesOfCode: 1250,
    activeProjects: 3,
    collaborationScore: 4.5,
    weeklyProgress: 75
  };

  const mockActivity = [
    { id: 1, type: 'edit', user: 'Alex Chen', project: 'Dashboard UI', time: '2 min ago', action: 'edited main.js' },
    { id: 2, type: 'create', user: 'You', project: 'API Integration', time: '5 min ago', action: 'created new project' },
    { id: 3, type: 'comment', user: 'Sarah Kim', project: 'Team Dashboard', time: '1 hour ago', action: 'commented on your code' },
    { id: 4, type: 'share', user: 'Mike Ross', project: 'Auth System', time: '2 hours ago', action: 'shared a project with you' }
  ];

  const mockLiveSessions = [
    { id: 1, name: 'Frontend Team', participants: 3, language: 'typescript', lastActivity: '5 min ago' },
    { id: 2, name: 'API Development', participants: 2, language: 'python', lastActivity: '15 min ago' }
  ];

  const mockTemplates = [
    { id: 1, name: 'React Dashboard', description: 'Modern React dashboard with charts', language: 'javascript', category: 'web', stars: 245 },
    { id: 2, name: 'Node.js API', description: 'REST API with Express and MongoDB', language: 'javascript', category: 'backend', stars: 189 },
    { id: 3, name: 'Python Data Analysis', description: 'Jupyter notebook for data science', language: 'python', category: 'data', stars: 156 },
    { id: 4, name: 'Mobile App UI', description: 'React Native starter template', language: 'javascript', category: 'mobile', stars: 203 }
  ];

  // Fetch user's projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockProjects = [
          {
            _id: '1',
            name: 'E-commerce Dashboard',
            description: 'Modern e-commerce analytics dashboard',
            language: 'javascript',
            lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            collaborators: 2,
            isLive: true
          },
          {
            _id: '2',
            name: 'API Server',
            description: 'Backend API with authentication',
            language: 'python',
            lastModified: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            collaborators: 1,
            isLive: false
          },
          {
            _id: '3',
            name: 'Mobile App UI',
            description: 'React Native mobile application',
            language: 'javascript',
            lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            collaborators: 0,
            isLive: true
          }
        ];
        setProjects(mockProjects);
        setAnalytics(mockAnalytics);
        setActivity(mockActivity);
        setLiveSessions(mockLiveSessions);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      setTimeout(() => {
        const newProj = {
          _id: Date.now().toString(),
          ...newProject,
          lastModified: new Date().toISOString(),
          collaborators: 0,
          isLive: false
        };
        setProjects(prev => [newProj, ...prev]);
        setShowCreateProject(false);
        setNewProject({
          name: '',
          description: '',
          language: 'javascript',
          code: '// Start coding here...'
        });
        toast.success('Project created successfully!');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Error creating project');
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      setProjects(prev => prev.filter(p => p._id !== projectId));
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Error deleting project');
    }
  };

  const handleDuplicateProject = async (projectId) => {
    try {
      const project = projects.find(p => p._id === projectId);
      const duplicatedProject = {
        ...project,
        _id: Date.now().toString(),
        name: `${project.name} (Copy)`,
        lastModified: new Date().toISOString()
      };
      setProjects(prev => [duplicatedProject, ...prev]);
      toast.success('Project duplicated successfully');
    } catch (error) {
      toast.error('Failed to duplicate project');
    }
  };

  const handleShareProject = async (projectId) => {
    toast.success('Share link copied to clipboard!');
    // In real implementation, this would copy the shareable link
  };

  const handleJoinSession = async (sessionId) => {
    toast.success(`Joining session ${sessionId}`);
    // Navigation logic would go here
  };

  const handleCreateSession = async () => {
    toast.success('Creating new collaborative session...');
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Animation variants
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

  // Loading Skeleton Components
  const ProjectCardSkeleton = () => (
    <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700 animate-pulse">
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-4 h-4 bg-gray-600 rounded"></div>
        <div className="h-4 bg-gray-600 rounded w-1/3"></div>
      </div>
      <div className="h-3 bg-gray-600 rounded w-2/3 mb-2"></div>
      <div className="flex justify-between">
        <div className="h-3 bg-gray-600 rounded w-1/4"></div>
        <div className="h-3 bg-gray-600 rounded w-1/3"></div>
      </div>
    </div>
  );

  const ActivityItemSkeleton = () => (
    <div className="flex items-center space-x-3 p-3 animate-pulse">
      <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
      <div className="flex-1">
        <div className="h-3 bg-gray-600 rounded w-3/4 mb-1"></div>
        <div className="h-2 bg-gray-600 rounded w-1/2"></div>
      </div>
    </div>
  );

  // Enhanced Header Component
  const EnhancedHeader = () => (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b border-gray-800/50 backdrop-blur-lg bg-gray-900/80 sticky top-0 z-40"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"
            >
              <Code className="w-6 h-6" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              CodeFlow
            </span>
          </div>
          
          {/* Search Bar */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 max-w-2xl mx-8"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects, commands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={() => setShowCommandPalette(true)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500/50 backdrop-blur-sm"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <kbd className="px-1.5 py-1 text-xs bg-gray-700 rounded text-gray-300">⌘K</kbd>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 text-gray-300 hover:text-white transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900"></span>
            </motion.button>

            {/* User Info */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-3 bg-gray-800/50 rounded-xl px-3 py-2 border border-gray-700/50 backdrop-blur-sm"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium">{user?.firstName || 'User'}</div>
                <div className="text-xs text-gray-400">{user?.email}</div>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-gray-600 hover:border-red-500/50 hover:text-red-400 transition-all duration-300 backdrop-blur-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );

  // Hero Section with Particles
  const HeroSection = () => (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-gradient">
              CodeFlow Editor
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
          >
            Your powerful online code editor with real-time collaboration, multiple language support, and cloud storage.
          </motion.p>

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8"
          >
            {[
              { icon: Users2, label: 'Active Users', value: '1.2k', color: 'blue' },
              { icon: GitBranch, label: 'Projects', value: '5.7k', color: 'green' },
              { icon: Cpu, label: 'Sessions', value: '243', color: 'purple' },
              { icon: Rocket, label: 'Deployments', value: '89', color: 'orange' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 border border-${stat.color}-500/20 hover:border-${stat.color}-500/40 transition-all duration-300`}
              >
                <stat.icon className={`w-6 h-6 text-${stat.color}-400 mb-2 mx-auto`} />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateProject(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-2xl font-semibold flex items-center space-x-2 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/25"
            >
              <Plus className="w-5 h-5" />
              <span>New Project</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('templates')}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 px-8 py-4 rounded-2xl font-semibold flex items-center space-x-2 hover:border-gray-600 transition-all duration-300"
            >
              <LayoutTemplate className="w-5 h-5" />
              <span>Browse Templates</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );

  // Quick Actions Section
  const QuickActions = () => (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid md:grid-cols-3 gap-6 mb-12"
    >
      {[
        {
          icon: Plus,
          title: 'New Project',
          description: 'Start a new coding project with your favorite language',
          color: 'blue',
          action: () => setShowCreateProject(true)
        },
        {
          icon: Users2,
          title: 'Live Sessions',
          description: 'Join active coding sessions with your team',
          color: 'green',
          action: () => setActiveTab('sessions')
        },
        {
          icon: LayoutTemplate,
          title: 'Templates',
          description: 'Start faster with pre-built project templates',
          color: 'purple',
          action: () => setActiveTab('templates')
        }
      ].map((action, index) => (
        <motion.button
          key={action.title}
          variants={itemVariants}
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.action}
          className={`bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-${action.color}-500/50 transition-all duration-300 text-left group`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 bg-${action.color}-500/20 rounded-lg group-hover:bg-${action.color}-500/30 transition-colors`}>
              <action.icon className={`w-6 h-6 text-${action.color}-400`} />
            </div>
            <h3 className="text-xl font-semibold">{action.title}</h3>
          </div>
          <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{action.description}</p>
        </motion.button>
      ))}
    </motion.div>
  );

  // Analytics Summary Component
  const AnalyticsSummary = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8"
    >
      <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
        <TrendingUp className="w-5 h-5 text-green-400" />
        <span>Your Coding Analytics</span>
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gray-700/30 rounded-xl">
          <div className="flex items-center justify-center space-x-1 mb-2">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium">Streak</span>
          </div>
          <div className="text-2xl font-bold text-white">{analytics?.streak || 0} days</div>
        </div>
        <div className="text-center p-4 bg-gray-700/30 rounded-xl">
          <div className="flex items-center justify-center space-x-1 mb-2">
            <FileCode className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium">Lines of Code</span>
          </div>
          <div className="text-2xl font-bold text-white">{analytics?.linesOfCode || 0}</div>
        </div>
        <div className="text-center p-4 bg-gray-700/30 rounded-xl">
          <div className="flex items-center justify-center space-x-1 mb-2">
            <Target className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium">Active Projects</span>
          </div>
          <div className="text-2xl font-bold text-white">{analytics?.activeProjects || 0}</div>
        </div>
        <div className="text-center p-4 bg-gray-700/30 rounded-xl">
          <div className="flex items-center justify-center space-x-1 mb-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">Collaboration</span>
          </div>
          <div className="text-2xl font-bold text-white">{analytics?.collaborationScore || 0}/5</div>
        </div>
      </div>
    </motion.div>
  );

  // Activity Feed Component
  const ActivityFeed = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <span>Recent Activity</span>
        </h3>
        <Filter className="w-4 h-4 text-gray-400" />
      </div>
      <div className="space-y-3">
        {activity.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700/30 transition-colors cursor-pointer group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-200 truncate">
                <span className="font-medium">{item.user}</span> {item.action}
              </p>
              <p className="text-xs text-gray-400">{item.project} • {item.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  // Enhanced Project Card Component
  const ProjectCard = ({ project }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group relative"
    >
      {/* Live Indicator */}
      {project.isLive && (
        <div className="absolute -top-2 -right-2 flex items-center space-x-1 bg-green-500/20 border border-green-500/30 rounded-full px-2 py-1 backdrop-blur-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400">Live</span>
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <FileCode className="w-4 h-4 text-blue-400" />
          <h3 className="font-semibold text-white truncate">{project.name}</h3>
        </div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDuplicateProject(project._id)}
            className="p-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            title="Duplicate"
          >
            <Copy className="w-3 h-3" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleShareProject(project._id)}
            className="p-1.5 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            title="Share"
          >
            <Share2 className="w-3 h-3" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDeleteProject(project._id)}
            className="p-1.5 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </motion.button>
        </div>
      </div>

      {project.description && (
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
      )}

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <span className="capitalize text-gray-300 bg-gray-700/50 px-2 py-1 rounded">
            {project.language}
          </span>
          {project.collaborators > 0 && (
            <span className="flex items-center space-x-1 text-gray-400">
              <Users2 className="w-3 h-3" />
              <span>{project.collaborators}</span>
            </span>
          )}
        </div>
        <span className="text-gray-500">
          {new Date(project.lastModified).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );

  // Live Sessions Component
  const LiveSessions = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center space-x-2">
          <Users2 className="w-5 h-5 text-green-400" />
          <span>Live Sessions</span>
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateSession}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Session</span>
        </motion.button>
      </div>
      <div className="space-y-3">
        {liveSessions.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <h4 className="font-medium text-white">{session.name}</h4>
                <p className="text-sm text-gray-400">
                  {session.participants} participants • {session.language} • {session.lastActivity}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleJoinSession(session.id)}
              className="bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <Play className="w-3 h-3" />
              <span>Join</span>
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  // Templates Gallery Component
  const TemplatesGallery = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center space-x-2">
          <LayoutTemplate className="w-5 h-5 text-purple-400" />
          <span>Project Templates</span>
        </h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1.5 bg-gray-700 rounded-lg text-sm font-medium">All</button>
          <button className="px-3 py-1.5 bg-gray-700 rounded-lg text-sm font-medium">Web</button>
          <button className="px-3 py-1.5 bg-gray-700 rounded-lg text-sm font-medium">Mobile</button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {mockTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-gray-700/30 rounded-xl p-4 border border-gray-600 hover:border-purple-500/50 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-purple-400" />
                <h4 className="font-semibold text-white">{template.name}</h4>
              </div>
              <div className="flex items-center space-x-1 text-yellow-400">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-xs">{template.stars}</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-3">{template.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-300 bg-gray-600/50 px-2 py-1 rounded">
                {template.language}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-500 hover:bg-purple-600 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Use Template</span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  // Command Palette Component
  const CommandPalette = () => (
    <AnimatePresence>
      {showCommandPalette && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 z-50 pt-20"
          onClick={() => setShowCommandPalette(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="bg-gray-800 rounded-2xl p-2 max-w-2xl w-full border border-gray-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-2 px-3 py-2 border-b border-gray-700">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400"
                autoFocus
              />
              <kbd className="px-2 py-1 text-xs bg-gray-700 rounded text-gray-300">ESC</kbd>
            </div>
            <div className="py-2">
              {['Create New Project', 'Search Projects', 'Open Settings', 'View Documentation'].map((command, index) => (
                <motion.div
                  key={command}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-700 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-200">{command}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Create Project Modal
  const CreateProjectModal = () => (
    <AnimatePresence>
      {showCreateProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowCreateProject(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Create New Project</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCreateProject(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </motion.button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Name</label>
                <input 
                  type="text" 
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 backdrop-blur-sm"
                  placeholder="My Awesome Project"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea 
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 resize-none backdrop-blur-sm"
                  placeholder="Project description"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select 
                  value={newProject.language}
                  onChange={(e) => setNewProject({...newProject, language: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 backdrop-blur-sm"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="typescript">TypeScript</option>
                </select>
              </div>
              <motion.button 
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Create Project</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white"
    >
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: 'white',
            border: '1px solid #374151'
          }
        }}
      />
      
      <EnhancedHeader />
      
      <main className="container mx-auto px-4 py-8">
        <HeroSection />
        <QuickActions />
        <AnalyticsSummary />

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Left Column - Projects & Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Tab Navigation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex space-x-4 border-b border-gray-800"
            >
              {[
                { id: 'projects', label: 'My Projects', count: projects.length },
                { id: 'sessions', label: 'Live Sessions', count: liveSessions.length },
                { id: 'templates', label: 'Templates', count: mockTemplates.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 px-1 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>{tab.label}</span>
                    <span className="bg-gray-700 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </span>
                </button>
              ))}
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'projects' && (
                <motion.div
                  key="projects"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {loading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                      <ProjectCardSkeleton key={index} />
                    ))
                  ) : filteredProjects.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <FileCode className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-400 mb-2">No projects found</h3>
                      <p className="text-gray-500">Create your first project to get started!</p>
                    </div>
                  ) : (
                    filteredProjects.map((project) => (
                      <ProjectCard key={project._id} project={project} />
                    ))
                  )}
                </motion.div>
              )}

              {activeTab === 'sessions' && (
                <motion.div
                  key="sessions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <LiveSessions />
                </motion.div>
              )}

              {activeTab === 'templates' && (
                <motion.div
                  key="templates"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <TemplatesGallery />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed />
          </div>
        </div>
      </main>

      <CreateProjectModal />
      <CommandPalette />
    </motion.div>
  );
};

export default Dashboard;


// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { Code, LogOut, Settings, User, FileCode, Share2, Plus, Trash2, Edit3 } from 'lucide-react';

// const Dashboard = () => {
//   const { user, logout } = useAuth();
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showCreateProject, setShowCreateProject] = useState(false);
//   const [newProject, setNewProject] = useState({
//     name: '',
//     description: '',
//     language: 'javascript',
//     code: '// Start coding here...'
//   });

//   // Fetch user's projects
//   const fetchProjects = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:5000/api/projects', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const data = await response.json();
//       if (data.success) {
//         setProjects(data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching projects:', error);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const handleLogout = () => {
//     logout();
//   };

//   const handleCreateProject = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:5000/api/projects', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newProject),
//       });

//       const data = await response.json();
//       if (data.success) {
//         await fetchProjects();
//         setShowCreateProject(false);
//         setNewProject({
//           name: '',
//           description: '',
//           language: 'javascript',
//           code: '// Start coding here...'
//         });
//       } else {
//         alert('Failed to create project: ' + data.message);
//       }
//     } catch (error) {
//       console.error('Error creating project:', error);
//       alert('Error creating project');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteProject = async (projectId) => {
//     if (!window.confirm('Are you sure you want to delete this project?')) {
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();
//       if (data.success) {
//         await fetchProjects();
//       } else {
//         alert('Failed to delete project: ' + data.message);
//       }
//     } catch (error) {
//       console.error('Error deleting project:', error);
//       alert('Error deleting project');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
//       {/* Header */}
//       <header className="border-b border-gray-800">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-blue-500 rounded-lg">
//                 <Code className="w-6 h-6" />
//               </div>
//               <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
//                 CodeFlow
//               </span>
//             </div>
            
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2 text-gray-300">
//                 <User className="w-5 h-5" />
//                 <span>Welcome, {user?.firstName || user?.name || 'User'}</span>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-600 hover:border-red-500 hover:text-red-400 transition-all duration-300"
//               >
//                 <LogOut className="w-4 h-4" />
//                 <span>Logout</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl md:text-6xl font-bold mb-6">
//             Welcome to{' '}
//             <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
//               CodeFlow Editor
//             </span>
//           </h1>
//           <p className="text-xl text-gray-300 max-w-2xl mx-auto">
//             Your powerful online code editor with real-time collaboration, multiple language support, and cloud storage.
//           </p>
//         </div>

//         {/* Quick Actions */}
//         <div className="grid md:grid-cols-3 gap-6 mb-12">
//           <button 
//             onClick={() => setShowCreateProject(true)}
//             className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 text-left"
//           >
//             <div className="flex items-center space-x-3 mb-4">
//               <Plus className="w-8 h-8 text-blue-500" />
//               <h3 className="text-xl font-semibold">New Project</h3>
//             </div>
//             <p className="text-gray-400">Start a new coding project with your favorite language</p>
//           </button>

//           <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-300">
//             <div className="flex items-center space-x-3 mb-4">
//               <Settings className="w-8 h-8 text-green-500" />
//               <h3 className="text-xl font-semibold">My Projects</h3>
//             </div>
//             <p className="text-gray-400">Access and manage your existing projects</p>
//           </div>

//           <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
//             <div className="flex items-center space-x-3 mb-4">
//               <Share2 className="w-8 h-8 text-purple-500" />
//               <h3 className="text-xl font-semibold">Collaborate</h3>
//             </div>
//             <p className="text-gray-400">Invite team members and code together in real-time</p>
//           </div>
//         </div>

//         {/* User Info Card */}
//         <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 mb-8">
//           <h3 className="text-xl font-semibold mb-4">User Information</h3>
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <p className="text-gray-400">Name</p>
//               <p className="text-white">{user?.firstName} {user?.lastName}</p>
//             </div>
//             <div>
//               <p className="text-gray-400">Email</p>
//               <p className="text-white">{user?.email}</p>
//             </div>
//           </div>
//         </div>

//         {/* Create Project Modal */}
//         {showCreateProject && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-2xl font-bold">Create New Project</h3>
//                 <button 
//                   onClick={() => setShowCreateProject(false)}
//                   className="text-gray-400 hover:text-white"
//                 >
//                   ✕
//                 </button>
//               </div>
//               <form onSubmit={handleCreateProject} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Project Name</label>
//                   <input 
//                     type="text" 
//                     value={newProject.name}
//                     onChange={(e) => setNewProject({...newProject, name: e.target.value})}
//                     className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
//                     placeholder="My Awesome Project"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Description</label>
//                   <textarea 
//                     value={newProject.description}
//                     onChange={(e) => setNewProject({...newProject, description: e.target.value})}
//                     className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 resize-none"
//                     placeholder="Project description"
//                     rows="3"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Language</label>
//                   <select 
//                     value={newProject.language}
//                     onChange={(e) => setNewProject({...newProject, language: e.target.value})}
//                     className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
//                   >
//                     <option value="javascript">JavaScript</option>
//                     <option value="python">Python</option>
//                     <option value="java">Java</option>
//                     <option value="cpp">C++</option>
//                     <option value="html">HTML</option>
//                     <option value="css">CSS</option>
//                     <option value="typescript">TypeScript</option>
//                   </select>
//                 </div>
//                 <button 
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
//                 >
//                   {loading ? (
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   ) : (
//                     <>
//                       <Plus className="w-5 h-5" />
//                       <span>Create Project</span>
//                     </>
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Projects Section */}
//         <div className="mt-12">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold">My Projects</h2>
//             <span className="text-gray-400">{projects.length} projects</span>
//           </div>
          
//           {projects.length === 0 ? (
//             <div className="text-center py-12">
//               <FileCode className="w-16 h-16 text-gray-600 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-gray-400 mb-2">No projects yet</h3>
//               <p className="text-gray-500">Create your first project to get started!</p>
//             </div>
//           ) : (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {projects.map((project) => (
//                 <div key={project._id} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 relative group">
//                   <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <button 
//                       className="p-1 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
//                     >
//                       <Edit3 className="w-3 h-3" />
//                     </button>
//                     <button 
//                       onClick={() => handleDeleteProject(project._id)}
//                       className="p-1 bg-red-600 hover:bg-red-700 rounded transition-colors"
//                     >
//                       <Trash2 className="w-3 h-3" />
//                     </button>
//                   </div>

//                   <div className="flex items-center space-x-2 mb-2">
//                     <FileCode className="w-4 h-4 text-blue-500" />
//                     <h3 className="font-semibold">{project.name}</h3>
//                   </div>
//                   {project.description && (
//                     <p className="text-gray-400 text-sm mb-2">{project.description}</p>
//                   )}
//                   <div className="flex justify-between items-center text-xs text-gray-500">
//                     <span className="capitalize">{project.language}</span>
//                     <span>Last modified: {new Date(project.lastModified).toLocaleDateString()}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;