const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middleware/upload"); 
const { protect } = require("../middleware/authMiddleware"); 

// ✅ 1. Get Current User Profile (Bio, Phone, etc.)
router.get("/profile", protect, userController.getUserProfile);

// ✅ 2. Update Profile Picture
router.put("/update-profile-pic", protect, upload.single("profilePic"), userController.updateProfilePic);

// ✅ 3. Update User Details (Name, Phone, Bio, Location)
router.put("/update-details", protect, userController.updateUserDetails);

module.exports = router;