const express = require("express");
const { getInventoryProducts, createInventoryProduct } = require("../controllers/inventoryProducts.controller");

const router = express.Router();

router.get("/", getInventoryProducts); // GET /inventory/products
router.post("/", createInventoryProduct); // POST /inventory/products ✅

module.exports = router;
