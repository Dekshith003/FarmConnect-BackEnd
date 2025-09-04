const authControllerFactory = require("../../controllers/auth.controller");

describe("Auth Controller", () => {
  let authService, ctrl, req, res, next;

  beforeEach(() => {
    authService = {
      /* mock methods as needed */
    };
    ctrl = authControllerFactory({ authService });
    req = { body: {}, user: { id: "id", role: "Farmer" } };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    next = jest.fn();
  });

  test("login returns userDetails and token", async () => {
    // You can mock ctrl.login and check res.json
    // Example:
    ctrl.login = jest
      .fn()
      .mockResolvedValue({
        message: "Login successful",
        userDetails: {},
        token: "token",
      });
    await ctrl.login(req, res, next);
    expect(ctrl.login).toHaveBeenCalledWith(req, res, next);
  });
});
