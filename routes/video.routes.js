const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const uploadVideo = require('../middleware/multerVideo');
const Video = require('../models/Video');
const compressVideo = require('../utils/compressVideo');

const fs = require('fs');
const path = require('path');

// ============================
// Helper: safely delete file
// ============================
const deleteFileIfExists = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('File delete error:', err);
  }
};

//
// ============================
// Upload video (auto keep max 3)
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
      const { title = '', description = '' } = req.body;

      // 1️⃣ Compress uploaded video
      const compressedPath = await compressVideo(req.file.path);

      // 2️⃣ Remove original uploaded file
      deleteFileIfExists(req.file.path);

      // 3️⃣ Save video in DB
      const newVideo = await Video.create({
        user: userId,
        title,
        description,
        videoPath: compressedPath,
        originalName: req.file.originalname,
        size: req.file.size,
      });

      // 4️⃣ Fetch all user videos (oldest first)
      const userVideos = await Video.find({ user: userId })
        .sort({ createdAt: 1 });

      // 5️⃣ Keep max 3 videos
      if (userVideos.length > 3) {
        const excessCount = userVideos.length - 3;
        const videosToDelete = userVideos.slice(0, excessCount);

        for (const video of videosToDelete) {
          const oldFilePath = path.join(__dirname, '..', video.videoPath);
          deleteFileIfExists(oldFilePath);
          await Video.findByIdAndDelete(video._id);
        }
      }

      return res.status(201).json({
        message: 'Video uploaded successfully',
        video: {
          ...newVideo.toObject(),
          url: `${process.env.BACKEND_URL}/${newVideo.videoPath}`,
        },
      });

    } catch (error) {
      console.error('Video upload error:', error);
      return res.status(500).json({ message: 'Video upload failed' });
    }
  }
);

//
// ============================
// Get ALL videos (with pagination)
// ============================
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const videos = await Video.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Video.countDocuments();

    const formattedVideos = videos.map(video => ({
      ...video.toObject(),
      url: `${process.env.BACKEND_URL}/${video.videoPath}`,
    }));

    return res.status(200).json({
      count: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      videos: formattedVideos,
    });

  } catch (error) {
    console.error('Fetch all videos error:', error);
    return res.status(500).json({ message: 'Failed to fetch all videos' });
  }
});

//
// ============================
// Get logged-in user's videos (with pagination)
// ============================
router.get('/my-videos', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const videos = await Video.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Video.countDocuments({ user: userId });

    const formattedVideos = videos.map(video => ({
      ...video.toObject(),
      url: `${process.env.BACKEND_URL}/${video.videoPath}`,
    }));

    return res.status(200).json({
      count: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      videos: formattedVideos,
    });

  } catch (error) {
    console.error('Fetch my videos error:', error);
    return res.status(500).json({ message: 'Failed to fetch videos' });
  }
});

//
// ============================
// Delete a video (hard delete)
// ============================
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const video = await Video.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const filePath = path.join(__dirname, '..', video.videoPath);
    deleteFileIfExists(filePath);

    await Video.findByIdAndDelete(video._id);

    return res.status(200).json({ message: 'Video deleted successfully' });

  } catch (error) {
    console.error('Delete video error:', error);
    return res.status(500).json({ message: 'Failed to delete video' });
  }
});

module.exports = router;
