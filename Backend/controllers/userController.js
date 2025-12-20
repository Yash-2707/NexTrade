const User = require("../models/User");
const cloudinary = require("../config/cloudinary"); 
const fs = require("fs"); 

// ✅ 1. GET USER PROFILE (The missing piece to fix your display issue)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ 2. UPDATE PROFILE PICTURE
exports.updateProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "user_profiles",
    });

    // Cleanup local file
    if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
    }

    // Update DB
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profilePic: result.secure_url },
      { new: true } 
    ).select("-password"); 

    res.status(200).json({
      message: "Profile picture updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Profile Pic Update Error:", error);
    if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ 3. UPDATE USER DETAILS (Name, Phone, Bio, Location)
exports.updateUserDetails = async (req, res) => {
    try {
        const { name, phone, bio, location } = req.body; 

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields only if provided
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (bio) user.bio = bio;
        if (location) user.location = location; 

        const updatedUser = await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profilePic: updatedUser.profilePic,
                phone: updatedUser.phone,
                bio: updatedUser.bio,
                location: updatedUser.location,
                createdAt: updatedUser.createdAt
            }
        });

    } catch (error) {
        console.error("Update Details Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};