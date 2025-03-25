const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

// Set strictQuery to suppress the deprecation warning
mongoose.set("strictQuery", false);

const app = express();
app.use(express.json());
app.use(cors());

// Add Swagger documentation
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./src/swagger.json");

// Use Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Import routes
const authRoutes = require("./src/routes/authRoutes");
const lectureRoutes = require("./src/routes/lectureRoutes");
const userRoutes = require("./src/routes/userRoutes");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/users", userRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Serve the frontend for any route not starting with /api
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
} else {
  // Simple route to check if the server is running (dev only)
  app.get("/", (req, res) => {
    res.send({
      message: "Lecture Management System API is running!",
      routes: {
        auth: "/api/auth",
        lectures: "/api/lectures",
        users: "/api/users",
        documentation: "/api-docs",
      },
    });
  });
}

// MongoDB connection with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    console.log("Attempting to connect to local MongoDB instance...");

    try {
      // Fallback to local MongoDB if cloud connection fails
      await mongoose.connect("mongodb://localhost:27017/lecture-system", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to local MongoDB instance");
    } catch (localErr) {
      console.error("Failed to connect to local MongoDB:", localErr.message);
      console.error("Please check your MongoDB connection string in .env file");
      process.exit(1); // Exit with failure
    }
  }
};

// Connect to MongoDB
connectDB();

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "production" ? null : err.message,
  });
});

// Add catch-all route handler for undefined routes
app.use("*", (req, res) => {
  console.log(`Route not found: ${req.method} ${req.originalUrl}`);
  if (req.originalUrl.startsWith("/api")) {
    res.status(404).json({
      message: `Cannot ${req.method} ${req.originalUrl}`,
      availableRoutes: {
        auth: ["/api/auth/register [POST]", "/api/auth/login [POST]"],
        lectures: [
          "/api/lectures [GET, POST]",
          "/api/lectures/:id [GET, PUT, DELETE]",
        ],
        users: [
          "/api/users/profile [GET, PUT]",
          "/api/users/change-password [PUT]",
          "/api/users/reset-password [POST]",
        ],
      },
    });
  } else if (process.env.NODE_ENV === "production") {
    // For non-API routes in production, serve the frontend
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  } else {
    res.status(404).json({ message: "Route not found" });
  }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});
