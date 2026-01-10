const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    trim: true,
    maxlength: 150,
    default: '',
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: '',
  },
  videoPath: {
    type: String,
    required: true
  },
  originalName: {
    type: String
  },
  size: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Video', videoSchema);
