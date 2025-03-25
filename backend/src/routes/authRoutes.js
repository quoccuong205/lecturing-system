const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const router = express.Router();

// Log all requests to auth routes for debugging
router.use((req, res, next) => {
  console.log(`Auth API Request: ${req.method} ${req.originalUrl}`);
  next();
});

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
