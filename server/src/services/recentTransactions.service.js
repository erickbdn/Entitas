const { db } = require("../firebase");
const admin = require("firebase-admin");

exports.fetchRecentTransactions = async (req) => {
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

    console.log("Authenticated User UID:", decodedToken.uid);

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    // ✅ Fetch transactions from the last 7 days
    const transactionsSnapshot = await db
      .collection("transactions")
      .where("timestamp", ">", sevenDaysAgo)
      .orderBy("timestamp", "desc")
      .get();

    if (transactionsSnapshot.empty) {
      return [];
    }

    // Store transactions and order IDs to fetch statuses
    const transactions = [];
    const orderIds = new Set();

    transactionsSnapshot.forEach((doc) => {
      const data = doc.data();
      transactions.push({
        id: `#${data.relatedOrderId}`,
        amount: `$${data.amount.toFixed(2)}`,
        date: new Date(data.timestamp.toDate()).toLocaleDateString(),
        relatedOrderId: data.relatedOrderId,
      });
      orderIds.add(data.relatedOrderId);
    });

    // ✅ Fetch order statuses for related transactions
    const ordersSnapshot = await db
      .collection("orders")
      .where("__name__", "in", Array.from(orderIds))
      .get();

    const ordersMap = new Map();
    ordersSnapshot.forEach((doc) => {
      ordersMap.set(doc.id, doc.data().status);
    });

    // 🔹 Attach statuses to transactions
    return transactions.map((tx) => ({
      ...tx,
      status: ordersMap.get(tx.relatedOrderId) || "Unknown",
    }));

  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    throw new Error("Failed to fetch transactions.");
  }
};
