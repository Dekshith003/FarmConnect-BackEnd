const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
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
  },
  { timestamps: true }
);

farmerSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Farmer", farmerSchema);
