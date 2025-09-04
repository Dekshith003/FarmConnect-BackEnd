const mongoose = require("mongoose");
const Crop = require("../../models/Crop");
const cropServiceFactory = require("../../services/crop.service");

// Mock Crop model methods
jest.mock("../../models/Crop");

const cropService = cropServiceFactory();

describe("Crop Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("createCrop creates a crop and returns it", async () => {
    const mockCrop = { _id: "1", name: "Wheat" };
    Crop.create.mockResolvedValue(mockCrop);
    const result = await cropService.createCrop("farmerId", { name: "Wheat" });
    expect(result).toEqual(mockCrop);
    expect(Crop.create).toHaveBeenCalledWith({
      name: "Wheat",
      farmer: "farmerId",
    });
  });

  test("getMyCrops returns crops for a farmer", async () => {
    const mockCrops = [{ _id: "1", name: "Wheat" }];
    Crop.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockCrops),
    });
    const result = await cropService.getMyCrops("farmerId");
    expect(result).toEqual(mockCrops);
    expect(Crop.find).toHaveBeenCalledWith({ farmer: "farmerId" });
  });

  test("toggleCropSold toggles isSold field", async () => {
    const mockCrop = {
      _id: "1",
      farmer: { toString: () => "farmerId" },
      isSold: false,
      save: jest.fn().mockResolvedValue(true),
    };
    Crop.findById.mockResolvedValue(mockCrop);
    const result = await cropService.toggleCropSold("farmerId", "1");
    expect(result.isSold).toBe(true);
    expect(mockCrop.save).toHaveBeenCalled();
  });

  test("removeCrop deletes a crop", async () => {
    const mockDeleted = { _id: "1", name: "Wheat" };
    Crop.findOneAndDelete.mockResolvedValue(mockDeleted);
    const result = await cropService.removeCrop("farmerId", "1");
    expect(result).toEqual(mockDeleted);
    expect(Crop.findOneAndDelete).toHaveBeenCalledWith({
      _id: "1",
      farmer: "farmerId",
    });
  });

  test("getCropDetails returns crop details", async () => {
    const mockCrop = { _id: "1", name: "Wheat" };
    Crop.findById.mockResolvedValue(mockCrop);
    const result = await cropService.getCropDetails("1");
    expect(result).toEqual(mockCrop);
    expect(Crop.findById).toHaveBeenCalledWith("1");
  });

  test("getAllCrops returns all crops", async () => {
    const mockCrops = [{ _id: "1", name: "Wheat" }];
    Crop.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockCrops),
    });
    const result = await cropService.getAllCrops();
    expect(result).toEqual(mockCrops);
    expect(Crop.find).toHaveBeenCalled();
  });
});
