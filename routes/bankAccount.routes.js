const express = require("express");
const router = express.Router();

const {
  upsertBankAccount,
  getBankAccount,
} = require("../controllers/bankAccount.controller");

const auth = require("../middleware/auth.middleware"); // adjust name if yours differs

// Create or update bank account (user)

router.put('/', auth, upsertBankAccount);
router.get('/', auth, getBankAccount);





module.exports = router;
