const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true, // Optimizes search by title
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true, // Optimizes filtering by category
    },
    brand: {
      type: String,
      required: false, // Optional: enforced by frontend logic where needed
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      index: true, // Optimizes price sorting/range queries
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    condition: {
      type: String,
      enum: ["new", "used"],
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      index: true, // Optimizes location search
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);