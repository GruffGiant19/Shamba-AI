const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Middleware FIRST — before any routes
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(express.json());

// ✅ Debug logger
app.use((req, res, next) => {
  console.log(`🌍 ${req.method} ${req.url}`);
  next();
});

// ✅ Routes AFTER middleware
app.get("/", (req, res) => {
  res.json({ message: "Shamba API is running 🌱" });
});

const userRoutes = require("./routes/UserRoutes");
app.use("/api/users", userRoutes);

const logRoutes = require("./routes/LogRoutes");
app.use("/api/logs", logRoutes);

// ✅ DB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5050;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
