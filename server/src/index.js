const express = require("express");
const cors = require("cors");
require("dotenv").config();

// 🔹 Import Routes
const salesRoutes = require("./routes/sales.route");
const recentTransactionsRoutes = require("./routes/recentTransactions.route");
const inventoryRoutes = require("./routes/inventory.route"); // ✅ Add inventory route
const inventoryProductsRoutes = require("./routes/inventoryProducts.route"); // ✅ Add inventory-products route

const app = express();

// 🔹 Middleware
app.use(cors());
app.use(express.json());

// 🔹 Root Route (Health Check)
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running..." });
});

// ✅ Use Routes (Prefix with `/api` for better structure)
app.use("/api/sales", salesRoutes);
app.use("/api/recent-transactions", recentTransactionsRoutes);
app.use("/api/inventory", inventoryRoutes); // ✅ Add inventory route
app.use("/api/inventory-products", inventoryProductsRoutes); // ✅ Add inventory-products route

const PORT = process.env.PORT || 3001;

// 🔹 Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
