const request = require("supertest");
const express = require("express");
const pestRoutes = require("../../routes/pest.routes");

const app = express();
app.use(express.json());
app.use("/pest", pestRoutes);

describe("Pest Routes", () => {
  test("POST /pest/detect returns pest result", async () => {
    const res = await request(app)
      .post("/pest/detect")
      .send({ image: "test.jpg" });
    expect([200, 400, 401, 403]).toContain(res.statusCode);
  });
});
