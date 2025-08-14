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
    phone: { type: String },
    address: { type: String },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    bio: { type: String },
    avatar: { type: String }, // <-- Added avatar field
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
