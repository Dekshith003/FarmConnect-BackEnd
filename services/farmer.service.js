const Farmer = require("../models/Farmer");
const Crop = require("../models/Crop");

module.exports = () => {
  const completeProfile = async (farmerId, profileData) => {
    return await Farmer.findByIdAndUpdate(
      farmerId,
      { ...profileData, profileCompleted: true },
      { new: true }
    );
  };

  const postCrop = async (farmerId, cropData) => {
    return await Crop.create({ ...cropData, farmer: farmerId });
  };

  const getMyCrops = async (farmerId) => {
    return await Crop.find({ farmer: farmerId });
  };

  const markCropSold = async (farmerId, cropId) => {
    return await Crop.findOneAndUpdate(
      { _id: cropId, farmer: farmerId },
      { isSold: true },
      { new: true }
    );
  };

  return { completeProfile, postCrop, getMyCrops, markCropSold };
};
