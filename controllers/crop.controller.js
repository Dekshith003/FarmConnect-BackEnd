// controllers/crop.controller.js
module.exports = ({ cropService } = {}) => {
  const logger = require("../utils/logger");

  const create = async (req, res, next) => {
    try {
      // farmer must be authenticated (req.user set by auth middleware)
      const farmerId = req.user.id;
      // images handled in the route (multer) -> req.files
      const images = (req.files || []).map((f) => f.path);
      const payload = { ...req.body, images };
      const crop = await cropService.createCrop(farmerId, payload);
      return res.status(201).json({ message: "Crop posted", crop });
    } catch (err) {
      next(err);
    }
  };

  const myListings = async (req, res, next) => {
    try {
      const farmerId = req.user.id;
      const crops = await cropService.getMyCrops(farmerId);
      return res.json({ crops });
    } catch (err) {
      next(err);
    }
  };

  const markAsSold = async (req, res, next) => {
    try {
      const farmerId = req.user.id;
      const cropId = req.params.id;
      const updated = await cropService.markCropSold(farmerId, cropId);
      return res.json({ message: "Marked as sold", crop: updated });
    } catch (err) {
      next(err);
    }
  };

  const remove = async (req, res, next) => {
    try {
      const farmerId = req.user.id;
      const cropId = req.params.id;
      await cropService.removeCrop(farmerId, cropId);
      return res.json({ message: "Crop removed" });
    } catch (err) {
      next(err);
    }
  };

  // public /customer marketplace search
  const marketplace = async (req, res, next) => {
    try {
      const filters = req.query;
      const results = await cropService.marketplaceSearch(filters);
      return res.json({ crops: results });
    } catch (err) {
      next(err);
    }
  };

  const getDetails = async (req, res, next) => {
    try {
      const cropId = req.params.id;
      const crop = await cropService.getCropDetails(cropId);
      return res.json({ crop });
    } catch (err) {
      next(err);
    }
  };

  return { create, myListings, markAsSold, remove, marketplace, getDetails };
};
