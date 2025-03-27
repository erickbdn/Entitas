const { db } = require("../firebase");
const admin = require("firebase-admin");

exports.fetchInventoryData = async (req) => {
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

    // ✅ Fetch all products from Firestore
    const snapshot = await db.collection("products").get();

    let totalInventoryCapacity = 0;
    let totalProducts = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    snapshot.forEach((doc) => {
      const product = doc.data();
      if (product.stock === undefined || product.stock === null) return;

      totalProducts++;
      totalInventoryCapacity += product.stock;

      if (product.stock === 0) {
        outOfStockCount++;
      } else if (product.stock < 10) { // Define low-stock threshold
        lowStockCount++;
      }
    });

    // ✅ Return JSON Response
    return {
      totalInventoryCapacity,
      totalProducts,
      lowStockCount,
      outOfStockCount,
    };
  } catch (error) {
    console.error("Error fetching inventory levels:", error);
    throw new Error("Failed to fetch inventory data.");
  }
};
