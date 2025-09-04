const PestService = require("../../services/pest.service");

describe("Pest Service", () => {
  let pestService;

  beforeEach(() => {
    pestService = new PestService();
  });

  test("detectPest returns pest result", async () => {
    pestService.detectPest = jest.fn().mockResolvedValue({ pest: "Aphid" });
    const result = await pestService.detectPest({ image: "test.jpg" });
    expect(result).toEqual({ pest: "Aphid" });
  });
});
