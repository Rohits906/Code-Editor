import React, { useState, useEffect } from 'react';
import { X, Folder, FileCode, Tag, Globe, Lock } from 'lucide-react';

const ProjectModal = ({ isOpen, onClose, onSave, project, languages, theme }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    language: 'javascript',
    tags: '',
    isPublic: false
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        language: project.language || 'javascript',
        tags: project.tags?.join(', ') || '',
        isPublic: project.isPublic || false
      });
    } else {
      setFormData({
        name: '',
        description: '',
        language: 'javascript',
        tags: '',
        isPublic: false
      });
    }
    setErrors({});
  }, [project]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!formData.language) {
      newErrors.language = 'Language is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    onSave({
      ...formData,
      tags: tagsArray
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border shadow-2xl`}>
        {/* Header */}
        <div className={`p-6 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Folder className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-semibold">
                {project ? 'Edit Project' : 'Create New Project'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Project Name */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="My Awesome Project"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'border-gray-300 text-gray-900 placeholder-gray-500'
              } ${errors.name ? 'border-red-500' : ''}`}
              autoFocus
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Project description..."
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              rows="3"
            />
          </div>

          {/* Language */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Language *
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({...formData, language: e.target.value})}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'border-gray-300 text-gray-900'
              } ${errors.language ? 'border-red-500' : ''}`}
            >
              {languages.map(lang => {
                const Icon = lang.icon;
                return (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                );
              })}
            </select>
            {errors.language && (
              <p className="mt-1 text-sm text-red-500">{errors.language}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Tags
            </label>
            <div className="relative">
              <Tag className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="react, nodejs, api (comma separated)"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            <p className={`mt-1 text-xs ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Separate tags with commas
            </p>
          </div>

          {/* Visibility */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Visibility
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, isPublic: false})}
                className={`flex-1 p-4 border rounded-xl flex flex-col items-center justify-center ${
                  !formData.isPublic
                    ? theme === 'dark'
                      ? 'border-blue-500 bg-blue-900/30 ring-2 ring-blue-800'
                      : 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                    : theme === 'dark'
                      ? 'border-gray-700 hover:border-gray-600 bg-gray-700/50'
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Lock className={`w-6 h-6 mb-2 ${
                  !formData.isPublic
                    ? theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <span className="font-medium">Private</span>
                <span className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Only you can access
                </span>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({...formData, isPublic: true})}
                className={`flex-1 p-4 border rounded-xl flex flex-col items-center justify-center ${
                  formData.isPublic
                    ? theme === 'dark'
                      ? 'border-green-500 bg-green-900/30 ring-2 ring-green-800'
                      : 'border-green-500 bg-green-50 ring-2 ring-green-100'
                    : theme === 'dark'
                      ? 'border-gray-700 hover:border-gray-600 bg-gray-700/50'
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Globe className={`w-6 h-6 mb-2 ${
                  formData.isPublic
                    ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <span className="font-medium">Public</span>
                <span className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Anyone can view
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-3 border rounded-xl ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              {project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;