// services/map.service.js

const logger = require("../utils/logger");
const Crop = require("../models/Crop");
const Farmer = require("../models/Farmer");

module.exports = ({ marketService, aiService }) => {
  /**
   * Find nearby crops within radius (meters). If none found, returns empty list.
   * filters may include: lat, lng, radius, category, priceMin, priceMax, search
   */
  const findNearbyCrops = async (filters = {}) => {
    // Example: filter by location (implement geo queries as needed)
    return await Crop.find(filters);
  };

  /**
   * Find nearby farms (unique farmer info) within radius
   */
  const findNearbyFarms = async ({ lat, lng, radius = 50000 }) => {
    try {
      const maxDistance = Number(radius || 50000);
      const farms = await Farmer.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(lng), Number(lat)],
            },
            $maxDistance: maxDistance,
          },
        },
      }).select("name location profileCompleted");
      return farms;
    } catch (err) {
      logger.error("findNearbyFarms error: %o", err);
      throw err;
    }
  };

  /**
   * Aggregate counts of crop types in the nearby area
   */
  const aggregateNearbyCropSummary = async (filters = {}) => {
    const crops = await findNearbyCrops(filters);
    const summary = {};
    for (const c of crops) {
      summary[c.name] = (summary[c.name] || 0) + (c.quantity || 1);
    }
    const summaryArr = Object.entries(summary)
      .map(([crop, qty]) => ({ crop, qty }))
      .sort((a, b) => b.qty - a.qty);
    return {
      totalListings: crops.length,
      summary: summaryArr.slice(0, 20),
      raw: crops,
    };
  };

  const getLocationBasedRecommendations = async (options = {}) => {
    const { lat, lng, radius = 50000, role = "customer", season } = options;
    if (!lat || !lng) {
      const err = new Error("lat and lng are required");
      err.statusCode = 400;
      throw err;
    }
    const filters = { lat, lng, radius };
    const nearbyCrops = await findNearbyCrops(filters);
    // ...existing stats and AI logic...
    // (copy from your previous implementation)
    return { nearbyCount: nearbyCrops.length, raw: nearbyCrops };
  };

  return {
    findNearbyCrops,
    findNearbyFarms,
    aggregateNearbyCropSummary,
    getLocationBasedRecommendations,
  };
};
