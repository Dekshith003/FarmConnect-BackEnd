const DashboardController = require("../../controllers/dashboard.controller");

describe("Dashboard Controller", () => {
  let dashboardService, ctrl, req, res, next;

  beforeEach(() => {
    dashboardService = { getStats: jest.fn() };
    ctrl = new DashboardController(dashboardService); // Use 'new' for class
    req = { user: { id: "id" } };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    next = jest.fn();
  });

  test("getStats returns dashboard stats", async () => {
    dashboardService.getStats.mockResolvedValue({ crops: 10, farmers: 5 });
    await ctrl.getStats(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ crops: 10, farmers: 5 });
  });

  test("getStats handles errors", async () => {
    dashboardService.getStats.mockRejectedValue(new Error("Error"));
    await ctrl.getStats(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
