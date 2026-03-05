const express = require("express");
const router = express.Router();
const User = require("../models/User");

//Create or update user profile
router.post("/profile", async (req, res) => {
  try {
    const {
      fullName,
      firebaseUid,
      email,
      phoneNumber,
      farmProfile,
      experience,
      notifications,
    } = req.body;
    let user = await User.findOne({ firebaseUid });
    if (user) {
      user.fullName = fullName || user.fullName;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.farmProfile = farmProfile || user.farmProfile;
      user.experience = experience || user.experience;
      user.notifications = notifications || user.notifications;

      await user.save();
    }
    res.status(200).json({sucess: true, user});
  } catch (error) {
    res.status(500).json({success: false, error: error.message })
  }
});

//Get
router.get("/profile/:firebaseUid", async(req,res) => {
    try {
        const user = await User.findOne({firebaseUid: req.params.firebaseUid});
        if(!user){
            return res.status(404).json({success: false, message: 'User not Found ❓'})
        }
        res.status(200).json({success:true,user})
    }catch(error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;