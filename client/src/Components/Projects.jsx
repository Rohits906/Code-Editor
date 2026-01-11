// import React, { useState, useEffect, useRef } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useTheme } from '../context/ThemeContext';
// import toast, { Toaster } from 'react-hot-toast';
// import { motion, AnimatePresence } from 'framer-motion';
// import Editor from '@monaco-editor/react';
// import { 
//   Folder, 
//   FileText, 
//   Play, 
//   Save,
//   Plus, 
//   Search, 
//   Code,
//   X,
//   Copy,
//   Terminal,
//   RefreshCw,
//   Menu,
//   ChevronRight,
//   Eye,
//   EyeOff,
//   ArrowLeft,
// } from 'lucide-react';
// import { FaPython, FaJs, FaJava, FaHtml5, FaCss3Alt, FaReact } from 'react-icons/fa';
// import { SiTypescript } from 'react-icons/si';

// const Projects = () => {
//   const { API_URL, token } = useAuth();
//   const { theme } = useTheme();
  
//   // State for projects and files
//   const [projects, setProjects] = useState([]);
//   const [filteredProjects, setFilteredProjects] = useState([]);
//   const [files, setFiles] = useState([]);
//   const [currentProject, setCurrentProject] = useState(null);
//   const [currentFile, setCurrentFile] = useState(null);
//   const [code, setCode] = useState('');
//   const [output, setOutput] = useState('');
//   const [loading, setLoading] = useState({
//     projects: true,
//     files: false,
//     execution: false,
//     saving: false
//   });
  
//   // Modal states
//   const [showProjectModal, setShowProjectModal] = useState(false);
//   const [showFileModal, setShowFileModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false)
  
//   // UI states
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedLanguage, setSelectedLanguage] = useState('all');
//   const [isMobile, setIsMobile] = useState(false);
//   const [showProjectSidebar, setShowProjectSidebar] = useState(false);
//   const [showFilesSidebar, setShowFilesSidebar] = useState(false);
//   const [showOutput, setShowOutput] = useState(true);
//   const [editorLanguage, setEditorLanguage] = useState('javascript');
  
//   // Form states
//   const [projectForm, setProjectForm] = useState({
//     name: '',
//     description: '',
//     language: 'javascript'
//   });
//   const [fileForm, setFileForm] = useState({
//     name: '',
//     type: 'js'
//   });
//   const [itemToDelete, setItemToDelete] = useState(null);
  
//   // Check mobile viewport
//   useEffect(() => {
//     const checkMobile = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       // On desktop, show project sidebar by default when no project selected
//       if (!mobile && !currentProject) {
//         setShowProjectSidebar(true);
//       }
//     };
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, [currentProject]);
  
//   // Languages supported
//   const languages = [
//     { id: 'all', name: 'All', icon: Code, color: 'bg-gray-500' },
//     { id: 'javascript', name: 'JS', icon: FaJs, color: 'bg-yellow-500' },
//     { id: 'python', name: 'Py', icon: FaPython, color: 'bg-blue-500' },
//     { id: 'java', name: 'Java', icon: FaJava, color: 'bg-red-500' },
//     { id: 'html', name: 'HTML', icon: FaHtml5, color: 'bg-orange-500' },
//     { id: 'css', name: 'CSS', icon: FaCss3Alt, color: 'bg-blue-600' },
//     { id: 'typescript', name: 'TS', icon: SiTypescript, color: 'bg-blue-400' }
//   ];
  
//   // File types with monaco editor language mapping
//   const fileTypes = [
//     { id: 'js', name: 'JavaScript', extension: '.js', monacoLang: 'javascript', icon: FaJs, color: 'text-yellow-500' },
//     { id: 'py', name: 'Python', extension: '.py', monacoLang: 'python', icon: FaPython, color: 'text-blue-500' },
//     { id: 'java', name: 'Java', extension: '.java', monacoLang: 'java', icon: FaJava, color: 'text-red-500' },
//     { id: 'html', name: 'HTML', extension: '.html', monacoLang: 'html', icon: FaHtml5, color: 'text-orange-500' },
//     { id: 'css', name: 'CSS', extension: '.css', monacoLang: 'css', icon: FaCss3Alt, color: 'text-blue-600' },
//     { id: 'ts', name: 'TypeScript', extension: '.ts', monacoLang: 'typescript', icon: SiTypescript, color: 'text-blue-400' },
//     { id: 'json', name: 'JSON', extension: '.json', monacoLang: 'json', icon: FileText, color: 'text-green-500' },
//     { id: 'txt', name: 'Text', extension: '.txt', monacoLang: 'plaintext', icon: FileText, color: 'text-gray-500' }
//   ];

