const AiService = require("../../services/ai.service");
const logger = { info: jest.fn(), error: jest.fn(), warn: jest.fn() };

describe("AI Service", () => {
  const aiService = new AiService(logger);

  test("recommend returns recommendations", async () => {
    aiService._callOpenAI = jest.fn().mockResolvedValue("Recommended crops");
    const result = await aiService.recommend({ context: "test" });
    expect(result).toHaveProperty("recommendations");
  });
});
