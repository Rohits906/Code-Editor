const Project = require('../models/project');
const File = require('../models/files');

const createFile = async (req, res) => {
  try {
    const project = await Project.findOne({
        _id: req.params.id,
          $or: [
            { owner: req.user._id },
            { 'collaborators.user': req.user._id }
          ]
    });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    const newFile = new File({
      project: project._id,
      filename: req.body.name,
      type: req.body.type || 'js',
      content: req.body.content || '',
    });
    await newFile.save();
    
    const fileResponse = newFile.toObject();
    fileResponse.name = fileResponse.filename;
    delete fileResponse.filename;
    
    res.status(201).json({
      success: true,
      data: fileResponse,
      message: 'File created successfully'
    });
  } catch (error) {
    console.error('Create file error:', error);
    res.status(500).json({
        success: false,
        message: 'Server error'
    });
  }
};

const getFiles = async (req, res) => {  
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            $or: [
              { owner: req.user._id },
              { 'collaborators.user': req.user._id }
            ]
        });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }
        const files = await File.find({ project: project._id });
        
        const filesResponse = files.map(file => {
            const fileObj = file.toObject();
            fileObj.name = fileObj.filename;
            delete fileObj.filename;
            return fileObj;
        });
        
        res.json({
            success: true,
            count: filesResponse.length,
            data: filesResponse
        });
    } catch (error) {
        console.error('Get files error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
  createFile,
  getFiles
};