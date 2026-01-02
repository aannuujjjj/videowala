const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const uploadVideo = require('../middleware/multerVideo');

// Upload video (now functional)
router.post(
  '/upload',
  authMiddleware,
  uploadVideo.single('video'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        message: 'No video uploaded'
      });
    }

    return res.status(200).json({
      message: 'Video uploaded temporarily',
      file: {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  }
);

// Get logged-in user's videos (still placeholder)
router.get('/my-videos', authMiddleware, (req, res) => {
  return res.status(200).json({
    message: 'My videos route reachable'
  });
});

// Delete video (still placeholder)
router.delete('/:id', authMiddleware, (req, res) => {
  return res.status(200).json({
    message: 'Delete route reachable'
  });
});

module.exports = router;
