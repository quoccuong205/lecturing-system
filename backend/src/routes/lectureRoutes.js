const express = require("express");
const {
  createLecture,
  getLectures,
  getLectureById,
  updateLecture,
  deleteLecture,
} = require("../controllers/lectureController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();

router.post("/", verifyToken, isAdmin, upload.single("video"), createLecture);
router.get("/", verifyToken, getLectures);
router.get("/:id", verifyToken, getLectureById);
router.put("/:id", verifyToken, isAdmin, upload.single("video"), updateLecture);
router.delete("/:id", verifyToken, isAdmin, deleteLecture);

module.exports = router;