//   // Fetch projects on mount
//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   // Filter projects when search or language changes
//   useEffect(() => {
//     let filtered = projects;
    
//     if (searchQuery) {
//       filtered = filtered.filter(project => 
//         project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         project.description?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
    
//     if (selectedLanguage !== 'all') {
//       filtered = filtered.filter(project => project.language === selectedLanguage);
//     }
    
//     setFilteredProjects(filtered);
//   }, [projects, searchQuery, selectedLanguage]);

//   const fetchProjects = async () => {
//     try {
//       setLoading(prev => ({ ...prev, projects: true }));
//       const response = await fetch(`${API_URL}/projects/project`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) throw new Error('Failed to fetch projects');

//       const data = await response.json();
//       if (data.success) {
//         setProjects(data.data);
//         setFilteredProjects(data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching projects:', error);
//       toast.error('Failed to load projects');
//     } finally {
//       setLoading(prev => ({ ...prev, projects: false }));
//     }
//   };

//   const fetchProjectFiles = async (projectId) => {
//     if (!projectId) return;
    
//     try {
//       setLoading(prev => ({ ...prev, files: true }));
//       // Mock files data - replace with your actual API call
//       const mockFiles = [
//         { _id: '1', name: 'main.js', type: 'js', content: 'console.log("Hello World!");' },
//         { _id: '2', name: 'app.py', type: 'py', content: 'print("Hello World!")' },
//         { _id: '3', name: 'style.css', type: 'css', content: 'body { margin: 0; }' }
//       ];
//       setFiles(mockFiles);
//     } catch (error) {
//       console.error('Error fetching files:', error);
//       toast.error('Failed to load project files');
//     } finally {
//       setLoading(prev => ({ ...prev, files: false }));
//     }
//   };

//   const handleCreateProject = async () => {
//     if (!projectForm.name.trim()) {
//       toast.error('Please enter a project name');
//       return;
//     }

//     try {
//       toast.loading('Creating project...');
      
//       const response = await fetch(`${API_URL}/projects/project`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: projectForm.name.trim(),
//           description: projectForm.description?.trim() || '',
//           language: projectForm.language
//         }),
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to create project');
//       }
      
//       if (data.success) {
//         await fetchProjects();
//         setShowProjectModal(false);
//         setProjectForm({ name: '', description: '', language: 'javascript' });
//         toast.success(`Project "${data.data.name}" created successfully!`);
//       }
//     } catch (error) {
//       console.error('Error creating project:', error);
//       toast.error(error.message || 'Failed to create project');
//     }
//   };

//   const handleDeleteProject = async (projectId) => {
//     try {
//       toast.loading('Deleting project...');
      
//       const response = await fetch(`${API_URL}/projects/project/${projectId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();
      
//       if (data.success) {
//         await fetchProjects();
//         if (currentProject?._id === projectId) {
//           setCurrentProject(null);
//           setCurrentFile(null);
//           setCode('');
//           setOutput('');
//         }
//         setShowDeleteModal(false);
//         setItemToDelete(null);
//         toast.success('Project deleted successfully');
//       }
//     } catch (error) {
//       console.error('Error deleting project:', error);
//       toast.error('Failed to delete project');
//     }
//   };

//   const handleCreateFile = async () => {
//     if (!fileForm.name.trim()) {
//       toast.error('Please enter a file name');
//       return;
//     }

//     if (!currentProject) {
//       toast.error('Please select a project first');
//       return;
//     }

//     try {
//       const fileType = fileTypes.find(t => t.id === fileForm.type);
//       const fileName = fileForm.name.endsWith(fileType.extension) 
//         ? fileForm.name 
//         : `${fileForm.name}${fileType.extension}`;

//       const newFile = {
//         _id: Date.now().toString(),
//         name: fileName,
//         type: fileForm.type,
//         content: getDefaultCode(fileForm.type)
//       };

//       setFiles(prev => [...prev, newFile]);
//       setShowFileModal(false);
//       setFileForm({ name: '', type: 'js' });
//       toast.success(`File "${fileName}" created successfully!`);
      
//       // Select the new file
//       selectFile(newFile);
//     } catch (error) {
//       console.error('Error creating file:', error);
//       toast.error('Failed to create file');
//     }
//   };

//   const handleSaveCode = async () => {
//     if (!currentFile) return;
    
//     try {
//       setLoading(prev => ({ ...prev, saving: true }));
      
//       // Mock save - replace with actual API call
//       await new Promise(resolve => setTimeout(resolve, 500));
      
