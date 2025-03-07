import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firestoreAdmin";

export async function GET() {
  try {
    const now = new Date();

    // Define time ranges
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(startOfMonth.getTime() - 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

    // Fetch orders from the current and last month
    const snapshot = await adminDB.collection("orders")
      .where("orderDate", ">=", startOfLastMonth)
      .get();

    let todaySales = 0;
    let monthlySales = 0;
    let previousMonthSales = 0;
    const weeklySalesTrend: { [key: string]: number } = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

    // Store item sales data
    const itemSales: { [productId: string]: { unitsSold: number; revenue: number } } = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (!data.orderDate || !data.totalAmount || !data.items) return;

      const saleDate = data.orderDate.toDate();
      const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][saleDate.getDay()];
      weeklySalesTrend[dayOfWeek] += 1; // Increment transaction count

      if (saleDate >= startOfMonth) {
        monthlySales += data.totalAmount || 0;

        // Track item sales
        data.items.forEach((item: { productId: string; quantity: number; price: number }) => {
          if (!itemSales[item.productId]) {
            itemSales[item.productId] = { unitsSold: 0, revenue: 0 };
          }
          itemSales[item.productId].unitsSold += item.quantity;
          itemSales[item.productId].revenue += item.quantity * item.price;
        });
      } else if (saleDate >= startOfLastMonth && saleDate <= endOfLastMonth) {
        previousMonthSales += data.totalAmount || 0;
      }

      if (saleDate >= startOfDay) {
        todaySales += data.totalAmount || 0;
      }
    });

    // Find the top-selling product based on units sold
    let hotItemId: string | null = null;
    let hotItemData = { unitsSold: 0, revenue: 0 };

    Object.entries(itemSales).forEach(([productId, data]) => {
      if (data.unitsSold > hotItemData.unitsSold) {
        hotItemId = productId;
        hotItemData = data;
      }
    });

    let hotItemDetails = null;

    if (hotItemId) {
      // Fetch product details in the same request
      const productDoc = await adminDB.collection("products").doc(hotItemId).get();
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

    return NextResponse.json({
      todaySales,
      weeklySalesTrend: Object.entries(weeklySalesTrend).map(([day, value]) => ({ day, value })),
      monthlySales,
      previousMonthSales,
      hotItem: hotItemDetails,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch sales data." }, { status: 500 });
  }
}
