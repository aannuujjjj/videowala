require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const videoRoutes = require('./routes/video.routes'); // ✅ NEW

const app = express();

/**
 * CORS CONFIG (PRODUCTION SAFE)
 */
const allowedOrigins = [
  'https://videowala.vercel.app',
  'http://localhost:3000',
  'https://happy-rock-0fc3e3600.2.azurestaticapps.net'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

/**
 * Body parser
 */
app.use(express.json());

/**
 * Serve uploaded files
 * Example:
 * https://your-backend-url/uploads/videos/filename.mp4
 */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/**
 * Routes
 */
app.use('/auth', authRoutes);
app.use('/videos', videoRoutes); // ✅ NEW (VIDEO MODULE)

/**
 * Health check
 */
app.get('/', (req, res) => {
  res.send('Backend running');
});

/**
 * DB connect + server start
 */
const PORT = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log('Server running on port', PORT);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
  });
