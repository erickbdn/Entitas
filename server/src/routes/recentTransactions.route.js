const express = require("express");
const { getRecentTransactions } = require("../controllers/recentTransactions.controller");

const router = express.Router();

router.get("/", getRecentTransactions); // GET /recent-transactions

module.exports = router;
