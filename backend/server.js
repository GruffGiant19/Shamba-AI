const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use((req, res, next) => {
  console.log(`🌍 DEBUG: Received ${req.method} request at ${req.url}`);
  console.log(`Headers:`, JSON.stringify(req.headers));
  next();
});

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.json({ message: "Shamba API is running 🌱" });
});

const userRoutes = require("./routes/UserRoutes");
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Access from simulator: http://172.20.10.2:${PORT}`);
});
