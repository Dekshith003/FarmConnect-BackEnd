const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "role",
      required: true,
    },
    role: {
      type: String,
      enum: ["Farmer", "Customer", "Admin"],
      required: true,
    },
    type: { type: String, required: true }, // e.g. 'info', 'success', 'warning', 'error', 'system', etc.
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    data: { type: Object }, // optional payload for context
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
