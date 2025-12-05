// const mongoose = require('mongoose');

// const projectSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Project name is required'],
//     trim: true,
//     maxlength: [100, 'Project name cannot be more than 100 characters']
//   },
//   description: {
//     type: String,
//     maxlength: [500, 'Description cannot be more than 500 characters']
//   },
//   language: {
//     type: String,
//     required: [true, 'Programming language is required'],
//     enum: ['javascript', 'python', 'java', 'cpp', 'c', 'html', 'css', 'php', 'ruby', 'go', 'rust', 'typescript']
//   },
//   code: {
//     type: String,
//     default: '// Start coding here...'
//   },
//   isPublic: {
//     type: Boolean,
//     default: false
//   },
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   collaborators: [{
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     role: {
//       type: String,
//       enum: ['viewer', 'editor'],
//       default: 'viewer'
//     }
//   }],
//   lastModified: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// // Update lastModified timestamp before saving
// projectSchema.pre('save', function(next) {
//   this.lastModified = new Date();
//   next();
// });

// module.exports = mongoose.model('Project', projectSchema);


// models/Project.js
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