const Farmer = require("../models/Farmer");
const Customer = require("../models/Customer");
const Crop = require("../models/Crop");

module.exports = () => {
  const getPlatformStats = async () => {
    const totalFarmers = await Farmer.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalCrops = await Crop.countDocuments();
    const soldCrops = await Crop.countDocuments({ isSold: true });
    return { totalFarmers, totalCustomers, totalCrops, soldCrops };
  };

  const getAllUsers = async () => {
    const farmers = await Farmer.find();
    const customers = await Customer.find();
    return { farmers, customers };
  };

  const getAllCrops = async () => Crop.find().populate("farmer", "name email");
  const removeCrop = async (id) => Crop.findByIdAndDelete(id);

  return { getPlatformStats, getAllUsers, getAllCrops, removeCrop };
};
