// services/crop.service.js

const logger = require("../utils/logger");
const Crop = require("../models/Crop");

module.exports = () => {
  const createCrop = async (farmerId, cropData) => {
    const payload = { ...cropData, farmer: farmerId };
    const crop = await Crop.create(payload);
    logger.info("CropService: crop created %s", crop._id);
    return crop;
  };

  const getMyCrops = async (farmerId) => {
    return await Crop.find({ farmer: farmerId });
  };

  const markCropSold = async (farmerId, cropId) => {
    const updated = await Crop.findOneAndUpdate(
      { _id: cropId, farmer: farmerId },
      { isSold: true },
      { new: true }
    );
    if (!updated)
      throw Object.assign(new Error("Crop not found or not owned by farmer"), {
        statusCode: 404,
      });
    return updated;
  };

  const removeCrop = async (farmerId, cropId) => {
    const deleted = await Crop.findOneAndDelete({
      _id: cropId,
      farmer: farmerId,
    });
    if (!deleted)
      throw Object.assign(new Error("Crop not found or not owned by farmer"), {
        statusCode: 404,
      });
    return deleted;
  };

  const marketplaceSearch = async (filters) => {
    // Build query from filters as needed
    return await Crop.find({ isSold: false, ...filters });
  };

  const getCropDetails = async (cropId) => {
    const crop = await Crop.findById(cropId);
    if (!crop)
      throw Object.assign(new Error("Crop not found"), { statusCode: 404 });
    return crop;
  };

  // Get top 5 trending crops by number of unsold listings
  const getTrendingCrops = async () => {
    const trending = await Crop.aggregate([
      { $match: { isSold: false } },
      {
        $group: {
          _id: "$name",
          count: { $sum: 1 },
          category: { $first: "$category" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { name: "$_id", count: 1, category: 1, _id: 0 } },
    ]);
    return trending;
  };

  return {
    createCrop,
    getMyCrops,
    markCropSold,
    removeCrop,
    marketplaceSearch,
    getCropDetails,
    getTrendingCrops,
  };
};
