const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const PestDetection = require("../models/PestDetection");

module.exports = () => {
  const detectPestOrDisease = async (imagePath) => {
    const form = new FormData();
    form.append("images", fs.createReadStream(imagePath));
    form.append("modifiers", JSON.stringify(["similar_images"]));
    form.append(
      "disease_details",
      JSON.stringify(["cause", "description", "treatment"])
    );
    const { data } = await axios.post(process.env.PLANT_ID_API_URL, form, {
      headers: {
        ...form.getHeaders(),
        "Api-Key": process.env.PLANT_ID_API_KEY,
      },
      timeout: 60000,
    });
    return data;
  };

  const saveDetection = async (data) => await PestDetection.create(data);

  return { detectPestOrDisease, saveDetection };
};
