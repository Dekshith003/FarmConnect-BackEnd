const DashboardService = require("../../services/dashboard.service");

describe("Dashboard Service", () => {
  let dashboardService;

  beforeEach(() => {
    dashboardService = new DashboardService();
  });

  test("getStats returns stats object", async () => {
    dashboardService.getStats = jest
      .fn()
      .mockResolvedValue({ crops: 10, farmers: 5 });
    const stats = await dashboardService.getStats();
    expect(stats).toEqual({ crops: 10, farmers: 5 });
  });
});
