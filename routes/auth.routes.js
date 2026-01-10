const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');

const User = require('../models/User');
const authMiddleware = require('../middleware/auth.middleware');
const { sendResetEmail } = require('../utils/mailer');

/* ======================================================
   GOOGLE LOGIN (MUST BE AT TOP)
====================================================== */

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google-login', async (req, res) => {
  try {

    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Google token required' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        username: name,
        email,
        authProvider: 'google',
        googleId: payload.sub,
      });
      await user.save();
    }

    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Google login successful',
      token: jwtToken,
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Google authentication failed' });
  }
});

/* ======================================================
   REGISTER
====================================================== */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, dob } = req.body;

    if (!username || !email || !password || !dob) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      dob: new Date(dob),
      authProvider: 'local',
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error',
    });
  }
});


/* ======================================================
   LOGIN
====================================================== */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ======================================================
   FORGOT PASSWORD
====================================================== */
router.post('/forgot-password', async (req, res) => {
  try {
    console.log('🔥 /forgot-password HIT');
    console.log('📩 Request body:', req.body);

    const email = req.body.email?.toLowerCase();

    if (!email) {
      console.log('❌ Email missing');
      return res.status(400).json({
        message: 'Email is required',
      });
    }

    const user = await User.findOne({ email });
    console.log('👤 User found:', !!user);

    // Always respond same message (security)
    if (!user) {
      return res.status(200).json({
        message: 'If user exists, OTP will be sent',
      });
    }

    // 🔐 Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔐 GENERATED OTP:', otp);

    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    console.log('✅ OTP SAVED TO DB');

    // 📧 SEND OTP EMAIL
    await sendResetEmail(user.email, otp);
    console.log('📧 OTP EMAIL SENT');

    return res.status(200).json({
      message: 'OTP sent to your email',
    });
  } catch (error) {
    console.error('🔥 FORGOT PASSWORD ERROR FULL:', error);

    return res.status(500).json({
      message: error.message || 'Server error while sending OTP',
    });
  }
});



/* ======================================================
   RESET PASSWORD
====================================================== */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: 'OTP and new password required',
      });
    }

    const user = await User.findOne({
      resetOtp: token,
      resetOtpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired OTP',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;

    await user.save({ validateBeforeSave: false });


    res.status(200).json({
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error',
    });
  }
});

/* ======================================================
   VERIFY OTP
====================================================== */
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: 'Email and OTP are required',
      });
    }

    const user = await User.findOne({
      email,
      resetOtp: otp,
      resetOtpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired OTP',
      });
    }

    res.status(200).json({
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error',
    });
  }
});

module.exports = router;
