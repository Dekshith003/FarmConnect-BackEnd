const pestControllerFactory = require("../../controllers/pest.controller");

describe("Pest Controller", () => {
  let pestService, ctrl, req, res, next;

  beforeEach(() => {
    pestService = { detectPest: jest.fn() };
    ctrl = pestControllerFactory({ pestService });
    req = { body: {}, user: { id: "id" } };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    next = jest.fn();
  });

  test("detectPest returns detection result", async () => {
    pestService.detectPest.mockResolvedValue({ pest: "Aphid" });
    await ctrl.detectPest(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ pest: "Aphid" });
  });
});
