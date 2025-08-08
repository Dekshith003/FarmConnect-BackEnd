// services/ai.service.js
const axios = require("axios");

class AiService {
  constructor(logger) {
    this.logger = logger;
  }

  async getAiCropRecommendations(farmerName, location, season, cropHistory) {
    const prompt = `You are an agriculture expert. Farmer ${farmerName} is in ${location} during ${season}. They previously grew: ${cropHistory.join(
      ", "
    )}. Suggest 3 profitable crops to plant next season and a short reason for each.`;
    try {
      const resp = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 400,
        },
        {
          headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        }
      );
      return resp.data.choices?.[0]?.message?.content || "";
    } catch (err) {
      this.logger?.error("AI crop recommendation error", {
        error: err.message,
      });
      throw new Error("AI crop recommendation error");
    }
  }

  async getMapRecommendations(payload) {
    try {
      const {
        location,
        season,
        role,
        topCrops = [],
        marketPrices = [],
      } = payload;
      const topCropsText = topCrops.length
        ? topCrops
            .map(
              (c, i) =>
                `${i + 1}. ${c.name} — listings: ${c.listings}, totalQty: ${
                  c.totalQty
                }${c.avgPrice ? `, avgPrice: ${c.avgPrice}` : ""}`
            )
            .join("\n")
        : "No nearby crop listings found.";
      const marketText = marketPrices.length
        ? marketPrices
            .slice(0, 10)
            .map((m) => `${m.crop} : ${m.price} (${m.market || "market"})`)
            .join("\n")
        : "No market data available.";

      const prompt = [
        `You are an experienced agricultural market analyst.`,
        `Location: lat ${location.lat}, lng ${location.lng}. Season: ${
          season || "current"
        }. Role: ${role}.`,
        `Nearby crop listings summary:\n${topCropsText}`,
        `Market snapshot:\n${marketText}`,
        `Based on the above, provide:`,
        `1) Short recommendation (3 lines) for a buyer or farmer depending on role.`,
        `2) Top 3 crops to consider (with reasons and whether supply is abundant or scarce).`,
        `3) Quick actionable tips (fertilizer/inputs suggestions generic).`,
        `Respond in JSON with keys: shortSummary, topCrops, tips (JSON only).`,
      ].join("\n\n");

      const resp = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 600,
          temperature: 0.6,
        },
        {
          headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        }
      );

      const content = resp.data.choices?.[0]?.message?.content || "";
      let parsed = null;
      try {
        const match = content.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      } catch (e) {
        parsed = { text: content };
      }

      return parsed || { text: content };
    } catch (err) {
      this.logger?.error("AI map recommendation error", { error: err.message });
      throw new Error("AI map recommendation error");
    }
  }
}

module.exports = AiService;
