// AI Controller
class AiController {
  constructor(aiService) {
    this.aiService = aiService;
  }

  async predict(req, res, next) {
    try {
      const { input } = req.body;
      const result = await this.aiService.predict(input);
      res.json({ result });
    } catch (err) {
      next(err);
    }
  }

  async recommend(req, res, next) {
    try {
      const { context } = req.body;
      const recommendations = await this.aiService.recommend(context);
      res.json({ recommendations });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AiController;