//       toast.success('File saved successfully!');
//     } catch (error) {
//       console.error('Error saving file:', error);
//       toast.error('Failed to save file');
//     } finally {
//       setLoading(prev => ({ ...prev, saving: false }));
//     }
//   };

//   const handleRunCode = async () => {
//     if (!currentProject || !code) {
//       toast.error('No code to execute');
//       return;
//     }

//     try {
//       setLoading(prev => ({ ...prev, execution: true }));
//       setOutput('');
//       setShowOutput(true);
      
//       // Mock execution - replace with actual API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       const mockOutput = `Executing ${currentFile?.name || 'code'}...
//       > Hello World!
//       > Execution completed successfully!
//       Time: 0.123s
//       Memory: 45.6 MB`;
            
//       setOutput(mockOutput);
//       toast.success('Code executed successfully!');
//     } catch (error) {
//       console.error('Error executing code:', error);
//       setOutput('Error: ' + error.message);
//       toast.error('Failed to execute code');
//     } finally {
//       setLoading(prev => ({ ...prev, execution: false }));
//     }
//   };

//   const getDefaultCode = (type) => {
//     const defaults = {
//       js: '// Welcome to your JavaScript file!\nconsole.log("Hello, World!");\n\n// Start coding here...',
//       py: '# Welcome to your Python file!\nprint("Hello, World!")\n\n# Start coding here...',
//       java: '// Welcome to your Java file!\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
//       html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>',
//       css: '/* Welcome to your CSS file! */\nbody {\n    margin: 0;\n    padding: 0;\n    font-family: Arial, sans-serif;\n}',
//       ts: '// Welcome to your TypeScript file!\nconsole.log("Hello, World!");\n\n// Start coding here...',
//       json: '{\n  "message": "Welcome to your JSON file!"\n}',
//       txt: 'Welcome to your text file!\n\nStart writing here...'
//     };
    
//     return defaults[type] || '// Start coding here...';
//   };

//   const selectProject = async (project) => {
//     setCurrentProject(project);
//     setCurrentFile(null);
//     setCode('');
//     setOutput('');
//     await fetchProjectFiles(project._id);
//     // On mobile, close project sidebar when project is selected
//     if (isMobile) {
//       setShowProjectSidebar(false);
//       // Show files sidebar on mobile when project is selected
//       setShowFilesSidebar(false);
//     } else {
//       // On desktop, automatically show files sidebar
//       setShowFilesSidebar(true);
//     }
//   };

//   const selectFile = async (file) => {
//     setCurrentFile(file);
//     setCode(file.content || getDefaultCode(file.type));
//     const fileType = fileTypes.find(t => t.id === file.type);
//     setEditorLanguage(fileType?.monacoLang || 'javascript');
//     // On mobile, close files sidebar when file is selected
//     if (isMobile) setShowFilesSidebar(false);
//   };

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(code);
//     toast.success('Code copied to clipboard!');
//   };

//   const handleEditorChange = (value) => {
//     setCode(value);
//   };

//   return (
//     <>
//       <Toaster 
//         position={isMobile ? "top-center" : "top-right"}
//         toastOptions={{ 
//           duration: 3000,
//           style: {
//             background: theme === 'dark' ? '#1f2937' : '#ffffff',
//             color: theme === 'dark' ? '#ffffff' : '#1f2937',
//             border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
//             fontSize: '14px',
//             maxWidth: isMobile ? '90vw' : '400px',
//             borderRadius: '10px'
//           }
//         }} 
//       />

//       {/* Main Container */}
//       <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} overflow-hidden`}>
        
//         {/* Top Header */}
//         <header className={`sticky top-0 z-30 border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
//           <div className="px-4 py-3">
//             <div className="flex items-center justify-between">
//               {/* Left side - Project menu button */}
//               <div className="flex items-center space-x-3">
//                 <button
//                   onClick={() => setShowProjectSidebar(!showProjectSidebar)}
//                   className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//                   title={showProjectSidebar ? "Hide projects" : "Show projects"}
//                 >
//                   <Folder className="w-5 h-5" />
//                 </button>
//                 <div className="flex items-center space-x-2">
//                   <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
//                     <Code className="w-5 h-5 text-blue-500" />
//                   </div>
//                   <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
//                     Projects
//                   </span>
//                 </div>
//               </div>

//               {/* Center - Search on desktop */}
//               {!isMobile && (
//                 <div className="flex-1 max-w-xl mx-8">
//                   <div className="relative">
//                     <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
//                     <input
//                       type="search"
//                       placeholder="Search projects..."
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                         theme === 'dark' 
//                           ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
//                           : 'border-gray-300 text-gray-900 placeholder-gray-500'
//                       }`}
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Right side - Actions */}
//               <div className="flex items-center space-x-2">
//                 {!isMobile && (
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setShowProjectModal(true)}
//                     className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity"
//                   >
//                     <Plus className="w-4 h-4" />
//                     <span>New Project</span>
//                   </motion.button>
//                 )}
                
