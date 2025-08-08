const Crop = require("../models/Crop");

module.exports = () => {
  const fetchMarketplaceCrops = async (filters) => {
    return await Crop.find({ isSold: false, ...filters });
  };

  const fetchCropDetails = async (cropId) => {
    return await Crop.findById(cropId);
  };

  return { fetchMarketplaceCrops, fetchCropDetails };
};
