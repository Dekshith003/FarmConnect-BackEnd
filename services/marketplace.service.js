// services/marketplace.service.js

const Crop = require("../models/Crop");

module.exports = function MarketplaceService({ aiService }) {
  return {
    async getCrops(filters = {}) {
      return await Crop.find(filters);
    },
    async getNearbyCrops(lat, lng, radiusKm, filters = {}) {
      // Example: filter by location (implement geo queries as needed)
      const nearby = await Crop.find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [lng, lat] },
            $maxDistance: radiusKm * 1000,
          },
        },
      });
      if (nearby.length > 0) return nearby;
      return await Crop.find(filters);
    },
    async getAiRecommendationsForCustomer(lat, lng) {
      // Example: use AI service for recommendations
      const nearbyCrops = await Crop.find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [lng, lat] },
            $maxDistance: 50000,
          },
        },
      });
      const cropNames = nearbyCrops.map((c) => c.name);
      if (cropNames.length === 0)
        return { message: "No nearby crops found for recommendations" };
      const prompt = `Based on these crops available nearby: ${cropNames.join(
        ", "
      )}, recommend other high-demand crops in the area with average market prices and brief buying tips. Respond in JSON with { recommendations: [ { name, price, tip } ] }`;
      return aiService.getStructuredResponse(prompt);
    },
    async getCropDetails(cropId) {
      return await Crop.findById(cropId);
    },
  };
};
