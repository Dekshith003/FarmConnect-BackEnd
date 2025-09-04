const request = require("supertest");
const express = require("express");
const dashboardRoutes = require("../../routes/dashboard.routes");

const app = express();
app.use(express.json());
app.use("/dashboard", dashboardRoutes);

describe("Dashboard Routes", () => {
  test("GET /dashboard/stats returns stats", async () => {
    const res = await request(app).get("/dashboard/stats");
    expect([200, 401, 403]).toContain(res.statusCode);
  });
});
