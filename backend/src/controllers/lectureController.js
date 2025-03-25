const Lecture = require("../models/Lecture");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const isS3Configured = () => {
  return (
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION &&
    process.env.AWS_BUCKET_NAME
  );
};

const createLecture = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Video file is required" });
    }

    let videoUrl;

    // Use S3 if configured, otherwise use a mock URL for development
    if (isS3Configured()) {
      // Upload video to S3
      const fileKey = `lectures/${uuidv4()}-${req.file.originalname}`;
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const uploadResult = await s3.upload(uploadParams).promise();
      videoUrl = uploadResult.Location;
    } else {
      // For development without S3 configured
      console.log("AWS S3 not configured - using mock URL");
      videoUrl = `http://localhost:5001/mock-s3/${uuidv4()}-${
        req.file.originalname
      }`;
    }

    // Create lecture in database
    const newLecture = new Lecture({
      title,
      description,
      videoUrl,
      createdBy: req.user.id,
    });

    await newLecture.save();

    res.status(201).json({
      message: "Lecture created successfully",
      lecture: newLecture,
    });
  } catch (error) {
    console.error("Create lecture error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getLectures = async (req, res) => {
  try {
    // If admin, get all lectures. If user, get only their own lectures
    const lectures =
      req.user.role === "admin"
        ? await Lecture.find()
            .sort({ createdAt: -1 })
            .populate("createdBy", "username")
        : await Lecture.find().sort({ createdAt: -1 });

    res.status(200).json(lectures);
  } catch (error) {
    console.error("Get lectures error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getLectureById = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id).populate(
      "createdBy",
      "username"
    );

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    res.status(200).json(lecture);
  } catch (error) {
    console.error("Get lecture error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateLecture = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Find lecture
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    // Check if user is admin or the creator of the lecture
    if (
      req.user.role !== "admin" &&
      lecture.createdBy.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this lecture" });
    }

    // Update lecture fields
    if (title) lecture.title = title;
    if (description) lecture.description = description;

    // If a new video is uploaded
    if (req.file) {
      let videoUrl;

      // Use S3 if configured, otherwise use a mock URL for development
      if (isS3Configured()) {
        // Upload to S3
        const fileKey = `lectures/${uuidv4()}-${req.file.originalname}`;
        const uploadParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileKey,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
          ACL: "public-read",
        };

        const uploadResult = await s3.upload(uploadParams).promise();
        videoUrl = uploadResult.Location;
      } else {
        // For development without S3 configured
        console.log("AWS S3 not configured - using mock URL");
        videoUrl = `http://localhost:5001/mock-s3/${uuidv4()}-${
          req.file.originalname
        }`;
      }

      lecture.videoUrl = videoUrl;
    }

    await lecture.save();

    res.status(200).json({
      message: "Lecture updated successfully",
      lecture,
    });
  } catch (error) {
    console.error("Update lecture error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    // Check if user is admin or the creator of the lecture
    if (
      req.user.role !== "admin" &&
      lecture.createdBy.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this lecture" });
    }

    // Delete from S3 if using S3
    if (
      isS3Configured() &&
      lecture.videoUrl &&
      lecture.videoUrl.includes(process.env.AWS_BUCKET_NAME)
    ) {
      try {
        // Extract S3 key from the videoUrl
        const urlParts = lecture.videoUrl.split("/");
        const key = urlParts.slice(3).join("/");

        const deleteParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
        };

        await s3.deleteObject(deleteParams).promise();
      } catch (s3Error) {
        console.error("S3 delete error:", s3Error);
        // Continue with deletion from database even if S3 deletion fails
      }
    } else {
      console.log(
        "AWS S3 not configured or URL not from S3 - skipping S3 delete"
      );
    }

    // Delete from database - use deleteOne instead of remove
    await Lecture.deleteOne({ _id: lecture._id });

    res.status(200).json({ message: "Lecture deleted successfully" });
  } catch (error) {
    console.error("Delete lecture error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createLecture,
  getLectures,
  getLectureById,
  updateLecture,
  deleteLecture,
};
