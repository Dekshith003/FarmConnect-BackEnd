const request = require("supertest");
const express = require("express");
const cropRoutes = require("../../routes/crop.routes");

// Create a test app with crop routes
const app = express();
app.use(express.json());
app.use("/crop", cropRoutes);

jest.mock("../../middlewares/auth.middleware", () => ({
  protect: (req, res, next) => next(),
  allowRoles: () => (req, res, next) => next(),
}));

jest.mock("../../services/crop.service", () => () => ({
  getAllCrops: jest.fn().mockResolvedValue([]),
  getCropDetails: jest.fn().mockResolvedValue({ name: "Test Crop" }),
  marketplaceSearch: jest.fn().mockResolvedValue([]),
  // Add other methods as needed
}));

describe("Crop Routes", () => {
  test("GET /crop/marketplace returns crops", async () => {
    const res = await request(app).get("/crop/marketplace");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("crops");
  }, 10000); // 10 seconds timeout

  test("GET /crop/:id returns crop details (404 for missing)", async () => {
    const res = await request(app).get("/crop/123456789012345678901234");
    // Should be 404 or 200 depending on DB/mock
    expect([200, 404]).toContain(res.statusCode);
  });

  test("POST /crop/post validates required fields", async () => {
    const res = await request(app).post("/crop/post").send({});
    // Should be 400 for missing fields
    expect([400, 401, 403]).toContain(res.statusCode);
  });
});
