"use client";
import { db } from "@/lib/firestore"; // Ensure Firebase is initialized
import { collection, doc, setDoc } from "firebase/firestore";

// Sample categories
const categories = ["Clothing", "Electronics", "Home", "Toys", "Books", "Kitchen", "Sports"];

// Function to generate a random SKU
const generateSKU = () => `SKU${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

// Function to generate a random product name
const generateProductName = () => {
  const adjectives = ["Cool", "New", "Stylish", "Modern", "Classic", "Premium", "Compact"];
  const items = ["T-shirt", "Laptop", "Mug", "Backpack", "Book", "Headphones", "Sneakers"];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${items[Math.floor(Math.random() * items.length)]}`;
};

export default function SeedProducts() {
  const addDummyProducts = async () => {
    const productsRef = collection(db, "products");

    for (let i = 1; i <= 100; i++) {
      const productId = `PROD${String(i).padStart(3, "0")}`; // PROD001, PROD002, ...
      const stock = Math.random() < 0.7 ? Math.floor(Math.random() * 100) + 1 : 0; // 70% chance of being in stock
      const status = stock > 0 ? "In Stock" : "Out of Stock";
      const availability = stock > 0; // Available if in stock

      const productData = {
        name: generateProductName(),
        category: categories[Math.floor(Math.random() * categories.length)],
        price: Math.floor(Math.random() * 500) + 10, // $10 - $510
        sku: generateSKU(),
        stock,
        status,
        availability,
        imageUrl: "/PlaceholderItem.png",
        createdAt: new Date(), // Current timestamp
      };

      await setDoc(doc(productsRef, productId), productData);
    }

    alert("100 Dummy Products Added!");
  };

  return (
    <div className="p-10">
      <button onClick={addDummyProducts} className="px-4 py-2 bg-blue-500 text-white rounded-md">
        Add Dummy Products
      </button>
    </div>
  );
}
