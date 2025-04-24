const express = require("express");
const { getInventoryProducts, createInventoryProduct, patchInventoryProduct, deleteInventoryProduct } = require("../controllers/inventoryProducts.controller");

const router = express.Router();

router.get("/", getInventoryProducts); // GET /inventory/products
router.post("/", createInventoryProduct); // POST /inventory/products ✅
router.patch("/:id", patchInventoryProduct);    // PATCH /inventory-products/:id ✅
router.delete("/:id", deleteInventoryProduct);  // DELETE /inventory-products/:id ✅

module.exports = router;
