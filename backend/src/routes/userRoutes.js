const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  resetPassword,
} = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateUserProfile);
router.put("/change-password", verifyToken, changePassword);
router.post("/reset-password", resetPassword);

module.exports = router;
