const aiControllerFactory = require("../../controllers/ai.controller");

describe("AI Controller", () => {
  let aiService, ctrl, req, res, next;

  beforeEach(() => {
    aiService = {
      predict: jest.fn(),
      recommend: jest.fn(),
      getAiCropRecommendations: jest.fn(),
    };
    ctrl = new aiControllerFactory(aiService);
    req = { body: {}, user: { id: "id" } };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    next = jest.fn();
  });

  test("predict returns result", async () => {
    aiService.predict.mockResolvedValue("Prediction");
    await ctrl.predict(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ result: "Prediction" });
  });

  test("recommend returns recommendations", async () => {
    aiService.recommend.mockResolvedValue("Recommended");
    await ctrl.recommend(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ recommendations: "Recommended" });
  });

  test("getCropRecommendations returns recommendations", async () => {
    aiService.getAiCropRecommendations.mockResolvedValue("Crops");
    req.body = { farmerName: "A", location: "B", season: "C", cropHistory: [] };
    await ctrl.getCropRecommendations(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ recommendations: "Crops" });
  });
});
