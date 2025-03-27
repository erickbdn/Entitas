const { fetchInventoryData } = require("../services/inventory.service");

exports.getInventoryData = async (req, res) => {
  try {
    const inventoryData = await fetchInventoryData(req);
    res.json(inventoryData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