//                 {isMobile && (
//                   <>
//                     <button
//                       onClick={() => {
//                         if (currentProject) {
//                           setShowFilesSidebar(!showFilesSidebar);
//                         } else {
//                           setShowProjectSidebar(!showProjectSidebar);
//                         }
//                       }}
//                       className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//                     >
//                       <Menu className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={() => setShowProjectModal(true)}
//                       className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
//                     >
//                       <Plus className="w-5 h-5" />
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Project Header - Shows when project is selected */}
//           {currentProject && (
//             <div className={`px-4 py-3 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <button
//                     onClick={() => {
//                       setCurrentProject(null);
//                       setCurrentFile(null);
//                       setShowFilesSidebar(false);
//                     }}
//                     className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//                   >
//                     <ArrowLeft className="w-5 h-5" />
//                   </button>
//                   <div>
//                     <h2 className="font-semibold">{currentProject.name}</h2>
//                     <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                       {currentProject.description || 'No description'}
//                     </p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-2">
//                   <button
//                     onClick={handleRunCode}
//                     disabled={loading.execution}
//                     className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm disabled:opacity-50"
//                   >
//                     {loading.execution ? (
//                       <RefreshCw className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <Play className="w-4 h-4" />
//                     )}
//                     {!isMobile && <span>Run</span>}
//                   </button>
//                   <button
//                     onClick={handleSaveCode}
//                     disabled={loading.saving}
//                     className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-50"
//                   >
//                     {loading.saving ? (
//                       <RefreshCw className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <Save className="w-4 h-4" />
//                     )}
//                     {!isMobile && <span>Save</span>}
//                   </button>
//                   <button
//                     onClick={() => setShowFileModal(true)}
//                     className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm"
//                   >
//                     <Plus className="w-4 h-4" />
//                     {!isMobile && <span>New File</span>}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </header>

//         {/* Main Content Area */}
//         <div className="flex-1 flex overflow-hidden">
//           {/* Project Sidebar - Shows when no project is selected */}
//           {(!currentProject || showProjectSidebar) && (
//             <div className={`${isMobile ? 'fixed inset-0 z-40' : 'relative'} ${showProjectSidebar ? 'block' : 'hidden'} md:block`}>
//               {isMobile && showProjectSidebar && (
//                 <div 
//                   className="fixed inset-0 bg-black/50"
//                   onClick={() => setShowProjectSidebar(false)}
//                 />
//               )}
//               <div className={`${isMobile ? 'fixed top-0 left-0 bottom-0 w-80 z-50' : 'w-80 h-full'} ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
//                 <div className="h-full flex flex-col">
//                   {/* Sidebar Header */}
//                   <div className="p-4 border-b flex items-center justify-between">
//                     <h2 className="font-bold text-lg">All Projects</h2>
//                     {isMobile && (
//                       <button
//                         onClick={() => setShowProjectSidebar(false)}
//                         className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//                       >
//                         <X className="w-5 h-5" />
//                       </button>
//                     )}
//                   </div>

