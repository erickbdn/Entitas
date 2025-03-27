const express = require("express");
const { getInventoryData } = require("../controllers/inventory.controller");

const router = express.Router();

router.get("/", getInventoryData); // GET /inventory

module.exports = router;
