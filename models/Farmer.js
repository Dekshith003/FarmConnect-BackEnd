const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    role: { type: String, required: true },
    farmName: { type: String },
    farmSize: { type: String },
    farmType: { type: String },
    experience: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: {
      code: String,
      expiresAt: Date,
    },
    profileCompleted: { type: Boolean, default: false },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
    // Optionally keep landSize/cropsPlanted if needed for future
  },
  { timestamps: true }
);

farmerSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Farmer", farmerSchema);
