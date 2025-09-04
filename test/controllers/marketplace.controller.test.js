const marketplaceControllerFactory = require("../../controllers/marketplace.controller");

describe("Marketplace Controller", () => {
  let marketplaceService, ctrl, req, res, next;

  beforeEach(() => {
    marketplaceService = { search: jest.fn() };
    ctrl = marketplaceControllerFactory({ marketplaceService });
    req = { query: {} };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    next = jest.fn();
  });

  test("search returns crops", async () => {
    marketplaceService.search.mockResolvedValue([{ name: "Wheat" }]);
    await ctrl.search(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ crops: [{ name: "Wheat" }] });
  });
});
