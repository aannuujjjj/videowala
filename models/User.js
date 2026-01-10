const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // username (PRIMARY IDENTITY)
    username: {
      type: String,
      required: function () {
        return this.authProvider === 'local';
      },
      trim: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: function () {
        return this.authProvider === 'local';
      },
    },

    dob: {
      type: Date,
      required: function () {
        return this.authProvider === 'local';
      },
    },

    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },

    googleId: {
      type: String,
      default: null,
    },

    // 🔹 PROFILE FIELDS
    bio: {
      type: String,
      maxlength: 300,
      default: '',
    },

    avatar: {
      type: String,
      default: '',
    },

    phone: {
      type: String,
      default: '',
    },

    // reset password
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
    resetOtp: String,
    resetOtpExpiry: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
