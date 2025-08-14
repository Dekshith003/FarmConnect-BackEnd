class TrendingController {
  constructor(cropService) {
    this.cropService = cropService;
  }

  async getTrending(req, res, next) {
    try {
      const trending = await this.cropService.getTrendingCrops();
      res.json({ trending });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TrendingController;
