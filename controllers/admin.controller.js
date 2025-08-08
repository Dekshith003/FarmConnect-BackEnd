module.exports = ({ adminService }) => {
  const getStats = async (req, res) => {
    const stats = await adminService.getPlatformStats();
    return res.status(200).json(stats);
  };

  const listUsers = async (req, res) => {
    const users = await adminService.getAllUsers();
    return res.status(200).json(users);
  };

  const listCrops = async (req, res) => {
    const crops = await adminService.getAllCrops();
    return res.status(200).json(crops);
  };

  const deleteCrop = async (req, res) => {
    const deleted = await adminService.removeCrop(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Crop not found" });
    return res.status(200).json({ message: "Crop deleted successfully" });
  };

  return { getStats, listUsers, listCrops, deleteCrop };
};
