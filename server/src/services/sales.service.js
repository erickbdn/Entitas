const { db } = require("../firebase");
const admin = require("firebase-admin");

exports.fetchSalesData = async (req) => {
  try {
    // 🔹 Get Authorization Token from Request Headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized");
    }

    const token = authHeader.split(" ")[1];

    // 🔹 Verify Firebase Token
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken) {
      throw new Error("Unauthorized");
    }

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(startOfMonth.getTime() - 1);

    let todaySales = 0;
    let monthlySales = 0;
    let previousMonthSales = 0;
    const weeklySalesTrend = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    const itemSales = {};

    // 🔹 Fetch Weekly Sales
    const weeklySnapshot = await db.collection("orders")
      .where("orderDate", ">=", startOfWeek)
      .where("orderDate", "<=", endOfWeek)
      .get();

    weeklySnapshot.forEach((doc) => {
      const data = doc.data();
      if (!data.orderDate) return;
      const saleDate = data.orderDate.toDate();
      const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][saleDate.getDay()];
      weeklySalesTrend[dayOfWeek] += 1;
    });

    // 🔹 Fetch Monthly Sales
    const monthlySnapshot = await db.collection("orders")
      .where("orderDate", ">=", startOfMonth)
      .get();

    monthlySnapshot.forEach((doc) => {
      const data = doc.data();
      if (!data.orderDate || !data.totalAmount || !data.items) return;

      const saleDate = data.orderDate.toDate();
      monthlySales += data.totalAmount || 0;

      data.items.forEach((item) => {
        if (!itemSales[item.productId]) {
          itemSales[item.productId] = { unitsSold: 0, revenue: 0 };
        }
        itemSales[item.productId].unitsSold += item.quantity;
        itemSales[item.productId].revenue += item.quantity * item.price;
      });

      if (saleDate >= startOfDay) {
        todaySales += data.totalAmount || 0;
      }
    });

    // 🔹 Fetch Previous Month Sales
    const lastMonthSnapshot = await db.collection("orders")
      .where("orderDate", ">=", startOfLastMonth)
      .where("orderDate", "<=", endOfLastMonth)
      .get();

    lastMonthSnapshot.forEach((doc) => {
      const data = doc.data();
      if (!data.orderDate || !data.totalAmount) return;
      previousMonthSales += data.totalAmount || 0;
    });

    // 🔥 Find Hot Item
    let hotItemId = null;
    let hotItemData = { unitsSold: 0, revenue: 0 };

    Object.entries(itemSales).forEach(([productId, data]) => {
      if (data.unitsSold > hotItemData.unitsSold) {
        hotItemId = productId;
        hotItemData = data;
      }
    });

    let hotItemDetails = null;
    if (hotItemId) {
      const productDoc = await db.collection("products").doc(hotItemId).get();
      const productData = productDoc.data();
      if (productData) {
        hotItemDetails = {
          productId: hotItemId,
          name: productData.name || "Unknown Product",
          imageUrl: productData.imageUrl || "/PlaceholderItem.png",
          stockRemaining: productData.stock ?? "N/A",
          unitsSold: hotItemData.unitsSold,
          revenue: hotItemData.revenue,
        };
      }
    }

    const result = {
      todaySales,
      weeklySalesTrend: Object.entries(weeklySalesTrend).map(([day, value]) => ({ day, value })),
      monthlySales,
      previousMonthSales,
      hotItem: hotItemDetails,
    };

    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch sales data.");
  }
};
