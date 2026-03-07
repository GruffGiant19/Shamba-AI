const express = require("express");
const Log = require("../models/Log");

const router = express.Router();

// POST /api/logs — save a new log entry
router.post("/", async (req, res) => {
  try {
    const {
      firebaseUid,
      activityType,
      crop,
      description,
      cost,
      quantity,
      date,
    } = req.body;

    if (!firebaseUid || !activityType || !crop || !date) {
      return res
        .status(400)
        .json({
          error: "firebaseUid, activityType, crop, and date are required",
        });
    }

    const log = await Log.create({
      firebaseUid,
      activityType,
      crop,
      description: description || "",
      cost: cost || 0,
      quantity: quantity || 0,
      date: new Date(date),
    });

    return res.status(201).json({ message: "Log saved", log });
  } catch (error) {
    console.error("❌ Failed to save log:", error);
    return res.status(500).json({ error: "Failed to save log" });
  }
});

// GET /api/logs/:firebaseUid — get all logs for a user
router.get("/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const { type } = req.query; // optional filter: ?type=harvest

    const query = { firebaseUid };
    if (type) query.activityType = type;

    const logs = await Log.find(query).sort({ date: -1 });

    return res.status(200).json({ logs });
  } catch (error) {
    console.error("❌ Failed to fetch logs:", error);
    return res.status(500).json({ error: "Failed to fetch logs" });
  }
});

// DELETE /api/logs/:logId — delete a single log
router.delete("/:logId", async (req, res) => {
  try {
    const { logId } = req.params;

    const deleted = await Log.findByIdAndDelete(logId);
    if (!deleted) {
      return res.status(404).json({ error: "Log not found" });
    }

    return res.status(200).json({ message: "Log deleted" });
  } catch (error) {
    console.error("❌ Failed to delete log:", error);
    return res.status(500).json({ error: "Failed to delete log" });
  }
});

module.exports = router;
