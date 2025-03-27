const { fetchSalesData } = require("../services/sales.service");

exports.getSalesData = async (req, res) => {
  try {
    const salesData = await fetchSalesData(req);
    res.json(salesData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
