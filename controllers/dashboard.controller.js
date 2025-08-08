module.exports = ({ dashboardService }) => {
  const getDashboard = async (req, res) => {
    if (req.user.role === "customer") {
      const cdata = await dashboardService.getCustomerDashboard(req.user.id);
      return res.status(200).json(cdata);
    } else {
      const data = await dashboardService.getFarmerDashboard(req.user.id);
      return res.status(200).json(data);
    }
  };

  return { getDashboard };
};