//                   {/* Language Filter */}
//                   <div className="p-4 border-b">
//                     <div className="flex flex-wrap gap-2">
//                       {languages.map((lang) => {
//                         const Icon = lang.icon;
//                         return (
//                           <button
//                             key={lang.id}
//                             onClick={() => setSelectedLanguage(lang.id)}
//                             className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center space-x-2 ${
//                               selectedLanguage === lang.id
//                                 ? theme === 'dark'
//                                   ? 'bg-blue-600 text-white'
//                                   : 'bg-blue-100 text-blue-700'
//                                 : theme === 'dark'
//                                   ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                             }`}
//                           >
//                             {typeof Icon === 'function' ? (
//                               <Icon className="w-3 h-3" />
//                             ) : (
//                               React.createElement(Icon, { className: "w-3 h-3" })
//                             )}
//                             <span>{lang.name}</span>
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   {/* Projects List */}
//                   <div className="flex-1 overflow-y-auto p-4">
//                     {loading.projects ? (
//                       <div className="flex justify-center py-12">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                       </div>
//                     ) : filteredProjects.length === 0 ? (
//                       <div className="text-center py-12">
//                         <Folder className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
//                         <p className="text-gray-500 dark:text-gray-400">No projects found</p>
//                         <button
//                           onClick={() => setShowProjectModal(true)}
//                           className="mt-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium"
//                         >
//                           Create your first project
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="space-y-3">
//                         {filteredProjects.map((project) => {
//                           const lang = languages.find(l => l.id === project.language);
//                           const Icon = lang?.icon || Code;
//                           return (
//                             <div
//                               key={project._id}
//                               onClick={() => selectProject(project)}
//                               className={`p-4 rounded-xl cursor-pointer border transition-all ${
//                                 currentProject?._id === project._id
//                                   ? theme === 'dark'
//                                     ? 'bg-blue-900/30 border-blue-700'
//                                     : 'bg-blue-50 border-blue-300'
//                                   : theme === 'dark'
//                                     ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
//                                     : 'bg-white border-gray-200 hover:bg-gray-50'
//                               }`}
//                             >
//                               <div className="flex items-center space-x-3">
//                                 <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
//                                   {typeof Icon === 'function' ? (
//                                     <Icon className={`w-5 h-5 ${lang?.color}`} />
//                                   ) : (
//                                     React.createElement(Icon, { className: `w-5 h-5 ${lang?.color}` })
//                                   )}
//                                 </div>
//                                 <div className="flex-1 min-w-0">
//                                   <h3 className="font-semibold truncate">{project.name}</h3>
//                                   <p className={`text-sm mt-1 truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                     {project.description || 'No description'}
//                                   </p>
//                                 </div>
//                                 <ChevronRight className="w-4 h-4 text-gray-400" />
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Files Sidebar - Shows when project is selected */}
//           {currentProject && (!isMobile || showFilesSidebar) && (
//             <div className={`${isMobile ? 'fixed inset-0 z-40' : 'relative'} ${showFilesSidebar ? 'block' : 'hidden'} md:block`}>
//               {isMobile && showFilesSidebar && (
//                 <div 
//                   className="fixed inset-0 bg-black/50"
//                   onClick={() => setShowFilesSidebar(false)}
//                 />
//               )}
//               <div className={`${isMobile ? 'fixed top-0 right-0 bottom-0 w-80 z-50' : 'w-64 h-full'} ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
//                 <div className="h-full flex flex-col">
//                   <div className="p-4 border-b flex items-center justify-between">
//                     <h3 className="font-semibold">Files</h3>
//                     <div className="flex items-center space-x-2">
//                       <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                         {files.length} files
//                       </span>
//                       {isMobile && (
//                         <button
//                           onClick={() => setShowFilesSidebar(false)}
//                           className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//                         >
//                           <X className="w-5 h-5" />
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex-1 overflow-y-auto p-4">
//                     {loading.files ? (
//                       <div className="flex justify-center py-8">
//                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
//                       </div>
//                     ) : files.length === 0 ? (
//                       <div className="text-center py-8">
//                         <FileText className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
//                         <p className="text-gray-500 dark:text-gray-400 text-sm">No files yet</p>
//                       </div>
//                     ) : (
//                       <div className="space-y-2">
//                         {files.map((file) => {
//                           const fileType = fileTypes.find(t => t.id === file.type);
//                           const Icon = fileType?.icon || FileText;
//                           return (
//                             <motion.button
//                               key={file._id}
//                               whileHover={{ x: 4 }}
//                               onClick={() => selectFile(file)}
//                               className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between ${
//                                 currentFile?._id === file._id
//                                   ? theme === 'dark'
//                                     ? 'bg-blue-900/30 text-white'
//                                     : 'bg-blue-50 text-blue-700'
//                                   : theme === 'dark'
//                                     ? 'hover:bg-gray-700 text-gray-300'
//                                     : 'hover:bg-gray-100 text-gray-700'
//                               }`}
//                             >
//                               <div className="flex items-center space-x-3 flex-1 min-w-0">
//                                 {typeof Icon === 'function' ? (
//                                   <Icon className={`w-4 h-4 ${fileType?.color}`} />
//                                 ) : (
//                                   React.createElement(Icon, { className: `w-4 h-4 ${fileType?.color}` })
//                                 )}
//                                 <span className="truncate">{file.name}</span>
//                               </div>
//                             </motion.button>
//                           );
//                         })}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Editor Area */}
//           <div className="flex-1 flex flex-col overflow-hidden">
//             {currentProject ? (
//               <>
//                 {/* File Header */}
//                 {currentFile && (
//                   <div className={`border-b px-4 py-3 flex items-center justify-between ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
//                     <div className="flex items-center space-x-3">
//                       <Code className="w-5 h-5" />
//                       <span className="font-medium truncate">{currentFile.name}</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <button
//                         onClick={copyToClipboard}
//                         className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//                         title="Copy code"
//                       >
//                         <Copy className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => setShowOutput(!showOutput)}
//                         className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//                         title={showOutput ? "Hide output" : "Show output"}
//                       >
//                         {showOutput ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Editor or Welcome Screen */}
//                 <div className="flex-1 flex flex-col">
//                   {currentFile ? (
//                     <>
//                       {/* Monaco Editor */}
//                       <div className="flex-1">
//                         <Editor
//                           height="100%"
//                           language={editorLanguage}
//                           value={code}
//                           onChange={handleEditorChange}
//                           theme={theme === 'dark' ? 'vs-dark' : 'light'}
//                           options={{
//                             minimap: { enabled: !isMobile },
//                             fontSize: isMobile ? 14 : 16,
//                             wordWrap: 'on',
//                             automaticLayout: true,
//                             formatOnPaste: true,
//                             formatOnType: true,
//                             scrollBeyondLastLine: false,
//                             lineNumbers: isMobile ? 'off' : 'on',
//                             glyphMargin: !isMobile,
//                             folding: !isMobile,
//                             lineDecorationsWidth: isMobile ? 5 : 10,
//                             renderLineHighlight: isMobile ? 'none' : 'all',
//                           }}
//                         />
//                       </div>

