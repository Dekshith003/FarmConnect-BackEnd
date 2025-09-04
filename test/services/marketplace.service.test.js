const MarketplaceService = require("../../services/marketplace.service");
const Crop = require("../../models/Crop");

jest.mock("../../models/Crop");

describe("Marketplace Service", () => {
  let aiService, marketplaceService;

  beforeEach(() => {
    aiService = { getStructuredResponse: jest.fn() };
    marketplaceService = MarketplaceService({ aiService });
    jest.clearAllMocks();
  });

  test("getCrops returns crops array", async () => {
    Crop.find.mockResolvedValue([{ name: "Wheat" }]);
    const crops = await marketplaceService.getCrops({});
    expect(Array.isArray(crops)).toBe(true);
    expect(crops[0]).toHaveProperty("name", "Wheat");
  });

  test("getNearbyCrops returns nearby crops if found", async () => {
    Crop.find.mockResolvedValueOnce([{ name: "Corn" }]);
    const crops = await marketplaceService.getNearbyCrops(1, 2, 10, {});
    expect(crops).toEqual([{ name: "Corn" }]);
  });

  test("getNearbyCrops falls back to filters if no nearby crops", async () => {
    Crop.find
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ name: "Rice" }]);
    const crops = await marketplaceService.getNearbyCrops(1, 2, 10, {});
    expect(crops).toEqual([{ name: "Rice" }]);
  });

  test("getAiRecommendationsForCustomer returns AI recommendations if crops found", async () => {
    Crop.find.mockResolvedValue([{ name: "Wheat" }]);
    aiService.getStructuredResponse.mockResolvedValue({
      recommendations: [{ name: "Wheat", price: 100, tip: "Buy early" }],
    });
    const result = await marketplaceService.getAiRecommendationsForCustomer(
      1,
      2
    );
    expect(result).toHaveProperty("recommendations");
  });

  test("getAiRecommendationsForCustomer returns message if no crops found", async () => {
    Crop.find.mockResolvedValue([]);
    const result = await marketplaceService.getAiRecommendationsForCustomer(
      1,
      2
    );
    expect(result).toEqual({
      message: "No nearby crops found for recommendations",
    });
  });

  test("getCropDetails returns crop details", async () => {
    Crop.findById.mockResolvedValue({ name: "Wheat" });
    const crop = await marketplaceService.getCropDetails("1");
    expect(crop).toEqual({ name: "Wheat" });
    expect(Crop.findById).toHaveBeenCalledWith("1");
  });
});
