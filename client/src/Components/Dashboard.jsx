import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
  Folder,
  Share2,
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
  X,
  Activity,
  Plus,
  Loader2,
  Code,
  Search,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';
import { FaPython, FaJs, FaJava, FaHtml5, FaCss3Alt, FaReact } from 'react-icons/fa';
import { SiTypescript, SiCplusplus, SiC } from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { API_URL, user, token, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [projects, setProjects] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
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
  
  // Mobile states
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    { id: 'javascript', name: 'JS', icon: FaJs, 
      lightColor: 'bg-yellow-500',
      darkColor: 'bg-yellow-600',
      textColor: 'text-yellow-600 dark:text-yellow-400' },
    { id: 'python', name: 'Py', icon: FaPython,
      lightColor: 'bg-blue-500',
      darkColor: 'bg-blue-600',
      textColor: 'text-blue-600 dark:text-blue-400' },
    { id: 'java', name: 'Java', icon: FaJava,
      lightColor: 'bg-red-500',
      darkColor: 'bg-red-600',
      textColor: 'text-red-600 dark:text-red-400' },
    { id: 'html', name: 'HTML', icon: FaHtml5,
      lightColor: 'bg-orange-500',
      darkColor: 'bg-orange-600',
      textColor: 'text-orange-600 dark:text-orange-400' },
    { id: 'css', name: 'CSS', icon: FaCss3Alt,
      lightColor: 'bg-blue-400',
      darkColor: 'bg-blue-500',
      textColor: 'text-blue-500 dark:text-blue-300' },
    { id: 'typescript', name: 'TS', icon: SiTypescript,
      lightColor: 'bg-blue-300',
      darkColor: 'bg-blue-400',
      textColor: 'text-blue-400 dark:text-blue-300' },
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

  const getLanguageIcon = (lang) => {
    const language = languages.find(l => l.id === lang);
    return language ? React.createElement(language.icon, { className: "w-4 h-4" }) : <Code className="w-4 h-4" />;
  };

  const getLanguageColor = (lang) => {
    const language = languages.find(l => l.id === lang);
    return theme === 'dark' ? language?.darkColor : language?.lightColor || 'bg-gray-500';
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

  // Mock notifications
  const notifications = [
    { id: 1, title: 'Project Shared', message: 'Sarah shared "E-commerce Dashboard" with you', time: '5 min ago', read: false },
    { id: 2, title: 'Code Review', message: 'Mike requested a review on "API Integration"', time: '1 hour ago', read: false },
    { id: 3, title: 'Execution Complete', message: 'Python script "data_analysis.py" ran successfully', time: '2 hours ago', read: true },
    { id: 4, title: 'Storage Warning', message: 'You\'ve used 80% of your storage', time: '1 day ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <Toaster 
        position={isMobile ? "top-center" : "top-right"}
        toastOptions={{ 
          duration: 3000,
          style: {
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#1f2937',
            border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
            fontSize: '14px',
            maxWidth: isMobile ? '90vw' : '400px',
            borderRadius: '10px'
          }
        }} 
      />

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isMobile && showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-0 left-0 right-0 z-40 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-b p-4`}
          >
            <div className="flex items-center space-x-3">
              <Search className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
              <input
                type="search"
                placeholder="Search projects..."
                className={`flex-1 py-2 focus:outline-none ${theme === 'dark' ? 'bg-gray-800 text-white' : 'text-gray-900'}`}
                autoFocus
              />
              <button
                onClick={() => setShowSearch(false)}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Side Menu */}
      <AnimatePresence>
        {isMobile && showMobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowMobileMenu(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className={`fixed top-0 left-0 bottom-0 w-64 z-50 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-bold text-lg">Menu</h2>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <Link to="/projects" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Folder className="w-5 h-5" />
                  <span>My Projects</span>
                </Link>
                <Link to="/shared" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Share2 className="w-5 h-5" />
                  <span>Shared</span>
                </Link>
                <Link to="/activity" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Activity className="w-5 h-5" />
                  <span>Activity</span>
                </Link>
                <Link to="/settings" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
                <div className="pt-4 border-t">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center space-x-3 p-3 rounded-lg w-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-3 p-3 rounded-lg w-full hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className={`flex-1 p-4 sm:p-6 md:p-8 ${isMobile ? 'pt-4' : ''}`}>
        {/* Hero Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
            Welcome back, <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">{user?.firstName}</span> 👋
          </h1>
          <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Here's what's happening with your projects today
          </p>
        </div>

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Projects Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Total Projects</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2">{stats.totalProjects}</p>
              </div>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                <Folder className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          {/* Lines Today Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Lines Today</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2">{stats.linesToday}</p>
              </div>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50'}`}>
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Day Streak</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2">{stats.streak}</p>
              </div>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-50'}`}>
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>

          {/* Storage Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Storage</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2">
                  {stats.storageUsed}/{stats.storageTotal} GB
                </p>
                <div className={`mt-2 w-full rounded-full h-1.5 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${storagePercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
                <HardDrive className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Desktop Floating Button */}
        {!isMobile && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCreateModal}
            className="fixed right-6 bottom-6 z-40 flex items-center space-x-2 px-5 py-3 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-xl transition-shadow"
          >
            <Plus className="w-5 h-5" />
            <span>Add Project</span>
          </motion.button>
        )}

        {/* Mobile Floating Button */}
        {isMobile && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCreateModal}
            className="fixed right-4 bottom-4 z-40 p-3 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl transition-shadow"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        )}

        {/* Main Content - Responsive */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Projects Section */}
          <div className="lg:col-span-2">
            <div className={`rounded-xl sm:rounded-2xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className={`p-4 sm:p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                  <h2 className="text-lg sm:text-xl font-semibold">Recent Projects</h2>
                  {!isMobile && (
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
                  )}
                </div>
              </div>
              <div className="p-3 sm:p-4 md:p-6">
                {loading ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-3 sm:mt-4 text-gray-500 dark:text-gray-400">Loading projects...</p>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Folder className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No projects yet</p>
                    <button
                      onClick={openCreateModal}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Create your first project
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projects.slice(0, isMobile ? 3 : 5).map((project, index) => {
                      return (
                        <motion.div
                          key={project._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: 5 }}
                          className={`p-3 sm:p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-700 hover:border-blue-500 bg-gray-800/50' : 'border-gray-200 hover:border-blue-300 bg-white'} transition-all duration-300`}
                        >
                          <div className="flex items-start">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${getLanguageColor(project.language)}`}>
                              {getLanguageIcon(project.language)}
                            </div>
                            <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-sm sm:text-base truncate">{project.name}</h3>
                                  <p className={`text-xs sm:text-sm mt-1 truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {project.description || 'No description'}
                                  </p>
                                  <div className="flex items-center mt-2 text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                                      {new Date(project.lastModified).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                {!isMobile && (
                                  <div className="flex items-center space-x-1 ml-2">
                                    <button
                                      onClick={() => openEditModal(project)}
                                      className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                      title="Edit"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => openDeleteModal(project)}
                                      className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                              {isMobile && (
                                <div className="flex items-center justify-between mt-3">
                                  <span className={`px-2 py-1 rounded text-xs ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                    {project.language}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => openEditModal(project)}
                                      className="p-1.5 rounded"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => openDeleteModal(project)}
                                      className="p-1.5 rounded text-red-500"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    {isMobile && projects.length > 3 && (
                      <Link
                        to="/projects"
                        className={`block text-center p-3 border rounded-lg ${theme === 'dark' ? 'border-gray-700 hover:border-blue-500 text-blue-400' : 'border-gray-200 hover:border-blue-300 text-blue-600'} transition-colors`}
                      >
                        View all projects
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Activity Feed */}
            <div className={`rounded-xl sm:rounded-2xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className="text-lg font-semibold">Recent Activity</h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {recentActivity.slice(0, isMobile ? 3 : 5).map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className="mt-0.5">
                        {getActivityIcon(activity.status)}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} truncate`}>
                          {activity.action} • {activity.project}
                        </p>
                        <p className={`text-xs mt-1 flex items-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
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
            <div className={`rounded-xl sm:rounded-2xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className="text-lg font-semibold">Supported Languages</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                  {languages.map((lang) => {
                    const LangIcon = lang.icon;
                    return (
                      <div
                        key={lang.id}
                        className={`p-3 rounded-lg flex flex-col items-center justify-center ${theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors`}
                      >
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${getLanguageColor(lang.id)} mb-2`}>
                          {typeof LangIcon === 'function' ? (
                            <LangIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          ) : (
                            React.createElement(LangIcon, { className: "w-4 h-4 sm:w-5 sm:h-5 text-white" })
                          )}
                        </div>
                        <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {lang.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {showProjectModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowProjectModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`rounded-xl sm:rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-2xl`}>
                <div className="flex items-center justify-between p-4 sm:p-6 border-b shrink-0">
                  <h3 className="text-lg sm:text-xl font-semibold">
                    {modalMode === 'create' ? 'Create Project' : 'Edit Project'}
                  </h3>
                  <button
                    onClick={() => setShowProjectModal(false)}
                    className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={currentProject.name}
                        onChange={(e) => setCurrentProject({...currentProject, name: e.target.value})}
                        placeholder="My Awesome Project"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        value={currentProject.description}
                        onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})}
                        placeholder="Project description"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Language
                      </label>
                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {languages.map((lang) => {
                          const LangIcon = lang.icon;
                          return (
                            <motion.button
                              key={lang.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => setCurrentProject({...currentProject, language: lang.id})}
                              className={`p-3 border rounded-lg flex flex-col items-center justify-center ${
                                currentProject.language === lang.id 
                                  ? `ring-2 ${theme === 'dark' 
                                      ? 'border-blue-500 bg-blue-900/30 ring-blue-800' 
                                      : 'border-blue-500 bg-blue-50 ring-blue-100'
                                    }` 
                                  : theme === 'dark'
                                    ? 'border-gray-700 hover:border-gray-600 bg-gray-700/50'
                                    : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getLanguageColor(lang.id)} mb-2`}>
                                {typeof LangIcon === 'function' ? (
                                  <LangIcon className="w-4 h-4 text-white" />
                                ) : (
                                  React.createElement(LangIcon, { className: "w-4 h-4 text-white" })
                                )}
                              </div>
                              <span className="text-xs font-medium">{lang.name}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t p-4 sm:p-6 shrink-0">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowProjectModal(false)}
                      className={`flex-1 px-4 py-3 border rounded-lg ${
                        theme === 'dark' 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={modalMode === 'create' ? handleCreateProject : handleEditProject}
                      disabled={actionLoading.create || actionLoading.edit}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
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

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && projectToDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowDeleteModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`rounded-xl sm:rounded-2xl max-w-md w-full flex flex-col ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-2xl`}>
                <div className="flex items-center justify-between p-4 sm:p-6 border-b shrink-0">
                  <h3 className="text-lg sm:text-xl font-semibold">Delete Project</h3>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${
                      theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50'
                    } mb-4`}>
                      <Trash2 className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                    </div>
                    <p className="font-semibold text-lg mb-1">"{projectToDelete.name}"</p>
                    <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      This action cannot be undone. All files and data will be permanently deleted.
                    </p>
                  </div>
                </div>

                <div className="border-t p-4 sm:p-6 shrink-0">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className={`flex-1 px-4 py-3 border rounded-lg ${
                        theme === 'dark' 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteProject}
                      disabled={actionLoading.delete}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
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