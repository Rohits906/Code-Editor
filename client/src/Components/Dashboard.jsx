import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Code, LogOut, Settings, User, FileCode, Share2, Plus, Trash2, Edit3 } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    language: 'javascript',
    code: '// Start coding here...'
  });

  // Fetch user's projects
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });

      const data = await response.json();
      if (data.success) {
        await fetchProjects();
        setShowCreateProject(false);
        setNewProject({
          name: '',
          description: '',
          language: 'javascript',
          code: '// Start coding here...'
        });
      } else {
        alert('Failed to create project: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        await fetchProjects();
      } else {
        alert('Failed to delete project: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
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
          <button 
            onClick={() => setShowCreateProject(true)}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 text-left"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Plus className="w-8 h-8 text-blue-500" />
              <h3 className="text-xl font-semibold">New Project</h3>
            </div>
            <p className="text-gray-400">Start a new coding project with your favorite language</p>
          </button>

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

        {/* Create Project Modal */}
        {showCreateProject && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Create New Project</h3>
                <button 
                  onClick={() => setShowCreateProject(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Name</label>
                  <input 
                    type="text" 
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                    placeholder="My Awesome Project"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea 
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="Project description"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select 
                    value={newProject.language}
                    onChange={(e) => setNewProject({...newProject, language: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
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
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Create Project</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Projects Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Projects</h2>
            <span className="text-gray-400">{projects.length} projects</span>
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <FileCode className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No projects yet</h3>
              <p className="text-gray-500">Create your first project to get started!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div key={project._id} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 relative group">
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      className="p-1 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(project._id)}
                      className="p-1 bg-red-600 hover:bg-red-700 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <FileCode className="w-4 h-4 text-blue-500" />
                    <h3 className="font-semibold">{project.name}</h3>
                  </div>
                  {project.description && (
                    <p className="text-gray-400 text-sm mb-2">{project.description}</p>
                  )}
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="capitalize">{project.language}</span>
                    <span>Last modified: {new Date(project.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;