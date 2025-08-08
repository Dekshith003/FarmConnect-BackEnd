module.exports = ({ pestService }) => {
  const detectPest = async (req, res) => {
    if (!req.file)
      return res.status(400).json({ message: "Image is required" });
    const result = await pestService.detectPestOrDisease(req.file.path);
    await pestService.saveDetection({
      farmerId: req.user.id,
      imageUrl: req.file.path,
      detectedIssue: result,
      confidence: null,
      recommendations: null,
    });
    return res
      .status(200)
      .json({ message: "Detection successful", data: result });
  };

  return { detectPest };
};
