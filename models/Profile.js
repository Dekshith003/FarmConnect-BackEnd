const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "role",
      required: true,
    },
    role: {
      type: String,
      enum: ["Farmer", "Customer"],
      required: true,
    },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    farmName: { type: String },
    landSize: { type: String },
    farmType: { type: String },
    experience: { type: String },
    // Customer fields
    businessName: { type: String },
    businessType: { type: String },
    orderVolume: { type: String },
    bio: { type: String },
    avatar: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
