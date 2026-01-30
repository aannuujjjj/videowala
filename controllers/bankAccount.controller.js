const BankAccount = require("../models/BankAccount");

exports.upsertBankAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      accountHolderName,
      bankName,
      branchAddress,
      ifsc,
    } = req.body;

    // Basic validation (keep it strict)
    if (
      !accountHolderName ||
      !bankName ||
      !branchAddress ||
      !ifsc
    ) {
      return res.status(400).json({
        message: "All bank fields are required",
      });
    }

    let bankAccount = await BankAccount.findOne({ userId });

    if (bankAccount) {
      // UPDATE existing
      bankAccount.accountHolderName = accountHolderName;
      bankAccount.bankName = bankName;
      bankAccount.branchAddress = branchAddress;
      bankAccount.ifsc = ifsc;
      bankAccount.status = "NON_VERIFIED";
      bankAccount.verifiedAt = null;
      bankAccount.verifiedBy = null;

      await bankAccount.save();
    } else {
      // CREATE new
      bankAccount = await BankAccount.create({
        userId,
        accountHolderName,
        bankName,
        branchAddress,
        ifsc,
      });
    }

    return res.status(200).json({
      message: "Bank account saved successfully",
      bankAccount,
    });
  } catch (err) {
    console.error("Bank account save error:", err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ==================== ADDITION ONLY ====================
exports.getBankAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const bankAccount = await BankAccount.findOne({ userId });

    return res.status(200).json({
      bankAccount: bankAccount || null,
    });
  } catch (err) {
    console.error("Get bank account error:", err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
