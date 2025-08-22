const Farmer = require("../models/Farmer");
const Customer = require("../models/Customer");
const Crop = require("../models/Crop");

module.exports = ({ aiService, marketPriceService }) => {
  const getFarmerDashboard = async (farmerId) => {
    const farmer = await Farmer.findById(farmerId).select(
      "name email location profileCompleted"
    );
    const totalCrops = await Crop.countDocuments({ farmer: farmerId });
    const soldCrops = await Crop.countDocuments({
      farmer: farmerId,
      isSold: true,
    });
    const recentCrops = await Crop.find({ farmer: farmerId })
      .sort({ createdAt: -1 })
      .limit(5);
    return {
      profile: farmer,
      totalCrops,
      soldCrops,
      recentCrops,
    };
  };

  const getCustomerDashboard = async (customerId) => {
    const customer = await Customer.findById(customerId).select(
      "name email location"
    );
    const trendingCrops = await Crop.find({ isSold: false })
      .sort({ createdAt: -1 })
      .limit(5);
    const priceInsights = await marketPriceService.getRealMarketPrices();
    return { profile: customer, trendingCrops, priceInsights };
  };

  return { getFarmerDashboard, getCustomerDashboard };
};
