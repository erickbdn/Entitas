const { fetchRecentTransactions } = require("../services/recentTransactions.service");

exports.getRecentTransactions = async (req, res) => {
  try {
    const transactions = await fetchRecentTransactions(req);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
