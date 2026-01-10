const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth.middleware');

/* ==========================================
   GET LOGGED-IN USER PROFILE
========================================== */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      'username email bio phone authProvider createdAt'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error('GET PROFILE ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ==========================================
   UPDATE USER PROFILE
========================================== */
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { bio, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { bio, phone },
      { new: true, runValidators: true }
    ).select('username email bio phone');

    res.status(200).json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('UPDATE PROFILE ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
