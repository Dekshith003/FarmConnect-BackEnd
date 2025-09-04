// controllers/crop.controller.js
module.exports = ({ cropService } = {}) => {
  const logger = require("../utils/logger");
  const notificationService = require("../services/notification.service")();

  const create = async (req, res, next) => {
    try {
      // farmer must be authenticated (req.user set by auth middleware)
      const farmerId = req.user.id;
      // images handled in the route (multer) -> req.files
      const imageUrls = req.files
        ? req.files.map((file) => `/uploads/crop-images/${file.filename}`)
        : [];
      // city and state are now required fields for location
      const payload = { ...req.body, images: imageUrls };
      const crop = await cropService.createCrop(farmerId, payload);
      // Log the created crop for debugging
      logger.info("Crop created: %j", crop);
      // Ensure all required fields are present in the response
      const cropResponse = {
        _id: crop._id,
        name: crop.name || "",
        category: crop.category || "",
        description: crop.description || "",
        quantity: crop.quantity ?? 0,
        unit: crop.unit || "kg",
        price: crop.price ?? 0,
        city: crop.city || "",
        state: crop.state || "",
        images: Array.isArray(crop.images) ? crop.images : [],
        isSold: crop.isSold ?? false,
        postedAt: crop.postedAt || crop.createdAt || new Date(),
        farmer: crop.farmer,
      };
      // Send notification to farmer
      await notificationService.createNotification(
        farmerId,
        req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1),
        "success",
        `Your crop '${crop.name}' was posted successfully!`,
        { crop: cropResponse }
      );
      return res
        .status(201)
        .json({ message: "Crop posted", crop: cropResponse });
    } catch (err) {
      next(err);
    }
  };

  const myListings = async (req, res, next) => {
    try {
      let crops;
      if (req.user && req.user.id) {
        // If logged in, show only this farmer's crops
        crops = await cropService.getMyCrops(req.user.id);
      } else {
        // If not logged in, show all crops (or apply public filter)
        crops = await cropService.getAllCrops();
      }
      return res.json({ crops });
    } catch (err) {
      next(err);
    }
  };

  const toggleSoldStatus = async (req, res, next) => {
    try {
      const farmerId = req.user.id;
      const cropId = req.params.id;
      let updated = await cropService.toggleCropSold(farmerId, cropId);
      // Populate farmer details in response
      updated = await updated.populate(
        "farmer",
        "firstName lastName email phone address"
      );

      // Send notification
      await notificationService.createNotification(
        farmerId,
        req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1),
        "info",
        `Your crop '${updated.name}' was ${
          updated.isSold ? "marked as SOLD" : "unmarked (available)"
        }!`,
        { crop: updated }
      );

      return res.json({
        message: updated.isSold ? "Marked as sold" : "Unmarked as sold",
        crop: updated,
      });
    } catch (err) {
      next(err);
    }
  };

  const remove = async (req, res, next) => {
    try {
      const farmerId = req.user.id;
      const cropId = req.params.id;
      await cropService.removeCrop(farmerId, cropId);
      // Send notification to farmer
      const notificationService = require("../services/notification.service")();
      await notificationService.createNotification(
        farmerId,
        req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1),
        "warning",
        `Your crop was removed from listings.`,
        { cropId }
      );
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

  const getCropDetails = async (req, res, next) => {
    try {
      const cropId = req.params.id;
      console.log(cropId, "Fetching crop details for I-----paramasD");
      const crop = await cropService.getCropDetails(cropId);
      return res.json({ crop });
    } catch (err) {
      next(err);
    }
  };

  // Get all crops for the currently logged-in farmer
  const myCropsByFarmer = async (req, res, next) => {
    try {
      const farmerId = req.params.farmerId; // <-- fix here
      console.log(farmerId, "Fetching crops for farmer ID");
      const crops = await cropService.getMyCrops(farmerId);
      // console.log(crops, "Fetched crops for farmer");
      return res.json({ crops });
    } catch (err) {
      next(err);
    }
  };

  return {
    create,
    myListings,
    toggleSoldStatus,
    remove,
    marketplace,
    getCropDetails,
    myCropsByFarmer,
  };
};
