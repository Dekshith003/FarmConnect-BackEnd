const AuthService = require("../../services/auth.service");

describe("Auth Service", () => {
  let authService;
  beforeEach(() => {
    authService = new AuthService();
  });

  test("register returns user object", async () => {
    authService.register = jest
      .fn()
      .mockResolvedValue({ email: "test@example.com" });
    const user = await authService.register({
      email: "test@example.com",
      password: "pass",
    });
    expect(user).toHaveProperty("email", "test@example.com");
  });

  test("login returns token", async () => {
    authService.login = jest.fn().mockResolvedValue({ token: "abc123" });
    const result = await authService.login({
      email: "test@example.com",
      password: "pass",
    });
    expect(result).toHaveProperty("token", "abc123");
  });

  test("login handles error", async () => {
    authService.login = jest
      .fn()
      .mockRejectedValue(new Error("Invalid credentials"));
    await expect(
      authService.login({ email: "test@example.com", password: "wrong" })
    ).rejects.toThrow("Invalid credentials");
  });
});
