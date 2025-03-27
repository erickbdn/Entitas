const express = require("express");
const { getSalesData } = require("../controllers/sales.controller");

const router = express.Router();

router.get("/", getSalesData); // GET /sales

module.exports = router;