//                       {/* Output Panel */}
//                       {showOutput && (
//                         <div className={`border-t ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
//                           <div className={`px-4 py-2 border-b flex items-center justify-between ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
//                             <div className="flex items-center space-x-2">
//                               <Terminal className="w-4 h-4" />
//                               <span className="font-medium">Output</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               <button
//                                 onClick={() => setOutput('')}
//                                 className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
//                                 title="Clear output"
//                               >
//                                 <X className="w-4 h-4" />
//                               </button>
//                             </div>
//                           </div>
//                           <div className={`${isMobile ? 'h-32' : 'h-48'} overflow-auto p-4 font-mono text-sm whitespace-pre-wrap`}>
//                             {loading.execution ? (
//                               <div className="flex items-center space-x-2">
//                                 <RefreshCw className="w-4 h-4 animate-spin" />
//                                 <span>Executing...</span>
//                               </div>
//                             ) : output ? (
//                               <pre className={output.includes('Error') ? 'text-red-500' : 'text-green-500'}>
//                                 {output}
//                               </pre>
//                             ) : (
//                               <span className="text-gray-500">Output will appear here after execution...</span>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     <div className="flex-1 flex items-center justify-center p-4">
//                       <div className="text-center max-w-md">
//                         <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
//                         <h3 className="text-lg font-semibold mb-2">No File Selected</h3>
//                         <p className="text-gray-500 dark:text-gray-400 mb-6">
//                           Select a file from the sidebar or create a new one
//                         </p>
//                         <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                           <button
//                             onClick={() => setShowFileModal(true)}
//                             className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity"
//                           >
//                             Create New File
//                           </button>
//                           {isMobile && (
//                             <button
//                               onClick={() => setShowFilesSidebar(true)}
//                               className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                             >
//                               Browse Files
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <div className="flex-1 flex items-center justify-center p-4">
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="text-center max-w-md"
//                 >
//                   <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
//                     theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
//                   }`}>
//                     <Code className="w-12 h-12 text-gray-400" />
//                   </div>
//                   <h3 className="text-2xl font-semibold mb-3">Welcome to Projects</h3>
//                   <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                     Create projects, write code, and execute programs in multiple languages. 
//                     Everything is saved in the cloud and accessible from anywhere.
//                   </p>
//                   <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => setShowProjectModal(true)}
//                       className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity"
//                     >
//                       <Plus className="w-5 h-5 inline mr-2" />
//                       Create New Project
//                     </motion.button>
//                     <button
//                       onClick={() => setShowProjectSidebar(true)}
//                       className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                     >
//                       Browse Projects
//                     </button>
//                   </div>
//                 </motion.div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Project Modal */}
//       <AnimatePresence>
//         {showProjectModal && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
//               onClick={() => setShowProjectModal(false)}
//             />
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.9, y: 20 }}
//               className="fixed inset-0 z-50 flex items-center justify-center p-4"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className={`rounded-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col ${
//                 theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
//               } border shadow-2xl`}>
//                 <div className="flex items-center justify-between p-4 border-b shrink-0">
//                   <h3 className="text-lg font-semibold">Create New Project</h3>
//                   <button
//                     onClick={() => setShowProjectModal(false)}
//                     className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
                
