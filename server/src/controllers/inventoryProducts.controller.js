const { fetchInventoryProducts, addInventoryProduct, updateInventoryProduct, deleteInventoryProduct } = require("../services/inventoryProducts.service");

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

exports.patchInventoryProduct = async (req, res) => {
  try {
    const result = await updateInventoryProduct(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteInventoryProduct = async (req, res) => {
  try {
    const result = await deleteInventoryProduct(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};