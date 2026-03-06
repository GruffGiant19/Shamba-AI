const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Create or update onboarding/profile data for a Firebase user.
router.post("/profile", async (req, res) => {
  try {
    const { firebaseUid, email, ...updates } = req.body;

    if (!firebaseUid || !email) {
      return res.status(400).json({ error: "firebaseUid and email are required" });
    }

    const user = await User.findOneAndUpdate(
      { firebaseUid },
      {
        $set: {
          email,
          ...updates,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({ message: "Profile saved", user });
  } catch (error) {
    console.error("❌ Failed to save profile:", error);
    return res.status(500).json({ error: "Failed to save user profile" });
  }
});

router.get("/profile/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ error: "User profile not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("❌ Failed to load profile:", error);
    return res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

module.exports = router;
