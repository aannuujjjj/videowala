const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const uploadVideo = require('../middleware/multerVideo');
const Video = require('../models/Video');

const fs = require('fs');
const path = require('path');

// ============================
// Upload video (max 3 per user)
// ============================
router.post(
  '/upload',
  authMiddleware,
  uploadVideo.single('video'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No video uploaded' });
      }

      const userId = req.user.id;

      // 1️⃣ Fetch existing videos (oldest first)
      const existingVideos = await Video.find({ user: userId })
        .sort({ createdAt: 1 });

      // 2️⃣ If already 3 videos, delete the oldest
      if (existingVideos.length >= 3) {
        const oldestVideo = existingVideos[0];

        const absolutePath = path.resolve(oldestVideo.videoPath);

        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath); // HARD DELETE
        }

        await Video.findByIdAndDelete(oldestVideo._id);
      }

      // 3️⃣ Save new video record
      const newVideo = await Video.create({
        user: userId,
        videoPath: req.file.path, // relative path
        originalName: req.file.originalname,
        size: req.file.size
      });

      return res.status(201).json({
        message: 'Video uploaded successfully',
        video: newVideo
      });

    } catch (error) {
      console.error('Video upload error:', error);
      return res.status(500).json({ message: 'Video upload failed' });
    }
  }
);

// ============================
// Get logged-in user's videos
// ============================
router.get('/my-videos', authMiddleware, async (req, res) => {
  try {
    const videos = await Video.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    return res.status(200).json({ videos });
  } catch (error) {
    console.error('Fetch videos error:', error);
    return res.status(500).json({ message: 'Failed to fetch videos' });
  }
});

// ============================
// Delete a video (hard delete)
// ============================
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.id;

    // 1️⃣ Find video
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // 2️⃣ Ownership check
    if (video.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this video' });
    }

    // 3️⃣ Delete file from server
    const absolutePath = path.resolve(video.videoPath);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath); // HARD DELETE
    }

    // 4️⃣ Delete DB record
    await Video.findByIdAndDelete(videoId);

    return res.status(200).json({ message: 'Video deleted successfully' });

  } catch (error) {
    console.error('Delete video error:', error);
    return res.status(500).json({ message: 'Failed to delete video' });
  }
});

module.exports = router;
