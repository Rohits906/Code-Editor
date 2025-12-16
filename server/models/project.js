const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  language: { 
    type: String, 
    required: true,
    enum: ['javascript', 'python', 'java', 'c', 'cpp', 'html', 'css', 'typescript']
  },
  code: { type: String, default: '// Start coding here...\n' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collaborators: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['viewer', 'editor'], default: 'viewer' }
  }],
  isPublic: { type: Boolean, default: false },
  isLive: { type: Boolean, default: false },
  tags: [{ type: String }],
  lastModified: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);  