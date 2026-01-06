import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { 
  Folder, 
  FileText, 
  Play, 
  Save, 
  Trash2, 
  Plus, 
  Search, 
  Code,
  X,
  Copy,
  Terminal,
  RefreshCw,
  Menu,
  ChevronRight,
  Download,
  Upload,
  Share2,
  Settings,
  MoreVertical,
  Check,
  AlertCircle,
  Zap,
  Cpu,
  Clock,
  Star,
  Users,
  FilePlus,
  FolderPlus,
  GitBranch,
  History,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Filter,
  ChevronDown,
  ChevronUp,
  Edit,
  Home,
  ArrowLeft,
  User,
  Bell,
  Sun,
  Moon,
  LogOut
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
    execution: false,
    saving: false
  });
  
  // Modal states
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  
  // UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileFiles, setShowMobileFiles] = useState(false);
  const [showOutput, setShowOutput] = useState(true);
  const [editorLanguage, setEditorLanguage] = useState('javascript');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
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
  
  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setShowMobileFiles(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Languages supported
  const languages = [
    { id: 'all', name: 'All', icon: Code, color: 'bg-gray-500' },
    { id: 'javascript', name: 'JS', icon: FaJs, color: 'bg-yellow-500' },
    { id: 'python', name: 'Py', icon: FaPython, color: 'bg-blue-500' },
    { id: 'java', name: 'Java', icon: FaJava, color: 'bg-red-500' },
    { id: 'html', name: 'HTML', icon: FaHtml5, color: 'bg-orange-500' },
    { id: 'css', name: 'CSS', icon: FaCss3Alt, color: 'bg-blue-600' },
    { id: 'typescript', name: 'TS', icon: SiTypescript, color: 'bg-blue-400' }
  ];
  
  // File types with monaco editor language mapping
  const fileTypes = [
    { id: 'js', name: 'JavaScript', extension: '.js', monacoLang: 'javascript', icon: FaJs, color: 'text-yellow-500' },
    { id: 'py', name: 'Python', extension: '.py', monacoLang: 'python', icon: FaPython, color: 'text-blue-500' },
    { id: 'java', name: 'Java', extension: '.java', monacoLang: 'java', icon: FaJava, color: 'text-red-500' },
    { id: 'html', name: 'HTML', extension: '.html', monacoLang: 'html', icon: FaHtml5, color: 'text-orange-500' },
    { id: 'css', name: 'CSS', extension: '.css', monacoLang: 'css', icon: FaCss3Alt, color: 'text-blue-600' },
    { id: 'ts', name: 'TypeScript', extension: '.ts', monacoLang: 'typescript', icon: SiTypescript, color: 'text-blue-400' },
    { id: 'json', name: 'JSON', extension: '.json', monacoLang: 'json', icon: FileText, color: 'text-green-500' },
    { id: 'txt', name: 'Text', extension: '.txt', monacoLang: 'plaintext', icon: FileText, color: 'text-gray-500' }
  ];

  // Mock notifications
  const notifications = [
    { id: 1, title: 'Project Shared', message: 'Sarah shared "E-commerce Dashboard" with you', time: '5 min ago', read: false },
    { id: 2, title: 'Code Review', message: 'Mike requested a review on "API Integration"', time: '1 hour ago', read: false },
    { id: 3, title: 'Execution Complete', message: 'Python script "data_analysis.py" ran successfully', time: '2 hours ago', read: true },
    { id: 4, title: 'Storage Warning', message: 'You\'ve used 80% of your storage', time: '1 day ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

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
      // Mock files data - replace with your actual API call
      const mockFiles = [
        { _id: '1', name: 'main.js', type: 'js', content: 'console.log("Hello World!");' },
        { _id: '2', name: 'app.py', type: 'py', content: 'print("Hello World!")' },
        { _id: '3', name: 'style.css', type: 'css', content: 'body { margin: 0; }' }
      ];
      setFiles(mockFiles);
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

      const newFile = {
        _id: Date.now().toString(),
        name: fileName,
        type: fileForm.type,
        content: getDefaultCode(fileForm.type)
      };

      setFiles(prev => [...prev, newFile]);
      setShowFileModal(false);
      setFileForm({ name: '', type: 'js' });
      toast.success(`File "${fileName}" created successfully!`);
      
      // Select the new file
      selectFile(newFile);
    } catch (error) {
      console.error('Error creating file:', error);
      toast.error('Failed to create file');
    }
  };

  const handleSaveCode = async () => {
    if (!currentFile) return;
    
    try {
      setLoading(prev => ({ ...prev, saving: true }));
      
      // Mock save - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('File saved successfully!');
    } catch (error) {
      console.error('Error saving file:', error);
      toast.error('Failed to save file');
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
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
      
      // Mock execution - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockOutput = `Executing ${currentFile?.name || 'code'}...
> Hello World!
> Execution completed successfully!
Time: 0.123s
Memory: 45.6 MB`;
      
      setOutput(mockOutput);
      toast.success('Code executed successfully!');
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
      html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>',
      css: '/* Welcome to your CSS file! */\nbody {\n    margin: 0;\n    padding: 0;\n    font-family: Arial, sans-serif;\n}',
      ts: '// Welcome to your TypeScript file!\nconsole.log("Hello, World!");\n\n// Start coding here...',
      json: '{\n  "message": "Welcome to your JSON file!"\n}',
      txt: 'Welcome to your text file!\n\nStart writing here...'
    };
    
    return defaults[type] || '// Start coding here...';
  };

  const selectProject = async (project) => {
    setCurrentProject(project);
    setCurrentFile(null);
    setCode('');
    setOutput('');
    await fetchProjectFiles(project._id);
    if (isMobile) setShowMobileSidebar(false);
  };

  const selectFile = async (file) => {
    setCurrentFile(file);
    setCode(file.content || getDefaultCode(file.type));
    const fileType = fileTypes.find(t => t.id === file.type);
    setEditorLanguage(fileType?.monacoLang || 'javascript');
    if (isMobile) setShowMobileFiles(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  const handleEditorChange = (value) => {
    setCode(value);
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

      {/* Main Container */}
      <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} overflow-hidden`}>
        
        {/* Top Header - Always visible */}
        <header className={`sticky top-0 z-30 border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Left side - Menu button and title */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <Code className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    CodeFlow
                  </span>
                </div>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center space-x-2">
                {!isMobile && (
                  <>
                    <div className="relative hidden md:block">
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
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowProjectModal(true)}
                      className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Project</span>
                    </motion.button>
                  </>
                )}
                
                {isMobile && (
                  <>
                    <button
                      onClick={() => setShowMobileSearch(!showMobileSearch)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowProjectModal(true)}
                      className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Project Header - Shows when project is selected */}
          {currentProject && (
            <div className={`px-4 py-3 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setCurrentProject(null);
                      setCurrentFile(null);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="font-semibold">{currentProject.name}</h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {currentProject.description || 'No description'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {isMobile && (
                    <button
                      onClick={() => setShowMobileFiles(!showMobileFiles)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Files"
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={handleRunCode}
                    disabled={loading.execution}
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm disabled:opacity-50"
                  >
                    {loading.execution ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    {!isMobile && <span>Run</span>}
                  </button>
                  <button
                    onClick={handleSaveCode}
                    disabled={loading.saving}
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-50"
                  >
                    {loading.saving ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {!isMobile && <span>Save</span>}
                  </button>
                  <button
                    onClick={() => setShowFileModal(true)}
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    {!isMobile && <span>New File</span>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {isMobile && showMobileSearch && (
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={() => setShowMobileSearch(false)}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Sidebar Menu */}
        <AnimatePresence>
          {showMobileSidebar && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setShowMobileSidebar(false)}
              />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className={`fixed top-0 left-0 bottom-0 w-80 z-50 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <div className="h-full flex flex-col">
                  {/* Sidebar Header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="font-bold text-lg">Projects</h2>
                    <button
                      onClick={() => setShowMobileSidebar(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Language Filter */}
                  <div className="p-4 border-b">
                    <div className="flex flex-wrap gap-2">
                      {languages.map((lang) => {
                        const Icon = lang.icon;
                        return (
                          <button
                            key={lang.id}
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
                          </button>
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
                          onClick={() => setShowProjectModal(true)}
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
                            <div
                              key={project._id}
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
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                  {typeof Icon === 'function' ? (
                                    <Icon className={`w-5 h-5 ${lang?.color}`} />
                                  ) : (
                                    React.createElement(Icon, { className: `w-5 h-5 ${lang?.color}` })
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold truncate">{project.name}</h3>
                                  <p className={`text-sm mt-1 truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {project.description || 'No description'}
                                  </p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop Sidebar - Only show on desktop when no project selected */}
          {!isMobile && !currentProject && (
            <div className={`w-80 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
              <div className="h-full flex flex-col">
                {/* Language Filter */}
                <div className="p-6 border-b">
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
                <div className="flex-1 overflow-y-auto p-6">
                  {loading.projects ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-12">
                      <Folder className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No projects found</p>
                      <button
                        onClick={() => setShowProjectModal(true)}
                        className="mt-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium"
                      >
                        Create your first project
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
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
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                {typeof Icon === 'function' ? (
                                  <Icon className={`w-5 h-5 ${lang?.color}`} />
                                ) : (
                                  React.createElement(Icon, { className: `w-5 h-5 ${lang?.color}` })
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold truncate">{project.name}</h3>
                                <p className={`text-sm mt-1 truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {project.description || 'No description'}
                                </p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Desktop Files Sidebar - Only show when project is selected */}
          {!isMobile && currentProject && (
            <div className={`w-64 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
              <div className="h-full flex flex-col">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Files</h3>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {files.length} files
                    </span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
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
                    <div className="space-y-2">
                      {files.map((file) => {
                        const fileType = fileTypes.find(t => t.id === file.type);
                        const Icon = fileType?.icon || FileText;
                        return (
                          <motion.button
                            key={file._id}
                            whileHover={{ x: 4 }}
                            onClick={() => selectFile(file)}
                            className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between ${
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
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mobile Files Sidebar */}
          <AnimatePresence>
            {isMobile && currentProject && showMobileFiles && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={() => setShowMobileFiles(false)}
                />
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  className={`fixed top-0 left-0 bottom-0 w-80 z-50 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b flex items-center justify-between">
                      <h2 className="font-bold text-lg">Files</h2>
                      <button
                        onClick={() => setShowMobileFiles(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
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
                        <div className="space-y-2">
                          {files.map((file) => {
                            const fileType = fileTypes.find(t => t.id === file.type);
                            const Icon = fileType?.icon || FileText;
                            return (
                              <button
                                key={file._id}
                                onClick={() => selectFile(file)}
                                className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between ${
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
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Editor Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {currentProject ? (
              <>
                {/* File Header */}
                {currentFile && (
                  <div className={`border-b px-4 py-3 flex items-center justify-between ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center space-x-3">
                      <Code className="w-5 h-5" />
                      <span className="font-medium truncate">{currentFile.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={copyToClipboard}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Copy code"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowOutput(!showOutput)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        title={showOutput ? "Hide output" : "Show output"}
                      >
                        {showOutput ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Editor or Welcome Screen */}
                <div className="flex-1 flex flex-col">
                  {currentFile ? (
                    <>
                      {/* Monaco Editor */}
                      <div className="flex-1">
                        <Editor
                          height="100%"
                          language={editorLanguage}
                          value={code}
                          onChange={handleEditorChange}
                          theme={theme === 'dark' ? 'vs-dark' : 'light'}
                          options={{
                            minimap: { enabled: !isMobile },
                            fontSize: isMobile ? 14 : 16,
                            wordWrap: 'on',
                            automaticLayout: true,
                            formatOnPaste: true,
                            formatOnType: true,
                            scrollBeyondLastLine: false,
                            lineNumbers: isMobile ? 'off' : 'on',
                            glyphMargin: !isMobile,
                            folding: !isMobile,
                            lineDecorationsWidth: isMobile ? 5 : 10,
                            renderLineHighlight: isMobile ? 'none' : 'all',
                          }}
                        />
                      </div>

                      {/* Output Panel */}
                      {showOutput && (
                        <div className={`border-t ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                          <div className={`px-4 py-2 border-b flex items-center justify-between ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-center space-x-2">
                              <Terminal className="w-4 h-4" />
                              <span className="font-medium">Output</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setOutput('')}
                                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                title="Clear output"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className={`${isMobile ? 'h-32' : 'h-48'} overflow-auto p-4 font-mono text-sm whitespace-pre-wrap`}>
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
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center p-4">
                      <div className="text-center max-w-md">
                        <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No File Selected</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                          Select a file from the sidebar or create a new one
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <button
                            onClick={() => setShowFileModal(true)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                          >
                            Create New File
                          </button>
                          {isMobile && (
                            <button
                              onClick={() => setShowMobileFiles(true)}
                              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              Browse Files
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center max-w-md"
                >
                  <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <Code className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">Welcome to CodeFlow Projects</h3>
                  <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Create projects, write code, and execute programs in multiple languages. 
                    Everything is saved in the cloud and accessible from anywhere.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowProjectModal(true)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Plus className="w-5 h-5 inline mr-2" />
                      Create New Project
                    </motion.button>
                    {isMobile && (
                      <button
                        onClick={() => setShowMobileSidebar(true)}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        Browse Projects
                      </button>
                    )}
                  </div>
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
              <div className={`rounded-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
              } border shadow-2xl`}>
                <div className="flex items-center justify-between p-4 border-b shrink-0">
                  <h3 className="text-lg font-semibold">Create New Project</h3>
                  <button
                    onClick={() => setShowProjectModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={projectForm.name}
                        onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                        placeholder="My Awesome Project"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Description (Optional)
                      </label>
                      <textarea
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                        placeholder="Project description"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none dark:bg-gray-700 dark:border-gray-600"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
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
                                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${lang.color} mb-1`}>
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
                      onClick={() => setShowProjectModal(false)}
                      className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateProject}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
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
              <div className={`rounded-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
              } border shadow-2xl`}>
                <div className="flex items-center justify-between p-4 border-b shrink-0">
                  <h3 className="text-lg font-semibold">Create New File</h3>
                  <button
                    onClick={() => setShowFileModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        File Name
                      </label>
                      <input
                        type="text"
                        value={fileForm.name}
                        onChange={(e) => setFileForm({...fileForm, name: e.target.value})}
                        placeholder="my-script"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
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
                                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${type.color}`}>
                                {typeof Icon === 'function' ? (
                                  <Icon className="w-4 h-4" />
                                ) : (
                                  React.createElement(Icon, { className: "w-4 h-4" })
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
                      onClick={() => setShowFileModal(false)}
                      className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateFile}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
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
    </>
  );
};

export default Projects;