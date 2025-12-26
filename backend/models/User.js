const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // username for local signup
    username: {
      type: String,
      required: function () {
        return this.authProvider === 'local';
      },
      trim: true,
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

    // date of birth (age derived from this)
    dob: {
      type: Date,
      required: function () {
        return this.authProvider === 'local';
      },
    },

    // auth type
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },

    // google-specific
    googleId: {
      type: String,
      default: null,
    },

    // reset password
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiry: {
      type: Date,
    },
    resetOtp: {
    type: String,
    },
    resetOtpExpiry: {
    type: Date,
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
