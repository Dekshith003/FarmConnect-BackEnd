// controllers/map.controller.js
module.exports = ({ mapService }) => {
  const logger = require("../utils/logger");

  const nearbyCrops = async (req, res, next) => {
    try {
      const { lat, lng, radius, category, search, priceMin, priceMax } =
        req.query;
      if (!lat || !lng)
        return res.status(400).json({ message: "lat and lng required" });
      const filters = {
        lat,
        lng,
        radius,
        category,
        search,
        priceMin,
        priceMax,
      };
      const crops = await mapService.findNearbyCrops(filters);
      return res.json({ count: crops.length, crops });
    } catch (err) {
      next(err);
    }
  };

  const nearbyFarms = async (req, res, next) => {
    try {
      const { lat, lng, radius } = req.query;
      if (!lat || !lng)
        return res.status(400).json({ message: "lat and lng required" });
      const farms = await mapService.findNearbyFarms({
        lat,
        lng,
        radius: radius || 50000,
      });
      return res.json({ count: farms.length, farms });
    } catch (err) {
      next(err);
    }
  };

  const summary = async (req, res, next) => {
    try {
      const { lat, lng, radius } = req.query;
      if (!lat || !lng)
        return res.status(400).json({ message: "lat and lng required" });
      const agg = await mapService.aggregateNearbyCropSummary({
        lat,
        lng,
        radius,
      });
      return res.json(agg);
    } catch (err) {
      next(err);
    }
  };

  const recommendations = async (req, res, next) => {
    try {
      const { lat, lng, radius, season } = req.body;
      if (!lat || !lng)
        return res.status(400).json({ message: "lat and lng required" });
      const role = req.user?.role || "customer";
      const result = await mapService.getLocationBasedRecommendations({
        lat,
        lng,
        radius,
        role,
        season,
      });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  };

  return { nearbyCrops, nearbyFarms, summary, recommendations };
};
