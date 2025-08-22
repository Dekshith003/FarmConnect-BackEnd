const axios = require("axios");
const fs = require("fs");

async function detectPestWithPlantId(imagePath) {
  const PLANT_ID_API_KEY = process.env.PLANT_ID_API_KEY;
  const PLANT_ID_API_URL = "https://api.plant.id/v2/health_assessment";

  const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });

  try {
    const response = await axios.post(
      PLANT_ID_API_URL,
      {
        images: [imageBase64],
        // Optionally, you can add modifiers or language
        // modifiers: ["crops_simple"],
        // language: "en"
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Api-Key": PLANT_ID_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Plant.id API error:", error.response?.data || error.message);
    throw new Error("Failed to detect pest using Plant.id API");
  }
}

module.exports = { detectPestWithPlantId };
