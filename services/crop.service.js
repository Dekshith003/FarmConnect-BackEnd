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
    console.log(farmerId, "Fetching crops for farmer ID");
    return await Crop.find({ farmer: farmerId }).populate(
      "farmer",
      "firstName lastName email phone address"
    );
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
    console.log(cropId, "Fetching crop details for ID");
    const crop = await Crop.findById(cropId);
    console.log(crop, "Fetched crop details");
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

  const getAllCrops = async () => {
    // Populate farmer details in the crop response
    return await Crop.find().populate(
      "farmer",
      "firstName lastName email phone address"
    );
  };

  return {
    createCrop,
    getMyCrops,
    markCropSold,
    removeCrop,
    marketplaceSearch,
    getCropDetails,
    getTrendingCrops,
    getAllCrops,
  };
};
