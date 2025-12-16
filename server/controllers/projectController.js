const Project = require('../models/project');

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { 'collaborators.user': req.user._id }
      ]
    })
    .populate('owner', 'firstName lastName email')
    .populate('collaborators.user', 'firstName lastName email')
    .sort({ lastModified: -1 });

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user._id },
        { 'collaborators.user': req.user._id }
      ]
    })
    .populate('owner', 'firstName lastName email')
    .populate('collaborators.user', 'firstName lastName email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const createProject = async (req, res) => {
  try {
    // Validate required fields
    const { name, description, language } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required'
      });
    }

    if (!language || !language.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Language is required'
      });
    }

    // Create project with default values
    const projectData = {
      name: name.trim(),
      description: description?.trim() || '',
      language: language.toLowerCase(),
      code: getDefaultCode(language), // Helper function for default code
      owner: req.user._id,
      collaborators: [],
      isPublic: false,
      isLive: false,
      tags: [],
      lastModified: new Date(),
      createdAt: new Date()
    };

    const project = await Project.create(projectData);

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'firstName lastName email');

    res.status(201).json({
      success: true,
      data: populatedProject,
      message: 'Project created successfully'
    });
  } catch (error) {
    console.error('Create project error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Helper function for default code based on language
const getDefaultCode = (language) => {
  const defaults = {
    javascript: '// Welcome to your JavaScript project!\nconsole.log("Hello, World!");\n\n// Start coding here...',
    python: '# Welcome to your Python project!\nprint("Hello, World!")\n\n# Start coding here...',
    java: '// Welcome to your Java project!\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    c: '// Welcome to your C project!\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
    cpp: '// Welcome to your C++ project!\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
    html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>My Project</title>\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n            margin: 40px;\n        }\n    </style>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n    <p>Start coding here...</p>\n</body>\n</html>',
    css: '/* Welcome to your CSS project! */\nbody {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 0;\n    background-color: #f5f5f5;\n}\n\n/* Start coding here... */',
    typescript: '// Welcome to your TypeScript project!\nconsole.log("Hello, World!");\n\n// Start coding here...'
  };

  return defaults[language.toLowerCase()] || '// Start coding here...';
};

const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check ownership or collaboration
    const isOwner = project.owner.toString() === req.user._id.toString();
    const isCollaborator = project.collaborators.some(
      collab => collab.user.toString() === req.user._id.toString() && collab.role === 'editor'
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    // Update lastModified timestamp
    const updateData = {
      ...req.body,
      lastModified: new Date()
    };

    project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('owner', 'firstName lastName email')
     .populate('collaborators.user', 'firstName lastName email');

    res.json({
      success: true,
      data: project,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('Update project error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check ownership
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};