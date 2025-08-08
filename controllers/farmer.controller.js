module.exports = ({ farmerService }) => {
  const completeProfile = async (req, res) => {
    const updated = await farmerService.completeProfile(req.user.id, req.body);
    return res
      .status(200)
      .json({ message: "Profile completed", data: updated });
  };

  const postCrop = async (req, res) => {
    // server-side validation handled in route
    const crop = await farmerService.postCrop(req.user.id, req.body);
    return res.status(201).json({ message: "Crop posted", data: crop });
  };

  const getMyListings = async (req, res) => {
    const crops = await farmerService.getMyCrops(req.user.id);
    return res.status(200).json({ crops });
  };

  const markAsSold = async (req, res) => {
    const updated = await farmerService.markCropSold(
      req.user.id,
      req.params.id
    );
    return res.status(200).json({ message: "Marked as sold", data: updated });
  };

  return { completeProfile, postCrop, getMyListings, markAsSold };
};
