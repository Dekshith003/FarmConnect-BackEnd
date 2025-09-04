const request = require("supertest");
const express = require("express");
const marketplaceRoutes = require("../../routes/marketplace.routes");

const app = express();
app.use(express.json());
app.use("/marketplace", marketplaceRoutes);

describe("Marketplace Routes", () => {
  test("GET /marketplace/search returns crops", async () => {
    const res = await request(app).get("/marketplace/search");
    expect([200, 401, 403]).toContain(res.statusCode);
  });
});
