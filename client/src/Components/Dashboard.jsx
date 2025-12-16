import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast, { Toaster } from 'react-hot-toast';
import {
  Folder,
  Share2,
  Play,
  Edit,
  Trash2,
  Download,
  Upload,
  Github,
  Clock,
  Zap,
  HardDrive,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  FileJson,
  Coffee,
  Cpu,
  Code2,
  X,
  Activity,
  Sparkles,
  FileText,
  Terminal,
  Users as UsersIcon,
  Target,
  Star,
  Calendar,
  Rocket,
  GitBranch
} from 'lucide-react';
import { FaPython } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { API_URL, user, token } = useAuth();
  const { theme } = useTheme();
  const [projects, setProjects] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({ 
    name: '', 
    description: '',
    language: 'javascript' 
  });
  const [stats, setStats] = useState({
    totalProjects: 0,
    linesToday: 0,
    streak: 0,
    storageUsed: 1.2,
    storageTotal: 5,
    languagesUsed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [deletingProjects, setDeletingProjects] = useState({});

  // Fetch projects from backend
  useEffect(() => {
    fetchProjects();
    const mockActivity = [
      { id: 1, action: 'Created project', project: 'Todo App', time: '2 hours ago', status: 'success' },
      { id: 2, action: 'Ran Python script', project: 'Data Analysis', time: '4 hours ago', status: 'success' },
      { id: 3, action: 'Edited', project: 'Algorithms', time: 'Yesterday', status: 'info' },
      { id: 4, action: 'Shared project', project: 'Data Analysis', time: '2 days ago', status: 'share' },
      { id: 5, action: 'Execution failed', project: 'Game Engine', time: '3 days ago', status: 'error' },
    ];
    setRecentActivity(mockActivity);
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/projects/project`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
        setStats(prev => ({
          ...prev,
          totalProjects: data.data.length,
          languagesUsed: new Set(data.data.map(p => p.language)).size
        }));
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: FileJson, 
      lightColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      darkColor: 'bg-yellow-900/30 text-yellow-300 border-yellow-700' },
    { id: 'python', name: 'Python', icon: FaPython,
      lightColor: 'bg-blue-100 text-blue-800 border-blue-200',
      darkColor: 'bg-blue-900/30 text-blue-300 border-blue-700' },
    { id: 'java', name: 'Java', icon: Coffee,
      lightColor: 'bg-red-100 text-red-800 border-red-200',
      darkColor: 'bg-red-900/30 text-red-300 border-red-700' },
    { id: 'cpp', name: 'C++', icon: Cpu,
      lightColor: 'bg-purple-100 text-purple-800 border-purple-200',
      darkColor: 'bg-purple-900/30 text-purple-300 border-purple-700' },
    { id: 'c', name: 'C', icon: Code2,
      lightColor: 'bg-gray-100 text-gray-800 border-gray-200',
      darkColor: 'bg-gray-800 text-gray-300 border-gray-700' },
  ];
// components/Dashboard.jsx - UPDATED handleCreateProject function
const handleCreateProject = async () => {
  if (!newProject.name.trim()) {
    toast.error('Please enter a project name');
    return;
  }

  if (!newProject.language) {
    toast.error('Please select a language');
    return;
  }

  try {
    toast.loading('Creating project...');
    
    const response = await fetch(`${API_URL}/projects/project`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newProject.name.trim(),
        description: newProject.description?.trim() || '',
        language: newProject.language
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Handle error responses
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    if (data.success) {
      await fetchProjects();
      setShowNewProjectModal(false);
      setNewProject({ name: '', description: '', language: 'javascript' });
      toast.success(`Project "${data.data.name}" created successfully!`);
    } else {
      throw new Error(data.message || 'Failed to create project');
    }
  } catch (error) {
    console.error('Error creating project:', error);
    
    // Show more specific error messages
    if (error.message.includes('validation') || error.message.includes('Validation')) {
      toast.error('Validation error: ' + error.message);
    } else if (error.message.includes('required')) {
      toast.error('Missing required fields: ' + error.message);
    } else {
      toast.error(error.message || 'Failed to create project. Please try again.');
    }
  }
};

  const handleDeleteProject = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      setDeletingProjects(prev => ({ ...prev, [id]: true }));
      
      const response = await fetch(`${API_URL}/projects/project/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchProjects();
        toast.success(`Project "${name}" deleted successfully`);
      } else {
        throw new Error(data.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(error.message || 'Failed to delete project');
    } finally {
      setDeletingProjects(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleRunProject = async (project) => {
    try {
      toast.loading(`Running ${project.name}...`);
      
      const response = await fetch(`${API_URL}/execute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project._id,
          language: project.language,
          code: project.code || ''
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Successfully executed ${project.name}!`);
        console.log('Output:', data.output);
      } else {
        throw new Error(data.message || 'Execution failed');
      }
    } catch (error) {
      console.error('Error running project:', error);
      toast.error(error.message || 'Failed to execute project');
    }
  };

  const handleShareProject = async (project) => {
    try {
      const shareUrl = `${window.location.origin}/project/${project._id}/share`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing project:', error);
      toast.error('Failed to share project');
    }
  };

  const getLanguageIcon = (lang) => {
    const language = languages.find(l => l.id === lang);
    return language ? React.createElement(language.icon, { className: "w-4 h-4" }) : <FileText className="w-4 h-4" />;
  };

  const getLanguageColor = (lang) => {
    const language = languages.find(l => l.id === lang);
    return theme === 'dark' ? language?.darkColor : language?.lightColor || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getActivityIcon = (status) => {
    switch(status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'info': return <Edit className="w-4 h-4 text-blue-500" />;
      case 'share': return <Share2 className="w-4 h-4 text-purple-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const storagePercentage = (stats.storageUsed / stats.storageTotal) * 100;

  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          duration: 3000,
          style: {
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#1f2937',
            border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb'
          }
        }} 
      />

      <div className="p-6 md:p-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Welcome back, <span className="text-blue-500">{user?.firstName}</span> 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Here's what's happening with your projects today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Projects Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Total Projects</p>
                <p className="text-3xl font-bold mt-2">{stats.totalProjects}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'
              }`}>
                <Folder className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          {/* Lines Today Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Lines Today</p>
                <p className="text-3xl font-bold mt-2">{stats.linesToday}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50'
              }`}>
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Day Streak</p>
                <p className="text-3xl font-bold mt-2">{stats.streak}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                theme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-50'
              }`}>
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>

          {/* Storage Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Storage</p>
                <p className="text-3xl font-bold mt-2">
                  {stats.storageUsed}/{stats.storageTotal} GB
                </p>
                <div className={`mt-2 w-full rounded-full h-2 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                    style={{ width: `${storagePercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50'
              }`}>
                <HardDrive className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Projects Section */}
          <div className="lg:col-span-2">
            <div className={`rounded-2xl border shadow-sm ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Recent Projects</h2>
                  <div className="flex space-x-2">
                    <button className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                      <Download className="w-4 h-4" />
                    </button>
                    <button className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                      <Upload className="w-4 h-4" />
                    </button>
                    <button className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                      <Github className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">Loading projects...</p>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-12">
                    <Folder className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No projects yet</p>
                    <button
                      onClick={() => setShowNewProjectModal(true)}
                      className="mt-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      Create your first project
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project, index) => {
                      const LanguageIcon = getLanguageIcon(project.language);
                      return (
                        <motion.div
                          key={project._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-center justify-between p-4 border rounded-lg hover:border-blue-300 dark:hover:border-blue-500 transition-colors ${
                            theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getLanguageColor(project.language)}`}>
                              {LanguageIcon}
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium">{project.name}</h3>
                                {project.shared && (
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    theme === 'dark' 
                                      ? 'bg-purple-900/30 text-purple-300 border border-purple-700'
                                      : 'bg-purple-100 text-purple-800'
                                  }`}>
                                    Shared
                                  </span>
                                )}
                              </div>
                              <div className={`flex items-center text-sm mt-1 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                <span className="capitalize">{project.language}</span>
                                <span className="mx-2">•</span>
                                <span>{project.description || 'No description'}</span>
                                <span className="mx-2">•</span>
                                <Clock className="w-3 h-3 mr-1 inline" />
                                {new Date(project.lastModified).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleRunProject(project)}
                              className={`p-2 rounded-lg ${
                                theme === 'dark' 
                                  ? 'text-green-400 hover:bg-green-900/30' 
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title="Run"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleShareProject(project)}
                              className={`p-2 rounded-lg ${
                                theme === 'dark' 
                                  ? 'text-purple-400 hover:bg-purple-900/30' 
                                  : 'text-purple-600 hover:bg-purple-50'
                              }`}
                              title="Share"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toast('Edit feature coming soon!')}
                              className={`p-2 rounded-lg ${
                                theme === 'dark' 
                                  ? 'text-blue-400 hover:bg-blue-900/30' 
                                  : 'text-blue-600 hover:bg-blue-50'
                              }`}
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project._id, project.name)}
                              disabled={deletingProjects[project._id]}
                              className={`p-2 rounded-lg ${
                                theme === 'dark' 
                                  ? 'text-red-400 hover:bg-red-900/30' 
                                  : 'text-red-600 hover:bg-red-50'
                              } ${deletingProjects[project._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title="Delete"
                            >
                              {deletingProjects[project._id] ? (
                                <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Activity Feed */}
            <div className={`rounded-2xl border shadow-sm ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className="text-xl font-semibold">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className="mt-1">
                        {getActivityIcon(activity.status)}
                      </div>
                      <div className="ml-4 flex-1">
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className="font-medium">{activity.action}</span>
                          {activity.project && (
                            <span> • {activity.project}</span>
                          )}
                        </p>
                        <p className={`text-xs mt-1 flex items-center ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Supported Languages */}
            <div className={`rounded-2xl border shadow-sm ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className="text-xl font-semibold">Supported Languages</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {languages.map((lang) => {
                    const LangIcon = lang.icon;
                    return (
                      <div key={lang.id} className={`flex items-center justify-between p-3 rounded-lg ${
                        theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                      }`}>
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            theme === 'dark' ? lang.darkColor : lang.lightColor
                          }`}>
                            <LangIcon className="w-5 h-5" />
                          </div>
                          <span className="ml-3 font-medium">{lang.name}</span>
                        </div>
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Ready
                        </span>
                      </div>
                    );
                  })}
                </div>
                <button className={`w-full mt-4 py-2 text-center text-sm font-medium border rounded-lg ${
                  theme === 'dark' 
                    ? 'text-blue-400 hover:text-blue-300 border-blue-800 hover:bg-blue-900/30' 
                    : 'text-blue-600 hover:text-blue-800 border-blue-200 hover:bg-blue-50'
                }`}>
                  View all templates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Project Modal */}
      <AnimatePresence>
        {showNewProjectModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowNewProjectModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`rounded-2xl max-w-md w-full p-6 border shadow-2xl ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Create New Project</h3>
                  <button
                    onClick={() => setShowNewProjectModal(false)}
                    className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={newProject.name}
                      onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                      placeholder="My Awesome Project"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Description (Optional)
                    </label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      placeholder="Project description"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Language
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {languages.map((lang) => {
                        const LangIcon = lang.icon;
                        return (
                          <button
                            key={lang.id}
                            type="button"
                            onClick={() => setNewProject({...newProject, language: lang.id})}
                            className={`p-4 border rounded-xl flex flex-col items-center justify-center transition-all ${
                              newProject.language === lang.id 
                                ? `ring-2 ${
                                    theme === 'dark' 
                                      ? 'border-blue-500 bg-blue-900/30 ring-blue-800' 
                                      : 'border-blue-500 bg-blue-50 ring-blue-100'
                                  }` 
                                : theme === 'dark'
                                  ? 'border-gray-700 hover:border-gray-600 bg-gray-700/50'
                                  : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              theme === 'dark' ? lang.darkColor : lang.lightColor
                            } mb-2`}>
                              <LangIcon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium">{lang.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setShowNewProjectModal(false)}
                      className={`flex-1 px-4 py-3 border rounded-xl ${
                        theme === 'dark' 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateProject}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Create Project
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Dashboard;