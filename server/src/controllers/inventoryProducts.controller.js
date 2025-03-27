const { fetchInventoryProducts, addInventoryProduct } = require("../services/inventoryProducts.service");

exports.getInventoryProducts = async (req, res) => {
  try {
    const productsData = await fetchInventoryProducts(req);
    res.json(productsData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 New: Controller for Adding a Product
exports.createInventoryProduct = async (req, res) => {
  try {
    const newProduct = await addInventoryProduct(req);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};