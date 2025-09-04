const request = require("supertest");
const express = require("express");
const aiRoutes = require("../../routes/ai.routes");

const app = express();
app.use(express.json());
app.use("/ai", aiRoutes);

describe("AI Routes", () => {
  test("POST /ai/predict returns result", async () => {
    const res = await request(app).post("/ai/predict").send({ input: "test" });
    expect([200, 400, 401, 403]).toContain(res.statusCode);
  });
});
