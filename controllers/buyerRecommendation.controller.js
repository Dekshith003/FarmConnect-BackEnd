// Buyer Recommendation Controller
class BuyerRecommendationController {
  constructor(aiService) {
    this.aiService = aiService;
  }

  async recommend(req, res, next) {
    // Stub: use AI to recommend crops for buyer
    try {
      const { context } = req.body;
      const recommendations = await this.aiService.getAiCropRecommendations(
        context.name,
        context.location,
        context.season,
        context.cropHistory || []
      );
      res.json({ recommendations });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = BuyerRecommendationController;