//                 <div className="flex-1 overflow-y-auto p-4">
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium mb-1">
//                         Project Name
//                       </label>
//                       <input
//                         type="text"
//                         value={projectForm.name}
//                         onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
//                         placeholder="My Awesome Project"
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
//                         autoFocus
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium mb-1">
//                         Description (Optional)
//                       </label>
//                       <textarea
//                         value={projectForm.description}
//                         onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
//                         placeholder="Project description"
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none dark:bg-gray-700 dark:border-gray-600"
//                         rows="3"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium mb-1">
//                         Language
//                       </label>
//                       <div className="grid grid-cols-3 gap-2">
//                         {languages.slice(1).map((lang) => {
//                           const Icon = lang.icon;
//                           return (
//                             <button
//                               key={lang.id}
//                               type="button"
//                               onClick={() => setProjectForm({...projectForm, language: lang.id})}
//                               className={`p-3 border rounded-lg flex flex-col items-center justify-center ${
//                                 projectForm.language === lang.id 
//                                   ? 'ring-2 border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-blue-500' 
//                                   : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
//                               }`}
//                             >
//                               <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${lang.color} mb-1`}>
//                                 {typeof Icon === 'function' ? (
//                                   <Icon className="w-4 h-4 text-white" />
//                                 ) : (
//                                   React.createElement(Icon, { className: "w-4 h-4 text-white" })
//                                 )}
//                               </div>
//                               <span className="text-xs font-medium">{lang.name}</span>
//                             </button>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="border-t p-4 shrink-0">
//                   <div className="flex space-x-3">
//                     <button
//                       onClick={() => setShowProjectModal(false)}
//                       className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleCreateProject}
//                       className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity"
//                     >
//                       Create Project
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* File Modal */}
//       <AnimatePresence>
//         {showFileModal && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
//               onClick={() => setShowFileModal(false)}
//             />
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.9, y: 20 }}
//               className="fixed inset-0 z-50 flex items-center justify-center p-4"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className={`rounded-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col ${
//                 theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
//               } border shadow-2xl`}>
//                 <div className="flex items-center justify-between p-4 border-b shrink-0">
//                   <h3 className="text-lg font-semibold">Create New File</h3>
//                   <button
//                     onClick={() => setShowFileModal(false)}
//                     className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
                
//                 <div className="flex-1 overflow-y-auto p-4">
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium mb-1">
//                         File Name
//                       </label>
//                       <input
//                         type="text"
//                         value={fileForm.name}
//                         onChange={(e) => setFileForm({...fileForm, name: e.target.value})}
//                         placeholder="my-script"
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
//                         autoFocus
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium mb-1">
//                         File Type
//                       </label>
//                       <div className="grid grid-cols-3 gap-2">
//                         {fileTypes.map((type) => {
//                           const Icon = type.icon;
//                           return (
//                             <button
//                               key={type.id}
//                               type="button"
//                               onClick={() => setFileForm({...fileForm, type: type.id})}
//                               className={`p-3 border rounded-lg flex flex-col items-center justify-center ${
//                                 fileForm.type === type.id 
//                                   ? 'ring-2 border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-blue-500' 
//                                   : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
//                               }`}
//                             >
//                               <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${type.color}`}>
//                                 {typeof Icon === 'function' ? (
//                                   <Icon className="w-4 h-4" />
//                                 ) : (
//                                   React.createElement(Icon, { className: "w-4 h-4" })
//                                 )}
//                               </div>
//                               <span className="text-xs font-medium">{type.name}</span>
//                             </button>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="border-t p-4 shrink-0">
//                   <div className="flex space-x-3">
//                     <button
//                       onClick={() => setShowFileModal(false)}
//                       className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleCreateFile}
//                       className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity"
//                     >
//                       Create File
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default Projects;




// ProjectsPage.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
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
  Edit,
  Calendar,
  HardDrive,
  Clock,
  MoreVertical,
  Download,
  Settings,
  Maximize2,
  Minimize2,
  ExternalLink,
  FolderOpen,
  FileCode,
  Home
} from 'lucide-react';
import { FaPython, FaJs, FaJava, FaHtml5, FaCss3Alt } from 'react-icons/fa';
import { SiTypescript, SiCplusplus, SiC } from 'react-icons/si';

