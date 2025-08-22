const { getTreatmentRecommendations } = require("../utils/pestTreatmentMap");

// POST /api/treatment
// Body: { pestName: "Aphid" }
exports.getTreatment = async (req, res) => {
  try {
    const { pestName } = req.body;
    if (!pestName) {
      return res.status(400).json({ error: "pestName is required" });
    }
    // Use pestName as label for lookup
    const labels = [{ description: pestName }];
    const webEntities = [];
    const suggestions = await getTreatmentRecommendations(labels, webEntities);
    res.json({ pestName, suggestions });
  } catch (err) {
    res.status(500).json({ error: "Failed to get treatment recommendations" });
  }
};
