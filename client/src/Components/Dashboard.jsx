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
  GitBranch,
  Plus,
  Save,
  Loader2
} from 'lucide-react';
import { FaPython } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { API_URL, user, token } = useAuth();
  const { theme } = useTheme();
  const [projects, setProjects] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentProject, setCurrentProject] = useState({
    _id: '',
    name: '',
    description: '',
    language: 'javascript'
  });
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [stats, setStats] = useState({
    totalProjects: 0,
    linesToday: 0,
    streak: 0,
    storageUsed: 1.2,
    storageTotal: 5,
    languagesUsed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({
    edit: false,
    delete: false,
    create: false
  });

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

  const handleCreateProject = async () => {
    if (!currentProject.name.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, create: true }));
      
      const response = await fetch(`${API_URL}/projects/project`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: currentProject.name.trim(),
          description: currentProject.description?.trim() || '',
          language: currentProject.language
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      if (data.success) {
        await fetchProjects();
        setShowProjectModal(false);
        resetCurrentProject();
        toast.success(`Project "${data.data.name}" created successfully!`);
      } else {
        throw new Error(data.message || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error.message || 'Failed to create project. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, create: false }));
    }
  };

  const handleEditProject = async () => {
    if (!currentProject.name.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, edit: true }));
      
      const response = await fetch(`${API_URL}/projects/project/${currentProject._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: currentProject.name.trim(),
          description: currentProject.description?.trim() || '',
          language: currentProject.language
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      if (data.success) {
        await fetchProjects();
        setShowProjectModal(false);
        resetCurrentProject();
        toast.success(`Project "${data.data.name}" updated successfully!`);
      } else {
        throw new Error(data.message || 'Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error(error.message || 'Failed to update project. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, edit: false }));
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      setActionLoading(prev => ({ ...prev, delete: true }));
      
      const response = await fetch(`${API_URL}/projects/project/${projectToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchProjects();
        setShowDeleteModal(false);
        setProjectToDelete(null);
        toast.success(`Project "${projectToDelete.name}" deleted successfully`);
      } else {
        throw new Error(data.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(error.message || 'Failed to delete project');
    } finally {
      setActionLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const openEditModal = (project) => {
    setCurrentProject({
      _id: project._id,
      name: project.name,
      description: project.description || '',
      language: project.language
    });
    setModalMode('edit');
    setShowProjectModal(true);
  };

  const openDeleteModal = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const openCreateModal = () => {
    resetCurrentProject();
    setModalMode('create');
    setShowProjectModal(true);
  };

  const resetCurrentProject = () => {
    setCurrentProject({
      _id: '',
      name: '',
      description: '',
      language: 'javascript'
    });
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
    return language ? React.createElement(language.icon, { className: "w-4 h-4 sm:w-5 sm:h-5" }) : <FileText className="w-4 h-4 sm:w-5 sm:h-5" />;
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

      {/* Floating Add Project Button - Responsive */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={openCreateModal}
        className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-40 flex items-center space-x-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-xl transition-shadow text-sm sm:text-base"
      >
        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Add Project</span>
        <span className="sm:hidden">Add</span>
      </motion.button>

      <div className="p-4 sm:p-6 md:p-8">
        {/* Hero Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
            Welcome back, <span className="text-blue-500">{user?.firstName}</span> 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            Here's what's happening with your projects today
          </p>
        </div>

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Projects Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-2xl p-4 sm:p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Total Projects</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{stats.totalProjects}</p>
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${
                theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'
              }`}>
                <Folder className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          {/* Lines Today Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl p-4 sm:p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Lines Today</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{stats.linesToday}</p>
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${
                theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50'
              }`}>
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-2xl p-4 sm:p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Day Streak</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{stats.streak}</p>
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${
                theme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-50'
              }`}>
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>

          {/* Storage Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-2xl p-4 sm:p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Storage</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">
                  {stats.storageUsed}/{stats.storageTotal} GB
                </p>
                <div className={`mt-1 sm:mt-2 w-full rounded-full h-2 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                    style={{ width: `${storagePercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${
                theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50'
              }`}>
                <HardDrive className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content - Responsive */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Projects Section */}
          <div className="lg:col-span-2">
            <div className={`rounded-2xl border shadow-sm ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className={`p-4 sm:p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                  <h2 className="text-lg sm:text-xl font-semibold">Recent Projects</h2>
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
              <div className="p-4 sm:p-6">
                {loading ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-3 sm:mt-4 text-gray-500 dark:text-gray-400">Loading projects...</p>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Folder className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No projects yet</p>
                    <button
                      onClick={openCreateModal}
                      className="mt-3 sm:mt-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      Create your first project
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {projects.map((project, index) => {
                      const LanguageIcon = getLanguageIcon(project.language);
                      return (
                        <motion.div
                          key={project._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:border-blue-300 dark:hover:border-blue-500 transition-colors ${
                            theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center mb-3 sm:mb-0">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${getLanguageColor(project.language)}`}>
                              {LanguageIcon}
                            </div>
                            <div className="ml-3">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                                <h3 className="font-medium text-sm sm:text-base">{project.name}</h3>
                                {project.shared && (
                                  <span className={`mt-1 sm:mt-0 px-2 py-1 text-xs rounded-full ${
                                    theme === 'dark' 
                                      ? 'bg-purple-900/30 text-purple-300 border border-purple-700'
                                      : 'bg-purple-100 text-purple-800'
                                  }`}>
                                    Shared
                                  </span>
                                )}
                              </div>
                              <div className={`flex flex-wrap items-center text-xs sm:text-sm mt-1 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                <span className="capitalize">{project.language}</span>
                                <span className="mx-2 hidden sm:inline">•</span>
                                <span className="truncate max-w-[150px] sm:max-w-none">{project.description || 'No description'}</span>
                                <span className="mx-2 hidden sm:inline">•</span>
                                <div className="flex items-center mt-1 sm:mt-0">
                                  <Clock className="w-3 h-3 mr-1 inline" />
                                  {new Date(project.lastModified).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-end sm:justify-start space-x-1 sm:space-x-2">
                            <button
                              onClick={() => handleRunProject(project)}
                              className={`p-1.5 sm:p-2 rounded-lg ${
                                theme === 'dark' 
                                  ? 'text-green-400 hover:bg-green-900/30' 
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title="Run"
                            >
                              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() => handleShareProject(project)}
                              className={`p-1.5 sm:p-2 rounded-lg ${
                                theme === 'dark' 
                                  ? 'text-purple-400 hover:bg-purple-900/30' 
                                  : 'text-purple-600 hover:bg-purple-50'
                              }`}
                              title="Share"
                            >
                              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(project)}
                              className={`p-1.5 sm:p-2 rounded-lg ${
                                theme === 'dark' 
                                  ? 'text-blue-400 hover:bg-blue-900/30' 
                                  : 'text-blue-600 hover:bg-blue-50'
                              }`}
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(project)}
                              className={`p-1.5 sm:p-2 rounded-lg ${
                                theme === 'dark' 
                                  ? 'text-red-400 hover:bg-red-900/30' 
                                  : 'text-red-600 hover:bg-red-50'
                              }`}
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

          {/* Right Sidebar - Responsive */}
          <div className="space-y-6 sm:space-y-8">
            {/* Activity Feed */}
            <div className={`rounded-2xl border shadow-sm ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className={`p-4 sm:p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className="text-lg sm:text-xl font-semibold">Recent Activity</h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className="mt-0.5 sm:mt-1">
                        {getActivityIcon(activity.status)}
                      </div>
                      <div className="ml-3 sm:ml-4 flex-1">
                        <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className="font-medium">{activity.action}</span>
                          {activity.project && (
                            <span> • {activity.project}</span>
                          )}
                        </p>
                        <p className={`text-xs mt-0.5 sm:mt-1 flex items-center ${
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
              <div className={`p-4 sm:p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className="text-lg sm:text-xl font-semibold">Supported Languages</h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-2 sm:space-y-3">
                  {languages.map((lang) => {
                    const LangIcon = lang.icon;
                    return (
                      <div key={lang.id} className={`flex items-center justify-between p-2 sm:p-3 rounded-lg ${
                        theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                      }`}>
                        <div className="flex items-center">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                            theme === 'dark' ? lang.darkColor : lang.lightColor
                          }`}>
                            <LangIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <span className="ml-2 sm:ml-3 font-medium text-sm sm:text-base">{lang.name}</span>
                        </div>
                        <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Ready
                        </span>
                      </div>
                    );
                  })}
                </div>
                <button className={`w-full mt-3 sm:mt-4 py-2 text-center text-xs sm:text-sm font-medium border rounded-lg ${
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

      {/* Project Modal (Create/Edit) */}
      <AnimatePresence>
        {showProjectModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowProjectModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
              } border shadow-2xl`}>
                {/* Static Header */}
                <div className="flex items-center justify-between p-3 border-b shrink-0">
                  <h3 className="text-xl font-semibold">
                    {modalMode === 'create' ? 'Create New Project' : 'Edit Project'}
                  </h3>
                  <button
                    onClick={() => setShowProjectModal(false)}
                    className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    disabled={actionLoading.create || actionLoading.edit}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={currentProject.name}
                        onChange={(e) => setCurrentProject({...currentProject, name: e.target.value})}
                        placeholder="My Awesome Project"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        autoFocus
                        disabled={actionLoading.create || actionLoading.edit}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Description (Optional)
                      </label>
                      <textarea
                        value={currentProject.description}
                        onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})}
                        placeholder="Project description"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        rows="3"
                        disabled={actionLoading.create || actionLoading.edit}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Language
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {languages.map((lang) => {
                          const LangIcon = lang.icon;
                          return (
                            <button
                              key={lang.id}
                              type="button"
                              onClick={() => setCurrentProject({...currentProject, language: lang.id})}
                              className={`p-3 sm:p-4 border rounded-xl flex flex-col items-center justify-center transition-all ${
                                currentProject.language === lang.id 
                                  ? `ring-2 ${
                                      theme === 'dark' 
                                        ? 'border-blue-500 bg-blue-900/30 ring-blue-800' 
                                        : 'border-blue-500 bg-blue-50 ring-blue-100'
                                    }` 
                                  : theme === 'dark'
                                    ? 'border-gray-700 hover:border-gray-600 bg-gray-700/50'
                                    : 'border-gray-200 hover:border-gray-300'
                              }`}
                              disabled={actionLoading.create || actionLoading.edit}
                            >
                              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                                theme === 'dark' ? lang.darkColor : lang.lightColor
                              } mb-2`}>
                                <LangIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                              </div>
                              <span className="text-xs sm:text-sm font-medium">{lang.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Static Footer */}
                <div className="border-t p-4 shrink-0">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowProjectModal(false)}
                      disabled={actionLoading.create || actionLoading.edit}
                      className={`flex-1 px-4 py-3 border rounded-xl ${
                        theme === 'dark' 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={modalMode === 'create' ? handleCreateProject : handleEditProject}
                      disabled={actionLoading.create || actionLoading.edit}
                      className="flex-1 px-4 py-3 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {actionLoading.create || actionLoading.edit ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          {modalMode === 'create' ? 'Creating...' : 'Updating...'}
                        </>
                      ) : modalMode === 'create' ? (
                        'Create Project'
                      ) : (
                        'Update Project'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal - Also updated for consistency */}
      <AnimatePresence>
        {showDeleteModal && projectToDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowDeleteModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`rounded-2xl max-w-md w-full flex flex-col ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
              } border shadow-2xl`}>
                {/* Static Header for Delete Modal */}
                <div className="flex items-center justify-between p-6 border-b shrink-0">
                  <h3 className="text-xl font-semibold">Delete Project</h3>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    disabled={actionLoading.delete}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50'
                    } mb-4`}>
                      <Trash2 className="w-8 h-8 text-red-600" />
                    </div>
                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                      Are you sure you want to delete this project?
                    </p>
                    <p className="font-semibold text-lg mb-1">"{projectToDelete.name}"</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      This action cannot be undone.
                    </p>
                  </div>
                </div>

                {/* Static Footer for Delete Modal */}
                <div className="border-t p-6 shrink-0">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      disabled={actionLoading.delete}
                      className={`flex-1 px-4 py-3 border rounded-xl ${
                        theme === 'dark' 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteProject}
                      disabled={actionLoading.delete}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {actionLoading.delete ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Deleting...
                        </>
                      ) : (
                        'Delete Project'
                      )}
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