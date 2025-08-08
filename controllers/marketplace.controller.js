// controllers/marketplace.controller.js
class MarketplaceController {
  constructor(marketplaceService) {
    this.marketplaceService = marketplaceService;

    this.getCrops = this.getCrops.bind(this);
    this.getNearbyCrops = this.getNearbyCrops.bind(this);
    this.getAiRecommendations = this.getAiRecommendations.bind(this);
    this.getCropDetails = this.getCropDetails.bind(this);
  }

  async getCrops(req, res, next) {
    try {
      const crops = await this.marketplaceService.getCrops(req.query);
      res.json(crops);
    } catch (err) {
      next(err);
    }
  }

  async getNearbyCrops(req, res, next) {
    try {
      const { lat, lng, radius } = req.query;
      if (!lat || !lng) {
        return res
          .status(400)
          .json({ message: "Latitude and longitude are required" });
      }
      const crops = await this.marketplaceService.getNearbyCrops(
        parseFloat(lat),
        parseFloat(lng),
        parseFloat(radius) || 50,
        req.query
      );
      res.json(crops);
    } catch (err) {
      next(err);
    }
  }

  async getAiRecommendations(req, res, next) {
    try {
      const { lat, lng } = req.query;
      if (!lat || !lng) {
        return res
          .status(400)
          .json({ message: "Latitude and longitude are required" });
      }
      const recommendations =
        await this.marketplaceService.getAiRecommendationsForCustomer(
          parseFloat(lat),
          parseFloat(lng)
        );
      res.json(recommendations);
    } catch (err) {
      next(err);
    }
  }

  async getCropDetails(req, res, next) {
    try {
      const crop = await this.marketplaceService.getCropDetails(req.params.id);
      if (!crop) {
        return res.status(404).json({ message: "Crop not found" });
      }
      res.json(crop);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MarketplaceController;
