const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

// Upload video (placeholder)
router.post('/upload', authMiddleware, (req, res) => {
  return res.status(200).json({
    message: 'Upload route reachable'
  });
});

// Get logged-in user's videos (placeholder)
router.get('/my-videos', authMiddleware, (req, res) => {
  return res.status(200).json({
    message: 'My videos route reachable'
  });
});

// Delete video (placeholder)
router.delete('/:id', authMiddleware, (req, res) => {
  return res.status(200).json({
    message: 'Delete route reachable'
  });
});

module.exports = router;
