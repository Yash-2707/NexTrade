const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    category: { type: String, required: true },

    price: { type: Number, required: true },

    description: { type: String, required: true },

    condition: {
      type: String,
      enum: ["new", "used"],
      required: true
    },

    location: { type: String, required: true },

    images: [
      {
        url: String,
        public_id: String
      }
    ],

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
