const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    role: {
      type: String,
      enum: ["Farmer", "Customer"],
      required: true,
    },
    // Common fields
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zip: { type: String, default: "" },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    // Farmer-specific fields
    farmName: { type: String, default: "" },
    landSize: { type: String, default: "" },
    farmType: { type: String, default: "" },
    experience: { type: String, default: "" },
    // Customer-specific fields
    businessName: { type: String, default: "" },
    businessType: { type: String, default: "" },
    orderVolume: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
