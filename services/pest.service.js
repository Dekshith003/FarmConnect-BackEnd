const fs = require("fs");
const PestDetection = require("../models/PestDetection");
const { getTreatmentRecommendations } = require("../utils/pestTreatmentMap");
const { detectPestWithPlantId } = require("../utils/plantIdApi");

module.exports = () => {
  // Use Plant.id API for pest detection
  const detectPestOrDisease = async (imagePath) => {
    let pestName = "Unknown";
    let labels = [];
    let webEntities = [];
    let description = "";
    let uploadedImageFile = imagePath ? imagePath.split(/[/\\]/).pop() : null;
    let imageUrl = uploadedImageFile
      ? `/uploads/pest-images/${uploadedImageFile}`
      : "/uploads/pest-images/pest1.jpg";
    try {
      const plantIdResult = await detectPestWithPlantId(imagePath);
      // Plant.id returns an array of health_assessment suggestions
      const assessment = plantIdResult.health_assessment?.diseases?.[0] || {};
      pestName = assessment.name || "Unknown";
      labels = [{ description: pestName, score: assessment.probability }];
      webEntities = [
        {
          description: assessment.scientific_name,
          score: assessment.probability,
        },
      ];
      description = assessment.description || "";
      let suggestions = await getTreatmentRecommendations(labels, webEntities);
      return {
        pestName,
        labels,
        webEntities,
        suggestions,
        description,
        imageUrl,
        uploadedImageFile,
      };
    } catch (err) {
      // Fallback to mock if Plant.id fails
      let suggestions = await getTreatmentRecommendations(labels, webEntities);
      return {
        pestName,
        labels,
        webEntities,
        suggestions,
        description,
        imageUrl,
        uploadedImageFile,
      };
    }
  };

  const saveDetection = async (data) => await PestDetection.create(data);

  const getDetectionHistory = async (farmerId) => {
    return await PestDetection.find({ farmerId }).sort({ createdAt: -1 });
  };

  return { detectPestOrDisease, saveDetection, getDetectionHistory };
};
