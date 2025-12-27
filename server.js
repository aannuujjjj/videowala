require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');

const app = express();

/**
 * TEMP CORS (safe for now)
 * We will lock this later when frontend is deployed
 */
app.use(cors());

/**
 * Body parser
 */
app.use(express.json());

/**
 * Routes
 */
app.use('/auth', authRoutes);

/**
 * Health check route
 */
app.get('/', (req, res) => {
  res.send('Backend running');
});

/**
 * Connect DB and start server ONLY after success
 */
const PORT = process.env.PORT;

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
