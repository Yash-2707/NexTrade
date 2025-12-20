const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // Auto-converts to lowercase
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "", // Consider a default placeholder URL here if you want
    },
    role: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    bio: {
      type: String,
      default: "No bio available.",
      trim: true,
    },
    location: {
      type: String,
      default: "Unknown Location",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);