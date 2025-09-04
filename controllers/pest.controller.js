module.exports = ({ pestService }) => {
  const notificationService = require("../services/notification.service")();
  const detectPest = async (req, res) => {
    if (!req.file)
      return res.status(400).json({ message: "Image is required" });
    const imageUrl = req.file
      ? `/uploads/pest-images/${req.file.filename}`
      : "";
    const result = await pestService.detectPestOrDisease(req.file.path);
    await pestService.saveDetection({
      farmerId: req.user.id,
      detectedIssue: result,
      imageUrl: result.imageUrl,
      confidence: result.confidence,
      recommendations: result.suggestions || null,
      pestName: result.pestName || "Unknown Pest",
      cropLocation: result.cropLocation,
      cropName: result.cropName,
      severity: result.severity || null,
      suggestions: result.suggestions || [],
      detectedAt: new Date(),
    });
    // Send notification to farmer
    await notificationService.createNotification(
      req.user.id,
      req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1),
      "info",
      `Pest detection completed for crop '${result.cropName || "Unknown"}'`,
      {
        pestName: result.pestName,
        confidence: result.confidence,
        severity: result.severity,
      }
    );
    return res
      .status(200)
      .json({ message: "Detection successful", data: result });
  };

  // Get pest detection history for the logged-in user
  const getHistory = async (req, res) => {
    try {
      const history = await pestService.getDetectionHistory(req.user.id);
      res.status(200).json(history);
      console.log(history);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch history", error: err.message });
    }
  };

  return { detectPest, getHistory };
};
