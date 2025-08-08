module.exports = ({ customerService }) => {
  const getMarketplaceCrops = async (req, res) => {
    const filters = req.query;
    const crops = await customerService.fetchMarketplaceCrops(filters);
    return res.status(200).json({ crops });
  };

  const getCropDetails = async (req, res) => {
    const crop = await customerService.fetchCropDetails(req.params.id);
    if (!crop) return res.status(404).json({ message: "Crop not found" });
    return res.status(200).json({ crop });
  };

  return { getMarketplaceCrops, getCropDetails };
};
