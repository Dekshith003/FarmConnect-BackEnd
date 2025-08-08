// Trending Crops Controller
class TrendingController {
  constructor(cropService) {
    this.cropService = cropService;
  }

  async getTrending(req, res, next) {
    try {
      // Stub: get top 5 crops by number of listings (improve algorithm later)
      const trending = await this.cropService.getTrendingCrops();
      res.json({ trending });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TrendingController;
