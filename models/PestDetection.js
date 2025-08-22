const mongoose = require("mongoose");

const pestSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },
    imageUrl: String,
    detectedIssue: Object,
    confidence: Number,
    recommendations: Object,
    pestName: String,
    cropLocation: String,
    cropName: String,
    severity: String,
    suggestions: [String],
    detectedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("PestDetection", pestSchema);
