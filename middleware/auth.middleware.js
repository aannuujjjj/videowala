const jwt = require('jsonwebtoken');
const UserSession = require('../models/UserSession');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const refreshToken = req.headers['x-refresh-token'];
    const deviceId = req.headers['x-device-id'];

    if (!authHeader || !refreshToken || !deviceId) {
      return res.status(401).json({
        message: 'Session expired. Please login again.',
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id || decoded._id || decoded.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // 🔥 CHECK ACTIVE SESSION
    const session = await UserSession.findOne({
      user: userId,
      refreshToken,
      deviceId,
      isActive: true,
    });

    if (!session) {
      return res.status(401).json({
        message: 'Logged out because you logged in on another device',
      });
    }

    // Update activity (optional but good)
    session.lastActiveAt = new Date();
    await session.save();

    req.user = { id: userId };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
