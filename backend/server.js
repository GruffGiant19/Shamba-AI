const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check routes (BEFORE other routes)
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Shamba API is running",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

// API Routes
const userRoutes = require("./routes/UserRoutes");
const logRoutes = require("./routes/LogRoutes");

app.use("/api/users", userRoutes);
app.use("/api/logs", logRoutes);

// 404 handler (for debugging)
app.use((req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.path,
    method: req.method
  });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://derrickarhinbannerman_db_user:YOUR_PASSWORD@cluster0.lsjbyht.mongodb.net/shamba";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start Server
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});