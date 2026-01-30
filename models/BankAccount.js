const mongoose = require("mongoose");

const bankAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one bank account per user
    },

    accountHolderName: {
      type: String,
      trim: true,
      required: true,
    },

    bankName: {
      type: String,
      trim: true,
      required: true,
    },

    branchAddress: {
      type: String,
      trim: true,
      required: true,
    },

    ifsc: {
      type: String,
      uppercase: true,
      required: true,
    },

    status: {
      type: String,
      enum: ["NON_VERIFIED", "VERIFIED"],
      default: "NON_VERIFIED",
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BankAccount", bankAccountSchema);
