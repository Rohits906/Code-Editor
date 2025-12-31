import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, 
  FileText, 
  Play, 
  Edit, 
  Trash2, 
  Download, 
  Upload, 
  Share2, 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Star,
  Users,
  Code,
  Terminal,
  X,
  Save,
  Copy,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  RefreshCw,
  FolderPlus,
  FilePlus,
  FolderTree,
  GitBranch,
  History,
  Settings,
  MoreVertical,
  Check,
  AlertCircle,
  Zap,
  Cpu
} from 'lucide-react';
import { FaPython, FaJs, FaJava, FaHtml5, FaCss3Alt, FaReact } from 'react-icons/fa';
import { SiTypescript, SiCplusplus, SiC } from 'react-icons/si';

const Projects = () => {
  const { API_URL, user, token } = useAuth();
  const { theme } = useTheme();
  
  // State for projects and files
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState({
    projects: true,
    files: false,
    execution: false
  });
  
  // Modal states
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  
  // Form states
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    language: 'javascript'
  });
  const [fileForm, setFileForm] = useState({
    name: '',
    type: 'js'
  });
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Languages supported
  const languages = [
    { id: 'all', name: 'All Languages', icon: Code, color: 'bg-gray-500' },
    { id: 'javascript', name: 'JavaScript', icon: FaJs, color: 'bg-yellow-500' },
    { id: 'python', name: 'Python', icon: FaPython, color: 'bg-blue-500' },
    { id: 'java', name: 'Java', icon: FaJava, color: 'bg-red-500' },
    { id: 'cpp', name: 'C++', icon: SiCplusplus, color: 'bg-purple-500' },
    { id: 'c', name: 'C', icon: SiC, color: 'bg-gray-600' },
    { id: 'html', name: 'HTML', icon: FaHtml5, color: 'bg-orange-500' },
    { id: 'css', name: 'CSS', icon: FaCss3Alt, color: 'bg-blue-600' },
    { id: 'typescript', name: 'TypeScript', icon: SiTypescript, color: 'bg-blue-400' },
    { id: 'react', name: 'React', icon: FaReact, color: 'bg-cyan-500' }
  ];
  
  // File types
  const fileTypes = [
    { id: 'js', name: 'JavaScript', extension: '.js', icon: FaJs, color: 'text-yellow-500' },
    { id: 'py', name: 'Python', extension: '.py', icon: FaPython, color: 'text-blue-500' },
    { id: 'java', name: 'Java', extension: '.java', icon: FaJava, color: 'text-red-500' },
    { id: 'cpp', name: 'C++', extension: '.cpp', icon: SiCplusplus, color: 'text-purple-500' },
    { id: 'c', name: 'C', extension: '.c', icon: SiC, color: 'text-gray-600' },
    { id: 'html', name: 'HTML', extension: '.html', icon: FaHtml5, color: 'text-orange-500' },
    { id: 'css', name: 'CSS', extension: '.css', icon: FaCss3Alt, color: 'text-blue-600' },
    { id: 'ts', name: 'TypeScript', extension: '.ts', icon: SiTypescript, color: 'text-blue-400' },
    { id: 'jsx', name: 'React', extension: '.jsx', icon: FaReact, color: 'text-cyan-500' },
    { id: 'txt', name: 'Text', extension: '.txt', icon: FileText, color: 'text-gray-500' },
    { id: 'json', name: 'JSON', extension: '.json', icon: FileText, color: 'text-green-500' }
  ];

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects when search or language changes
  useEffect(() => {
    let filtered = projects;
    
    if (searchQuery) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(project => project.language === selectedLanguage);
    }
    
    setFilteredProjects(filtered);
  }, [projects, searchQuery, selectedLanguage]);

  const fetchProjects = async () => {
    try {
      setLoading(prev => ({ ...prev, projects: true }));
      const response = await fetch(`${API_URL}/projects/project`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch projects');

      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
        setFilteredProjects(data.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(prev => ({ ...prev, projects: false }));
    }
  };

  const fetchProjectFiles = async (projectId) => {
    if (!projectId) return;
    
    try {
      setLoading(prev => ({ ...prev, files: true }));
      // This endpoint would need to be created in your backend
      const response = await fetch(`${API_URL}/projects/${projectId}/files`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch files');

      const data = await response.json();
      if (data.success) {
        setFiles(data.data);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to load project files');
    } finally {
      setLoading(prev => ({ ...prev, files: false }));
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
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error.message || 'Failed to create project');
    }
  };

  const handleEditProject = async (project) => {
    if (!projectForm.name.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    try {
      toast.loading('Updating project...');
      
      const response = await fetch(`${API_URL}/projects/project/${project._id}`, {
        method: 'PUT',
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
        throw new Error(data.message || 'Failed to update project');
      }
      
      if (data.success) {
        await fetchProjects();
        setShowProjectModal(false);
        setProjectForm({ name: '', description: '', language: 'javascript' });
        toast.success(`Project updated successfully!`);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error(error.message || 'Failed to update project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      toast.loading('Deleting project...');
      
      const response = await fetch(`${API_URL}/projects/project/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchProjects();
        if (currentProject?._id === projectId) {
          setCurrentProject(null);
          setCurrentFile(null);
          setCode('');
          setOutput('');
        }
        setShowDeleteModal(false);
        setItemToDelete(null);
        toast.success('Project deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleCreateFile = async () => {
    if (!fileForm.name.trim()) {
      toast.error('Please enter a file name');
      return;
    }

    if (!currentProject) {
      toast.error('Please select a project first');
      return;
    }

    try {
      const fileType = fileTypes.find(t => t.id === fileForm.type);
      const fileName = fileForm.name.endsWith(fileType.extension) 
        ? fileForm.name 
        : `${fileForm.name}${fileType.extension}`;

      // This endpoint would need to be created in your backend
      const response = await fetch(`${API_URL}/projects/${currentProject._id}/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fileName,
          type: fileForm.type,
          content: getDefaultCode(fileForm.type)
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchProjectFiles(currentProject._id);
        setShowFileModal(false);
        setFileForm({ name: '', type: 'js' });
        toast.success(`File "${fileName}" created successfully!`);
      }
    } catch (error) {
      console.error('Error creating file:', error);
      toast.error('Failed to create file');
    }
  };

  const handleSaveCode = async () => {
    if (!currentFile) return;
    
    try {
      toast.loading('Saving file...');
      
      // This endpoint would need to be created in your backend
      const response = await fetch(`${API_URL}/files/${currentFile._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: code }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('File saved successfully!');
      }
    } catch (error) {
      console.error('Error saving file:', error);
      toast.error('Failed to save file');
    }
  };

  const handleRunCode = async () => {
    if (!currentProject || !code) {
      toast.error('No code to execute');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, execution: true }));
      setOutput('');
      setShowOutput(true);
      
      const response = await fetch(`${API_URL}/execute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: currentProject._id,
          language: currentProject.language,
          code: code
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setOutput(data.output || 'Execution completed successfully!');
        toast.success('Code executed successfully!');
      } else {
        setOutput(data.error || 'Execution failed');
        toast.error('Execution failed');
      }
    } catch (error) {
      console.error('Error executing code:', error);
      setOutput('Error: ' + error.message);
      toast.error('Failed to execute code');
    } finally {
      setLoading(prev => ({ ...prev, execution: false }));
    }
  };

  const getDefaultCode = (type) => {
    const defaults = {
      js: '// Welcome to your JavaScript file!\nconsole.log("Hello, World!");\n\n// Start coding here...',
      py: '# Welcome to your Python file!\nprint("Hello, World!")\n\n# Start coding here...',
      java: '// Welcome to your Java file!\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
      cpp: '// Welcome to your C++ file!\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
      c: '// Welcome to your C file!\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
      html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>',
      css: '/* Welcome to your CSS file! */\nbody {\n    margin: 0;\n    padding: 0;\n    font-family: Arial, sans-serif;\n}',
      ts: '// Welcome to your TypeScript file!\nconsole.log("Hello, World!");\n\n// Start coding here...',
      jsx: '// Welcome to your React file!\nimport React from "react";\n\nfunction App() {\n  return (\n    <div>\n      <h1>Hello, World!</h1>\n    </div>\n  );\n}\n\nexport default App;',
      txt: 'Welcome to your text file!\n\nStart writing here...',
      json: '{\n  "message": "Welcome to your JSON file!"\n}'
    };
    
    return defaults[type] || '// Start coding here...';
  };

  const openProjectModal = (mode = 'create', project = null) => {
    if (project) {
      setProjectForm({
        name: project.name,
        description: project.description || '',
        language: project.language
      });
    } else {
      setProjectForm({ name: '', description: '', language: 'javascript' });
    }
    setModalMode(mode);
    setShowProjectModal(true);
  };

  const openDeleteModal = (item, type = 'project') => {
    setItemToDelete({ ...item, type });
    setShowDeleteModal(true);
  };

  const selectProject = async (project) => {
    setCurrentProject(project);
    setCurrentFile(null);
    setCode('');
    setOutput('');
    await fetchProjectFiles(project._id);
  };

  const selectFile = async (file) => {
    setCurrentFile(file);
    // Fetch file content from backend
    try {
      const response = await fetch(`${API_URL}/files/${file._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCode(data.content || '');
      }
    } catch (error) {
      console.error('Error fetching file content:', error);
      setCode('// Error loading file content');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

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

      <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header */}
        <header className={`sticky top-0 z-20 border-b px-6 py-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Projects</h1>
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                <input
                  type="search"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openProjectModal('create')}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </motion.button>
              
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {isSidebarOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Projects List */}
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className={`w-80 border-r flex flex-col ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              {/* Language Filter */}
              <div className="p-4 border-b">
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => {
                    const Icon = lang.icon;
                    return (
                      <motion.button
                        key={lang.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedLanguage(lang.id)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center space-x-2 ${
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
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Projects List */}
              <div className="flex-1 overflow-y-auto p-4">
                {loading.projects ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="text-center py-12">
                    <Folder className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No projects found</p>
                    <button
                      onClick={() => openProjectModal('create')}
                      className="mt-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium"
                    >
                      Create your first project
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredProjects.map((project) => {
                      const lang = languages.find(l => l.id === project.language);
                      const Icon = lang?.icon || Code;
                      return (
                        <motion.div
                          key={project._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => selectProject(project)}
                          className={`p-4 rounded-xl cursor-pointer border transition-all ${
                            currentProject?._id === project._id
                              ? theme === 'dark'
                                ? 'bg-blue-900/30 border-blue-700'
                                : 'bg-blue-50 border-blue-300'
                              : theme === 'dark'
                                ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                {typeof Icon === 'function' ? (
                                  <Icon className={`w-5 h-5 ${lang?.color}`} />
                                ) : (
                                  React.createElement(Icon, { className: `w-5 h-5 ${lang?.color}` })
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold">{project.name}</h3>
                                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {project.description || 'No description'}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openProjectModal('edit', project);
                                }}
                                className={`p-1.5 rounded-lg ${
                                  theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                                }`}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteModal(project, 'project');
                                }}
                                className={`p-1.5 rounded-lg ${
                                  theme === 'dark' ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-600'
                                }`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center mt-4 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {project.language}
                            </span>
                            <Clock className={`w-3 h-3 ml-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                            <span className={`ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {new Date(project.lastModified).toLocaleDateString()}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {currentProject ? (
              <>
                {/* Editor Header */}
                <div className={`border-b px-6 py-3 flex items-center justify-between ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center space-x-4">
                    <div>
                      <h2 className="font-semibold text-lg">{currentProject.name}</h2>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {currentProject.description || 'No description'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowFileModal(true)}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm"
                      >
                        <FilePlus className="w-4 h-4" />
                        <span>New File</span>
                      </button>
                      <button
                        onClick={handleRunCode}
                        disabled={loading.execution}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-50"
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
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={copyToClipboard}
                      className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowOutput(!showOutput)}
                      className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      {showOutput ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Files Sidebar and Editor */}
                <div className="flex-1 flex overflow-hidden">
                  {/* Files Sidebar */}
                  <div className={`w-60 border-r ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Files</h3>
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {files.length} files
                        </span>
                      </div>
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
                                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between ${
                                  currentFile?._id === file._id
                                    ? theme === 'dark'
                                      ? 'bg-blue-900/30 text-white'
                                      : 'bg-blue-50 text-blue-700'
                                    : theme === 'dark'
                                      ? 'hover:bg-gray-700 text-gray-300'
                                      : 'hover:bg-gray-100 text-gray-700'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  {typeof Icon === 'function' ? (
                                    <Icon className={`w-4 h-4 ${fileType?.color}`} />
                                  ) : (
                                    React.createElement(Icon, { className: `w-4 h-4 ${fileType?.color}` })
                                  )}
                                  <span className="truncate">{file.name}</span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDeleteModal(file, 'file');
                                  }}
                                  className={`p-1 rounded ${
                                    theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                                  }`}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </motion.button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Code Editor */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1 relative">
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className={`w-full h-full p-6 font-mono text-sm resize-none focus:outline-none ${
                          theme === 'dark' 
                            ? 'bg-gray-900 text-gray-100' 
                            : 'bg-white text-gray-900'
                        }`}
                        placeholder="Start coding here..."
                        spellCheck="false"
                      />
                    </div>

                    {/* Output Panel */}
                    {showOutput && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: '200px' }}
                        className={`border-t ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                      >
                        <div className={`px-4 py-2 border-b flex items-center justify-between ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                          <div className="flex items-center space-x-2">
                            <Terminal className="w-4 h-4" />
                            <span className="font-medium">Output</span>
                          </div>
                          <button
                            onClick={() => setOutput('')}
                            className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="h-36 overflow-auto p-4 font-mono text-sm whitespace-pre-wrap">
                          {loading.execution ? (
                            <div className="flex items-center space-x-2">
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Executing...</span>
                            </div>
                          ) : output ? (
                            <pre className={output.includes('Error') ? 'text-red-500' : 'text-green-500'}>
                              {output}
                            </pre>
                          ) : (
                            <span className="text-gray-500">Output will appear here after execution...</span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <Code className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Select a Project</h3>
                  <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Choose a project from the sidebar or create a new one to start coding
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openProjectModal('create')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-5 h-5 inline mr-2" />
                    Create New Project
                  </motion.button>
                </motion.div>
              </div>
            )}
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
              <div className={`rounded-2xl max-w-md w-full flex flex-col ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
              } border shadow-2xl`}>
                <div className="flex items-center justify-between p-6 border-b shrink-0">
                  <h3 className="text-xl font-semibold">
                    {modalMode === 'create' ? 'Create New Project' : 'Edit Project'}
                  </h3>
                  <button
                    onClick={() => setShowProjectModal(false)}
                    className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
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
                        value={projectForm.name}
                        onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                        placeholder="My Awesome Project"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                        placeholder="Project description"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
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
                        {languages.slice(1).map((lang) => {
                          const Icon = lang.icon;
                          return (
                            <motion.button
                              key={lang.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => setProjectForm({...projectForm, language: lang.id})}
                              className={`p-4 border rounded-xl flex flex-col items-center justify-center ${
                                projectForm.language === lang.id 
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
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${lang.color} mb-2`}>
                                {typeof Icon === 'function' ? (
                                  <Icon className="w-5 h-5 text-white" />
                                ) : (
                                  React.createElement(Icon, { className: "w-5 h-5 text-white" })
                                )}
                              </div>
                              <span className="text-sm font-medium">{lang.name}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t p-6 shrink-0">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowProjectModal(false)}
                      className={`flex-1 px-4 py-3 border rounded-xl ${
                        theme === 'dark' 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={modalMode === 'create' ? handleCreateProject : () => handleEditProject(projectForm)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                    >
                      {modalMode === 'create' ? 'Create Project' : 'Update Project'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* File Modal */}
      <AnimatePresence>
        {showFileModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowFileModal(false)}
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
                <div className="flex items-center justify-between p-6 border-b shrink-0">
                  <h3 className="text-xl font-semibold">Create New File</h3>
                  <button
                    onClick={() => setShowFileModal(false)}
                    className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        File Name
                      </label>
                      <input
                        type="text"
                        value={fileForm.name}
                        onChange={(e) => setFileForm({...fileForm, name: e.target.value})}
                        placeholder="my-script"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                        File Type
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {fileTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <motion.button
                              key={type.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => setFileForm({...fileForm, type: type.id})}
                              className={`p-4 border rounded-xl flex flex-col items-center justify-center ${
                                fileForm.type === type.id 
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
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${type.color}`}>
                                {typeof Icon === 'function' ? (
                                  <Icon className="w-4 h-4" />
                                ) : (
                                  React.createElement(Icon, { className: "w-4 h-4" })
                                )}
                              </div>
                              <span className="text-xs font-medium">{type.name}</span>
                              <span className="text-xs opacity-75">{type.extension}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t p-6 shrink-0">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowFileModal(false)}
                      className={`flex-1 px-4 py-3 border rounded-xl ${
                        theme === 'dark' 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateFile}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity"
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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && itemToDelete && (
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
              <div className={`rounded-2xl max-w-md w-full flex flex-col ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
              } border shadow-2xl`}>
                <div className="flex items-center justify-between p-6 border-b shrink-0">
                  <h3 className="text-xl font-semibold">
                    Delete {itemToDelete.type === 'project' ? 'Project' : 'File'}
                  </h3>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50'
                    } mb-4`}>
                      <Trash2 className="w-8 h-8 text-red-600" />
                    </div>
                    <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Are you sure you want to delete{' '}
                      <span className="font-semibold">"{itemToDelete.name}"</span>?
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      This action cannot be undone.
                    </p>
                  </div>
                </div>

                <div className="border-t p-6 shrink-0">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className={`flex-1 px-4 py-3 border rounded-xl ${
                        theme === 'dark' 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => itemToDelete.type === 'project' 
                        ? handleDeleteProject(itemToDelete._id)
                        : handleDeleteFile(itemToDelete._id)
                      }
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Delete{itemToDelete.type === 'project' ? ' Project' : ' File'}
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

export default Projects;