// Main Projects Page Container
const ProjectsPage = () => {
  return (
    <Routes>
      <Route path="/" element={<ProjectsList />} />
      <Route path="/:projectId" element={<ProjectEditor />} />
    </Routes>
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
        setProjects(data.data);
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
      
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
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
                                  // Open share modal or context menu
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
  
  const [fileForm, setFileForm] = useState({
    name: '',
    type: 'js'
  });
  
  const fileTypes = [
    { id: 'js', name: 'JavaScript', extension: '.js', monacoLang: 'javascript', icon: FaJs, color: 'text-yellow-500' },
    { id: 'py', name: 'Python', extension: '.py', monacoLang: 'python', icon: FaPython, color: 'text-blue-500' },
    { id: 'java', name: 'Java', extension: '.java', monacoLang: 'java', icon: FaJava, color: 'text-red-500' },
    { id: 'html', name: 'HTML', extension: '.html', monacoLang: 'html', icon: FaHtml5, color: 'text-orange-500' },
    { id: 'css', name: 'CSS', extension: '.css', monacoLang: 'css', icon: FaCss3Alt, color: 'text-blue-600' },
    { id: 'ts', name: 'TypeScript', extension: '.ts', monacoLang: 'typescript', icon: SiTypescript, color: 'text-blue-400' },
    { id: 'cpp', name: 'C++', extension: '.cpp', monacoLang: 'cpp', icon: SiCplusplus, color: 'text-pink-500' },
    { id: 'c', name: 'C', extension: '.c', monacoLang: 'c', icon: SiC, color: 'text-indigo-500' },
    { id: 'json', name: 'JSON', extension: '.json', monacoLang: 'json', icon: FileText, color: 'text-green-500' },
    { id: 'txt', name: 'Text', extension: '.txt', monacoLang: 'plaintext', icon: FileText, color: 'text-gray-500' }
  ];
  
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
      
      // Mock API call for files
      const mockFiles = [
        { _id: '1', name: 'main.js', type: 'js', content: 'console.log("Hello World!");\n\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\ngreet("World");' },
        { _id: '2', name: 'app.py', type: 'py', content: 'print("Hello World!")\n\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))' },
        { _id: '3', name: 'style.css', type: 'css', content: 'body {\n  margin: 0;\n  padding: 0;\n  font-family: Arial, sans-serif;\n}' },
        { _id: '4', name: 'index.html', type: 'html', content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>' }
      ];
      
      setFiles(mockFiles);
      if (mockFiles.length > 0) {
        selectFile(mockFiles[0]);
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
      setLoading(prev => ({ ...prev, execution: true }));
      setOutput('');
      setShowOutput(true);
      
      // Mock execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockOutput = `📁 Project: ${project.name}
📄 File: ${currentFile?.name || 'Unknown'}
⏱️  Executing...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Execution successful!

📊 Results:
> Hello World!
> Hello, World!

⏰ Time: 0.123s
💾 Memory: 45.6 MB
🏁 Process completed successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ready for next command.`;
            
      setOutput(mockOutput);
      toast.success('Code executed successfully!');
    } catch (error) {
      console.error('Error executing code:', error);
      setOutput(`❌ Execution failed!\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nError: ${error.message}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCheck your code and try again.`);
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
      cpp: '// Welcome to your C++ file!\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
      c: '// Welcome to your C file!\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
      json: '{\n  "message": "Welcome to your JSON file!"\n}',
      txt: 'Welcome to your text file!\n\nStart writing here...'
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
      
      <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} overflow-hidden`}>
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
                      {project?.description || 'No description'}
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
                    onClick={copyToClipboard}
                    className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Copy code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowOutput(!showOutput)}
                    className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    title={showOutput ? "Hide output" : "Show output"}
                  >
                    {showOutput ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                  className={`${isMobile ? 'fixed top-0 left-0 bottom-0 w-80 z-50' : 'relative'} ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}
                >
                  <div className="p-4 border-b flex items-center justify-between shrink-0">
                    <h3 className="font-semibold">Project Files</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {files.length} files
                      </span>
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
                  
                  <div className="p-4 border-t shrink-0">
                    <button
                      onClick={() => setShowFileModal(true)}
                      className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New File</span>
                    </button>
                  </div>
                </motion.div>
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
                <div className="flex-1">
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
                      scrollBeyondLastLine: false,
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
                    }}
                  />
                </div>
                
                {/* Output Panel */}
                <AnimatePresence>
                  {showOutput && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: isMobile ? '200px' : '300px' }}
                      exit={{ height: 0 }}
                      className={`border-t overflow-hidden ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                    >
                      <div className={`px-4 py-2 border-b flex items-center justify-between ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center space-x-2">
                          <Terminal className="w-4 h-4" />
                          <span className="font-medium">Output</span>
                          {loading.execution && (
                            <div className="flex items-center space-x-1 text-sm text-blue-500">
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Executing...</span>
                            </div>
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
                          <pre className={output.includes('❌') ? 'text-red-500' : 'text-green-500'}>
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
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

export default ProjectsPage;