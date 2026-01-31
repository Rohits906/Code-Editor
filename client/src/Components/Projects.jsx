import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import {
  Folder,
  FileText,
  Play,
  Save,
  Plus,
  Search,
  Code,
  X,
  Copy,
  Terminal,
  RefreshCw,
  Menu,
  ChevronRight,
  Eye,
  EyeOff,
  ArrowLeft,
  Grid,
  List,
  Trash2,
  Calendar,
  HardDrive,
  MoreVertical,
  Download,
  Maximize2,
  Minimize2,
  FileCode,
  ExternalLink
} from 'lucide-react';
import { FaPython, FaJs, FaJava, FaHtml5, FaCss3Alt } from 'react-icons/fa';
import { SiTypescript, SiCplusplus, SiC } from 'react-icons/si';

// Main Projects Page Container
const Projects = () => {
  return (
    <Routes>
      <Route path="/" element={<ProjectsList />} />
      <Route path="/:projectId" element={<ProjectEditor />} />
    </Routes>
  );
};

const ProjectMenuModal = ({ show, onClose, projectForm, setProjectForm, onSubmit, theme, languages }) => {
  if (!show) return null;
  return ( 
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6`}>
        <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Project Name</label>
            <input
              type="text"
              value={projectForm.name}
              onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
              className={`w-full p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              value={projectForm.description}
              onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
              className={`w-full p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Projects List Component
const ProjectsList = () => {
  const { API_URL, token } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    language: 'javascript'
  });
  
  // Languages
  const languages = [
    { id: 'all', name: 'All', icon: Code, color: 'bg-gray-500', count: 0 },
    { id: 'javascript', name: 'JavaScript', icon: FaJs, color: 'bg-yellow-500', count: 0 },
    { id: 'python', name: 'Python', icon: FaPython, color: 'bg-blue-500', count: 0 },
    { id: 'java', name: 'Java', icon: FaJava, color: 'bg-red-500', count: 0 },
    { id: 'html', name: 'HTML', icon: FaHtml5, color: 'bg-orange-500', count: 0 },
    { id: 'css', name: 'CSS', icon: FaCss3Alt, color: 'bg-blue-600', count: 0 },
    { id: 'typescript', name: 'TypeScript', icon: SiTypescript, color: 'bg-blue-400', count: 0 },
    { id: 'cpp', name: 'C++', icon: SiCplusplus, color: 'bg-pink-500', count: 0 },
    { id: 'c', name: 'C', icon: SiC, color: 'bg-indigo-500', count: 0 }
  ];
  
  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);
  
  // Filter projects
  useEffect(() => {
    let filtered = [...projects];
    
    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by language
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(project => project.language === selectedLanguage);
    }
    
    // Sort by recent (default)
    filtered.sort((a, b) => {
      return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
    });
    
    setFilteredProjects(filtered);
  }, [projects, searchQuery, selectedLanguage]);
  
  // Count projects by language
  useEffect(() => {
    const counts = { ...languages.reduce((acc, lang) => ({ ...acc, [lang.id]: 0 }), {}) };
    
    projects.forEach(project => {
      if (counts[project.language] !== undefined) {
        counts[project.language]++;
      }
      counts.all++;
    });
    
    languages.forEach(lang => {
      lang.count = counts[lang.id] || 0;
    });
  }, [projects]);
  
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/projects/project`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch projects');
      
      const data = await response.json();
      if (data.success) {
        // Fetch file count for each project
        const projectsWithFileCount = await Promise.all(
          data.data.map(async (project) => {
            try {
              const filesResponse = await fetch(`${API_URL}/projects/project/${project._id}/get-files`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });
              
              if (filesResponse.ok) {
                const filesData = await filesResponse.json();
                return {
                  ...project,
                  fileCount: filesData.data?.length || 0
                };
              }
            } catch (error) {
              console.error(`Error fetching files for project ${project._id}:`, error);
            }
            return { ...project, fileCount: 0 };
          })
        );
        setProjects(projectsWithFileCount);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateProject = async () => {
    if (!projectForm.name.trim()) {
      toast.error('Please enter a project name');
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
          name: projectForm.name.trim(),
          description: projectForm.description?.trim() || '',
          language: projectForm.language
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create project');
      }
      
      if (data.success) {
        await fetchProjects();
        setShowProjectModal(false);
        setProjectForm({ name: '', description: '', language: 'javascript' });
        toast.success(`Project "${data.data.name}" created successfully!`);
        
        // Navigate to the new project
        navigate(`/projects/${data.data._id}`);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error.message || 'Failed to create project');
    }
  };
  
  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    
    try {
      toast.loading('Deleting project...');
      
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
        toast.success('Project deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };
  
  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const openProjectMenu = (projectId) => {
    <ProjectMenuModal />
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };
  
  const getProjectSize = (size) => {
    if (!size) return '0 KB';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };
  
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
      
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`} style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header className={`sticky top-0 z-30 border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <Folder className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h1 className="font-bold text-lg">My Projects</h1>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {projects.length} projects • {filteredProjects.length} filtered
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Search Bar - Desktop */}
                {!isMobile && (
                  <div className="relative w-64">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input
                      type="search"
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                )}
                
                {/* View Toggle */}
                <div className={`flex rounded-lg border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                
                {/* New Project Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProjectModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  {!isMobile && <span>New Project</span>}
                </motion.button>
              </div>
            </div>
            
            {/* Mobile Search Bar */}
            {isMobile && (
              <div className="mt-4">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                  <input
                    type="search"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Language Filter */}
          <div className="px-4 py-2 border-t overflow-x-auto">
            <div className="flex space-x-2 min-w-max">
              {languages.map((lang) => {
                const Icon = lang.icon;
                return (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                      selectedLanguage === lang.id
                        ? theme === 'dark'
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-100 text-blue-700'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {typeof Icon === 'function' ? (
                      <Icon className="w-3 h-3" />
                    ) : (
                      React.createElement(Icon, { className: "w-3 h-3" })
                    )}
                    <span>{lang.name}</span>
                    {lang.count > 0 && (
                      <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                        selectedLanguage === lang.id
                          ? theme === 'dark' ? 'bg-blue-500' : 'bg-blue-200'
                          : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                      }`}>
                        {lang.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="p-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <Folder className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {searchQuery || selectedLanguage !== 'all' 
                  ? 'No projects match your search criteria. Try adjusting your filters.'
                  : 'Create your first project to start coding in the cloud.'}
              </p>
              <button
                onClick={() => setShowProjectModal(true)}
                className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Create New Project
              </button>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProjects.map((project) => {
                    const lang = languages.find(l => l.id === project.language);
                    const Icon = lang?.icon || Code;
                    return (
                      <motion.div
                        key={project._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5 }}
                        onClick={() => handleProjectClick(project._id)}
                        className={`rounded-xl border cursor-pointer overflow-hidden ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                              {typeof Icon === 'function' ? (
                                <Icon className={`w-6 h-6 ${lang?.color}`} />
                              ) : (
                                React.createElement(Icon, { className: `w-6 h-6 ${lang?.color}` })
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setProjectToDelete(project);
                                  setShowDeleteModal(true);
                                }}
                                className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openProjectMenu(project._id);
                                }}
                                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <h3 className="font-semibold text-lg mb-2 truncate">{project.name}</h3>
                          <p className={`text-sm mb-3 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {project.description || 'No description'}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                              {lang?.name || project.language}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className={`flex items-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(project.updatedAt || project.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`px-4 py-3 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-100 bg-gray-50'}`}>
                          <div className="flex items-center justify-between text-sm">
                            <span className={`flex items-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              <FileText className="w-3 h-3 mr-1" />
                              {project.fileCount || 0} files
                            </span>
                            <span className={`flex items-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              <HardDrive className="w-3 h-3 mr-1" />
                              {getProjectSize(project.size)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                /* List View */
                <div className={`rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  {filteredProjects.map((project, index) => {
                    const lang = languages.find(l => l.id === project.language);
                    const Icon = lang?.icon || Code;
                    return (
                      <motion.div
                        key={project._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleProjectClick(project._id)}
                        className={`flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 ${
                          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <div className={`p-3 rounded-lg mr-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            {typeof Icon === 'function' ? (
                              <Icon className={`w-5 h-5 ${lang?.color}`} />
                            ) : (
                              React.createElement(Icon, { className: `w-5 h-5 ${lang?.color}` })
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="font-semibold truncate">{project.name}</h3>
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {lang?.name || project.language}
                              </span>
                            </div>
                            <p className={`text-sm truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {project.description || 'No description'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="hidden md:flex items-center space-x-6 mr-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">{project.fileCount || 0} files</div>
                            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {getProjectSize(project.size)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm flex items-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(project.updatedAt || project.createdAt)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setProjectToDelete(project);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </main>
      </div>
      
      {/* Project Modal */}
      <ProjectModal 
        show={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        projectForm={projectForm}
        setProjectForm={setProjectForm}
        onSubmit={handleCreateProject}
        theme={theme}
        languages={languages}
      />
      
      {/* Delete Modal */}
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteProject}
        item={projectToDelete}
        theme={theme}
      />
    </>
  );
};

// Project Editor Component
const ProjectEditor = () => {
  const { API_URL, token } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { projectId } = useParams();
  
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState({
    project: true,
    files: false,
    execution: false,
    saving: false
  });
  const [showFileModal, setShowFileModal] = useState(false);
  const [showDeleteFileModal, setShowDeleteFileModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showFilesSidebar, setShowFilesSidebar] = useState(true);
  const [showOutput, setShowOutput] = useState(true);
  const [editorLanguage, setEditorLanguage] = useState('javascript');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);

  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [outputHeight, setOutputHeight] = useState(200);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingOutput, setIsResizingOutput] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizingSidebar) {
        const newWidth = e.clientX;
        if (newWidth > 200 && newWidth < 600) {
          setSidebarWidth(newWidth);
        }
      }
      
      if (isResizingOutput) {
        const newHeight = window.innerHeight - e.clientY;
        if (newHeight > 100 && newHeight < 500) {
          setOutputHeight(newHeight);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
      setIsResizingOutput(false);
    };

    if (isResizingSidebar || isResizingOutput) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isResizingSidebar ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizingSidebar, isResizingOutput]);

  
  const [fileForm, setFileForm] = useState({
    name: '',
    type: 'js'
  });
  
  const fileTypes = [
    { id: 'js', name: 'JavaScript', extension: '.js', monacoLang: 'javascript', icon: FaJs, color: 'text-yellow-500', pistonLang: 'javascript' },
    { id: 'py', name: 'Python', extension: '.py', monacoLang: 'python', icon: FaPython, color: 'text-blue-500', pistonLang: 'python' },
    { id: 'java', name: 'Java', extension: '.java', monacoLang: 'java', icon: FaJava, color: 'text-red-500', pistonLang: 'java' },
    { id: 'html', name: 'HTML', extension: '.html', monacoLang: 'html', icon: FaHtml5, color: 'text-orange-500', pistonLang: 'html' },
    { id: 'css', name: 'CSS', extension: '.css', monacoLang: 'css', icon: FaCss3Alt, color: 'text-blue-600', pistonLang: 'css' },
    { id: 'ts', name: 'TypeScript', extension: '.ts', monacoLang: 'typescript', icon: SiTypescript, color: 'text-blue-400', pistonLang: 'typescript' },
    { id: 'cpp', name: 'C++', extension: '.cpp', monacoLang: 'cpp', icon: SiCplusplus, color: 'text-pink-500', pistonLang: 'cpp' },
    { id: 'c', name: 'C', extension: '.c', monacoLang: 'c', icon: SiC, color: 'text-indigo-500', pistonLang: 'c' },
  ];
  
  // Language to Piston API mapping
  const languageToPiston = {
    'js': 'javascript',
    'javascript': 'javascript',
    'py': 'python',
    'python': 'python',
    'java': 'java',
    'html': 'html',
    'css': 'css',
    'ts': 'typescript',
    'typescript': 'typescript',
    'cpp': 'cpp',
    'c': 'c'
  };
  
  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setShowFilesSidebar(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Fetch project data
  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);
  
  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  // Add smooth scrolling behavior
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      * {
        scroll-behavior: smooth;
      }
      .output-panel {
        scroll-behavior: smooth;
      }
      .files-sidebar {
        scroll-behavior: smooth;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  const fetchProjectData = async () => {
    try {
      setLoading(prev => ({ ...prev, project: true }));
      
      // Fetch project details
      const response = await fetch(`${API_URL}/projects/project/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch project');
      
      const data = await response.json();
      if (data.success) {
        setProject(data.data);
        await fetchProjectFiles();
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(prev => ({ ...prev, project: false }));
    }
  };
  
  const fetchProjectFiles = async () => {
    try {
      setLoading(prev => ({ ...prev, files: true }));
      
      // Fetch files from API
      const response = await fetch(`${API_URL}/projects/project/${projectId}/get-files`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch project files');
      
      const data = await response.json();
      if (data.success) {
        setFiles(data.data || []);
        if (data.data && data.data.length > 0) {
          selectFile(data.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to load project files');
    } finally {
      setLoading(prev => ({ ...prev, files: false }));
    }
  };

  const handleCreateFile = async () => {
    if (!fileForm.name.trim()) {
      toast.error('Please enter a file name');
      return;
    }
    try {
      setLoading(prev => ({ ...prev, files: true }));
      // Create file API call
      const response = await fetch(`${API_URL}/projects/project/${projectId}/create-file`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fileForm.name.trim(),
          type: fileForm.type,
          content: ''
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create file');
      }
      if (data.success) {
        setFiles(prev => [...prev, data.data]);
        setShowFileModal(false);
        setFileForm({ name: '', type: 'js' });
        toast.success(`File "${data.data.name}" created successfully!`);
        selectFile(data.data);
      }
    } catch (error) {
      console.error('Error creating file:', error);
      toast.error(error.message || 'Failed to create file');
    } finally {
      setLoading(prev => ({ ...prev, files: false }));
    }
  };
  
  const handleDeleteFile = async () => {
    if (!fileToDelete) return;
    
    try {
      setFiles(prev => prev.filter(f => f._id !== fileToDelete._id));
      
      // If we're deleting the current file, clear the editor
      if (currentFile?._id === fileToDelete._id) {
        setCurrentFile(null);
        setCode('');
      }
      
      setShowDeleteFileModal(false);
      setFileToDelete(null);
      toast.success('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };
  
  const handleSaveCode = async () => {
    if (!currentFile) return;
    
    try {
      setLoading(prev => ({ ...prev, saving: true }));
      
      // Mock save API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update file content in state
      setFiles(prev => prev.map(file => 
        file._id === currentFile._id 
          ? { ...file, content: code }
          : file
      ));
      
      toast.success('File saved successfully!');
    } catch (error) {
      console.error('Error saving file:', error);
      toast.error('Failed to save file');
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  };
  
  const handleRunCode = async () => {
    if (!project || !code) {
      toast.error('No code to execute');
      return;
    }
    
    try {
      const startTime = performance.now();
      setLoading(prev => ({ ...prev, execution: true }));
      setOutput('');
      setShowOutput(true);
      
      // Determine language for Piston API
      const fileType = fileTypes.find(t => t.id === currentFile?.type);
      const language = fileType?.pistonLang || 'javascript';
      
      // Prepare code for execution
      let codeToExecute = code;
      
      // Handle different language requirements
      if (language === 'java') {
        // Extract class name from Java code
        const classNameMatch = code.match(/class\s+(\w+)/);
        const className = classNameMatch ? classNameMatch[1] : 'Main';
        codeToExecute = code;
      }
      
      // Execute code using Piston API
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: language,
          version: getLanguageVersion(language),
          files: [
            {
              name: currentFile?.name || 'main',
              content: codeToExecute
            }
          ],
          stdin: '',
          args: [],
          compile_timeout: 10000,
          run_timeout: 5000,
          compile_memory_limit: -1,
          run_memory_limit: -1
        }),
      });
      
      if (!response.ok) throw new Error('Failed to execute code');
      
      const result = await response.json();
      const endTime = performance.now();
      const executionTimeMs = endTime - startTime;
      setExecutionTime(executionTimeMs);
      
      // Format the output
      let formattedOutput = '';
      
      if (result.compile && result.compile.code !== 0) {
        // Compilation error
        formattedOutput = `💥 Compilation Error:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${result.compile.output}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n❌ Compilation failed with code ${result.compile.code}`;
      } else if (result.run && result.run.code !== 0) {
        // Runtime error
        formattedOutput = `💥 Runtime Error:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${result.run.output || 'No output'}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n❌ Execution failed with code ${result.run.code}`;
      } else if (result.run) {
        // Successful execution
        formattedOutput = `✅ Execution Successful!\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${result.run.output || '(No output)'}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n⏰ Time: ${executionTimeMs.toFixed(2)}ms\n📊 Exit Code: ${result.run.code}\n`;
        
        if (result.run.signal) {
          formattedOutput += `🚨 Signal: ${result.run.signal}\n`;
        }
        
        if (result.compile && result.compile.output) {
          formattedOutput += `🔧 Compilation: ${result.compile.output}\n`;
        }
      } else {
        formattedOutput = '❌ Unknown execution error';
      }
      
      setOutput(formattedOutput);
      
      // Scroll to output panel
      setTimeout(() => {
        const outputPanel = document.querySelector('.output-panel');
        if (outputPanel) {
          outputPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
      
      toast.success('Code executed successfully!');
    } catch (error) {
      console.error('Error executing code:', error);
      setOutput(`❌ Execution Failed!\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nError: ${error.message}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCheck your code and try again.`);
      toast.error('Failed to execute code');
    } finally {
      setLoading(prev => ({ ...prev, execution: false }));
    }
  };
  
  const getLanguageVersion = (language) => {
    const versions = {
      'javascript': '18.15.0',
      'python': '3.10.0',
      'java': '15.0.2',
      'cpp': '10.2.0',
      'c': '10.2.0',
      'typescript': '5.0.3',
      'html': '5.0.0',
      'css': '3.0.0'
    };
    return versions[language] || 'latest';
  };
  
  const getDefaultCode = (type) => {
    const defaults = {
      js: '// Welcome to your JavaScript file!\nconsole.log("Hello, World!");\n\n// Start coding here...',
      py: '# Welcome to your Python file!\nprint("Hello, World!")\n\n# Start coding here...',
      java: '// Welcome to your Java file!\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
      html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>',
      css: '/* Welcome to your CSS file! */\nbody {\n    margin: 0;\n    padding: 0;\n    font-family: Arial, sans-serif;\n}',
      ts: '// Welcome to your TypeScript file!\nconsole.log("Hello, World!");\n\n// Start coding here...',
      cpp: '// Welcome to your C++ file!\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
      c: '// Welcome to your C file!\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}'
    };
    
    return defaults[type] || '// Start coding here...';
  };
  
  const selectFile = (file) => {
    setCurrentFile(file);
    setCode(file.content || getDefaultCode(file.type));
    const fileType = fileTypes.find(t => t.id === file.type);
    setEditorLanguage(fileType?.monacoLang || 'javascript');
    if (isMobile) setShowFilesSidebar(false);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  
  const downloadFile = () => {
    if (!currentFile) return;
    
    try {
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${currentFile.name}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };
  
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
      
      <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} overflow-hidden`} style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header className={`sticky top-0 z-10 border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Left side */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/projects')}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Back to projects"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <Folder className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h1 className="font-semibold truncate max-w-xs">
                      {loading.project ? 'Loading...' : project?.name || 'Unknown Project'}
                    </h1>
                    <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {project?.description || 'No description'} • {files.length} files
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Center actions */}
              {!isMobile && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRunCode}
                    disabled={loading.execution}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm disabled:opacity-50"
                  >
                    {loading.execution ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    <span>Run</span>
                  </button>
                  <button
                    onClick={handleSaveCode}
                    disabled={loading.saving}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-50"
                  >
                    {loading.saving ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setShowFileModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New File</span>
                  </button>
                </div>
              )}
              
              {/* Right side */}
              <div className="flex items-center space-x-2">
                {isMobile && (
                  <button
                    onClick={() => setShowFilesSidebar(!showFilesSidebar)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                )}
                
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-5 h-5" />
                  ) : (
                    <Maximize2 className="w-5 h-5" />
                  )}
                </button>
                
                {isMobile && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleRunCode}
                      disabled={loading.execution}
                      className="p-2 rounded-lg bg-green-600 text-white disabled:opacity-50"
                      title="Run"
                    >
                      {loading.execution ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => setShowFileModal(true)}
                      className="p-2 rounded-lg bg-purple-600 text-white"
                      title="New File"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Current file info */}
          {currentFile && (
            <div className={`px-4 py-2 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileCode className="w-4 h-4" />
                  <span className="font-medium truncate">{currentFile.name}</span>
                  <span className={`text-xs px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    {currentFile.type.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={downloadFile}
                    className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Download file"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Copy code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>
        
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Files Sidebar */}
          <AnimatePresence>
            {showFilesSidebar && (
              <>
                {isMobile && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-20"
                    onClick={() => setShowFilesSidebar(false)}
                  />
                )}
                <motion.div
                  initial={{ x: isMobile ? -300 : 0 }}
                  animate={{ x: 0 }}
                  exit={{ x: isMobile ? -300 : 0 }}
                  className={`${isMobile ? 'fixed top-0 left-0 bottom-0 z-40' : 'relative'} files-sidebar ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } border-r flex flex-col`}
                  style={{ width: isMobile ? '80vw' : sidebarWidth }}
                >
                  <div className="p-4 border-b flex items-center justify-between shrink-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold">Project Files</h3>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {files.length}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isMobile && (
                        <button
                          onClick={() => setShowFilesSidebar(false)}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4">
                    {loading.files ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      </div>
                    ) : files.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No files yet</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {files.map((file) => {
                          const fileType = fileTypes.find(t => t.id === file.type);
                          const Icon = fileType?.icon || FileText;
                          return (
                            <motion.button
                              key={file._id}
                              whileHover={{ x: 4 }}
                              onClick={() => selectFile(file)}
                              className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between group ${
                                currentFile?._id === file._id
                                  ? theme === 'dark'
                                    ? 'bg-blue-900/30 text-white'
                                    : 'bg-blue-50 text-blue-700'
                                  : theme === 'dark'
                                    ? 'hover:bg-gray-700 text-gray-300'
                                    : 'hover:bg-gray-100 text-gray-700'
                              }`}
                            >
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                {typeof Icon === 'function' ? (
                                  <Icon className={`w-4 h-4 ${fileType?.color}`} />
                                ) : (
                                  React.createElement(Icon, { className: `w-4 h-4 ${fileType?.color}` })
                                )}
                                <span className="truncate">{file.name}</span>
                              </div>
                              
                              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Download file
                                    const blob = new Blob([file.content || ''], { type: 'text/plain' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = file.name;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                    URL.revokeObjectURL(url);
                                    toast.success(`Downloaded ${file.name}`);
                                  }}
                                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                                  title="Download"
                                >
                                  <Download className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFileToDelete(file);
                                    setShowDeleteFileModal(true);
                                  }}
                                  className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
                 {!isMobile && (
                  <div
                    className="absolute top-0 right-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500 active:bg-blue-600 transition-colors"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setIsResizingSidebar(true);
                    }}
                  />
                )}
              </>
            )}
          </AnimatePresence>
          
          {/* Editor Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {!currentFile ? (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                  <Code className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No File Selected</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Select a file from the sidebar or create a new one to start coding
                  </p>
                  <button
                    onClick={() => setShowFileModal(true)}
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Create New File
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Monaco Editor */}
                <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-auto">
                  <Editor
                    height="100%"
                    language={editorLanguage}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                    options={{
                      minimap: { enabled: !isMobile },
                      fontSize: isMobile ? 14 : 16,
                      wordWrap: 'on',
                      automaticLayout: true,
                      formatOnPaste: true,
                      formatOnType: true,
                      scrollBeyondLastLine: true,
                      lineNumbers: isMobile ? 'off' : 'on',
                      glyphMargin: !isMobile,
                      folding: !isMobile,
                      lineDecorationsWidth: isMobile ? 5 : 10,
                      renderLineHighlight: isMobile ? 'none' : 'all',
                      tabSize: 2,
                      insertSpaces: true,
                      autoIndent: 'full',
                      renderWhitespace: isMobile ? 'none' : 'boundary',
                      rulers: isMobile ? [] : [80, 120],
                      scrollbar: {
                        vertical: 'visible',
                        horizontal: 'visible'
                      }
                    }}
                  />
                </div>
              </div>
                
                {/* Output Panel */}
                <AnimatePresence>
                  {showOutput && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: isMobile ? '200px' : outputHeight }}
                      exit={{ height: 0 }}
                      className={`border-t overflow-hidden output-panel relative ${
                        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                      }`}
                    >
                    <div
                      className="absolute top-0 left-0 right-0 h-2 cursor-row-resize hover:bg-blue-500 active:bg-blue-600 transition-colors"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setIsResizingOutput(true);
                      }}
                    />
                      <div className={`px-4 py-2 border-b flex items-center justify-between ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      }`} style={{ marginTop: '2px' }}>
                        <div className="flex items-center space-x-2">
                          <Terminal className="w-4 h-4" />
                          <span className="font-medium">Output</span>
                          {loading.execution && (
                            <div className="flex items-center space-x-1 text-sm text-blue-500">
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Executing...</span>
                            </div>
                          )}
                          {executionTime > 0 && !loading.execution && (
                            <span className={`text-xs px-2 py-1 rounded ${
                              theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {executionTime.toFixed(2)}ms
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setOutput('')}
                            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Clear output"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="h-full overflow-auto p-4 font-mono text-sm whitespace-pre-wrap">
                        {output ? (
                          <pre className={output.includes('❌') || output.includes('💥') ? 'text-red-500' : 'text-green-500'}>
                            {output}
                          </pre>
                        ) : (
                          <span className="text-gray-500">Output will appear here after execution...</span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* File Modal */}
      <FileModal
        show={showFileModal}
        onClose={() => setShowFileModal(false)}
        fileForm={fileForm}
        setFileForm={setFileForm}
        onSubmit={handleCreateFile}
        theme={theme}
        fileTypes={fileTypes}
      />
      
      {/* Delete File Modal */}
      <DeleteModal
        show={showDeleteFileModal}
        onClose={() => setShowDeleteFileModal(false)}
        onConfirm={handleDeleteFile}
        item={fileToDelete}
        theme={theme}
        type="file"
      />
    </>
  );
};

// Reusable Modal Components
const ProjectModal = ({ show, onClose, projectForm, setProjectForm, onSubmit, theme, languages }) => {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`rounded-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border shadow-2xl`}>
              <div className="flex items-center justify-between p-4 border-b shrink-0">
                <h3 className="text-lg font-semibold">Create New Project</h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={projectForm.name}
                      onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                      placeholder="My Awesome Project"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                      placeholder="Project description"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
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
                    <div className="grid grid-cols-3 gap-2">
                      {languages.slice(1).map((lang) => {
                        const Icon = lang.icon;
                        return (
                          <button
                            key={lang.id}
                            type="button"
                            onClick={() => setProjectForm({...projectForm, language: lang.id})}
                            className={`p-3 border rounded-lg flex flex-col items-center justify-center ${
                              projectForm.language === lang.id 
                                ? 'ring-2 border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-blue-500' 
                                : theme === 'dark'
                                  ? 'border-gray-700 hover:border-gray-600 bg-gray-700/50'
                                  : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${lang.color} mb-2`}>
                              {typeof Icon === 'function' ? (
                                <Icon className="w-4 h-4 text-white" />
                              ) : (
                                React.createElement(Icon, { className: "w-4 h-4 text-white" })
                              )}
                            </div>
                            <span className="text-xs font-medium">{lang.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t p-4 shrink-0">
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className={`flex-1 px-4 py-2 border rounded-lg ${
                      theme === 'dark' 
                        ? 'border-gray-600 hover:bg-gray-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onSubmit}
                    className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity"
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
  );
};

const FileModal = ({ show, onClose, fileForm, setFileForm, onSubmit, theme, fileTypes }) => {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`rounded-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border shadow-2xl`}>
              <div className="flex items-center justify-between p-4 border-b shrink-0">
                <h3 className="text-lg font-semibold">Create New File</h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      File Name
                    </label>
                    <input
                      type="text"
                      value={fileForm.name}
                      onChange={(e) => setFileForm({...fileForm, name: e.target.value})}
                      placeholder="main"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      File Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {fileTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setFileForm({...fileForm, type: type.id})}
                            className={`p-3 border rounded-lg flex flex-col items-center justify-center ${
                              fileForm.type === type.id 
                                ? 'ring-2 border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-blue-500' 
                                : theme === 'dark'
                                  ? 'border-gray-700 hover:border-gray-600 bg-gray-700/50'
                                  : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2`}>
                              {typeof Icon === 'function' ? (
                                <Icon className={`w-4 h-4 ${type.color}`} />
                              ) : (
                                React.createElement(Icon, { className: `w-4 h-4 ${type.color}` })
                              )}
                            </div>
                            <span className="text-xs font-medium">{type.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t p-4 shrink-0">
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className={`flex-1 px-4 py-2 border rounded-lg ${
                      theme === 'dark' 
                        ? 'border-gray-600 hover:bg-gray-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onSubmit}
                    className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Create File
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const DeleteModal = ({ show, onClose, onConfirm, item, theme, type = 'project' }) => {
  if (!item) return null;
  
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`rounded-xl max-w-md w-full flex flex-col ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border shadow-2xl`}>
              <div className="flex items-center justify-between p-4 border-b shrink-0">
                <h3 className="text-lg font-semibold">
                  Delete {type === 'file' ? 'File' : 'Project'}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50'
                  } mb-4`}>
                    <Trash2 className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="font-semibold text-lg mb-1">"{item.name}"</p>
                  <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    This action cannot be undone. All {type === 'file' ? 'file content' : 'files and data'} will be permanently deleted.
                  </p>
                </div>
              </div>
              
              <div className="border-t p-4 shrink-0">
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className={`flex-1 px-4 py-2 border rounded-lg ${
                      theme === 'dark' 
                        ? 'border-gray-600 hover:bg-gray-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Delete {type === 'file' ? 'File' : 'Project'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Projects;