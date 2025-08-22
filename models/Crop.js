// models/Crop.js
const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true },
    unit: { type: String, default: "kg" },
    price: { type: Number, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    images: [{ type: String }], // array of uploaded image paths/URLs
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },
    isSold: { type: Boolean, default: false },
    postedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Crop", cropSchema);
