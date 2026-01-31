const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const {
  createFile,
  getFiles
} = require('../controllers/filesController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/project', protect, createProject);
router.get('/project', protect, getProjects);

router.put('/project/:id', protect, updateProject);
router.get('/project/:id', protect, getProject);
router.delete('/project/:id', protect, deleteProject);

router.post('/project/:id/create-file', protect, createFile);
router.get('/project/:id/get-files', protect, getFiles);

module.exports = router;