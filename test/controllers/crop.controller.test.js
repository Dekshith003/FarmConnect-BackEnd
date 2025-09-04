// services/crop.service.test.js
const mongoose = require("mongoose");
const cropControllerFactory = require("../../controllers/crop.controller");

describe("Crop Controller", () => {
  let cropService;
  let ctrl;
  let req, res, next;

  beforeEach(() => {
    cropService = {
      createCrop: jest.fn(),
      getMyCrops: jest.fn(),
      getAllCrops: jest.fn(),
      toggleCropSold: jest.fn(),
      removeCrop: jest.fn(),
      marketplaceSearch: jest.fn(),
      getCropDetails: jest.fn(),
    };
    // Mock notification service
    jest.mock("../../services/notification.service", () => () => ({
      createNotification: jest.fn(),
    }));
    ctrl = cropControllerFactory({ cropService });
    req = {
      user: { id: new mongoose.Types.ObjectId().toString(), role: "Farmer" },
      body: {},
      params: {},
      files: [],
    };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    next = jest.fn();
  });

  test("myListings returns crops for logged-in farmer", async () => {
    cropService.getMyCrops.mockResolvedValue([{ name: "Wheat" }]);
    await ctrl.myListings(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ crops: [{ name: "Wheat" }] });
  });

  test("myListings returns all crops if not logged in", async () => {
    req.user = null;
    cropService.getAllCrops.mockResolvedValue([{ name: "Rice" }]);
    await ctrl.myListings(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ crops: [{ name: "Rice" }] });
  });

  test("getCropDetails returns crop details", async () => {
    req.params.id = "cropId";
    cropService.getCropDetails.mockResolvedValue({ name: "Maize" });
    await ctrl.getCropDetails(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ crop: { name: "Maize" } });
  });

  test("marketplace returns crops from search", async () => {
    cropService.marketplaceSearch.mockResolvedValue([{ name: "Barley" }]);
    req.query = {};
    await ctrl.marketplace(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ crops: [{ name: "Barley" }] });
  });

  test("remove calls service and returns message", async () => {
    req.params.id = "cropId";
    cropService.removeCrop.mockResolvedValue({});
    await ctrl.remove(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ message: "Crop removed" });
  });

  test("toggleSoldStatus returns updated crop", async () => {
    req.params.id = "cropId";
    const mockCrop = {
      name: "Wheat",
      isSold: true,
      populate: jest.fn().mockResolvedValue({ name: "Wheat", isSold: true }),
    };
    cropService.toggleCropSold.mockResolvedValue(mockCrop);
    await ctrl.toggleSoldStatus(req, res, next);
    // Wait for the populate to resolve
    await mockCrop.populate();
    expect(res.json).toHaveBeenCalledWith({
      message: "Marked as sold",
      crop: { name: "Wheat", isSold: true },
    });
  });

  test("myCropsByFarmer returns crops for given farmerId", async () => {
    req.params.farmerId = "farmerId";
    cropService.getMyCrops.mockResolvedValue([{ name: "Wheat" }]);
    await ctrl.myCropsByFarmer(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ crops: [{ name: "Wheat" }] });
  });
});
