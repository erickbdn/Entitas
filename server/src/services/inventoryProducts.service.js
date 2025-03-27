const { db } = require("../firebase");
const admin = require("firebase-admin");

exports.fetchInventoryProducts = async (req) => {
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

        let { page = 1, limit = 10, filter = "all", search = "", sort = "nameAsc" } = req.query;
        const offset = (page - 1) * limit;

        let query = db.collection("products");

        // 🔹 Fetch all products (since Firestore doesn't support OR queries)
        const snapshot = await query.get();
        let products = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // 🔹 Apply Search Filter for Name OR SKU
        if (search) {
            search = search.toLowerCase();
            products = products.filter(
                (product) =>
                    product.name.toLowerCase().includes(search) || 
                    product.sku.toLowerCase().includes(search)
            );
        }

        // 🔹 Apply In Stock / Out of Stock Filter AFTER fetching
        if (filter === "In Stock") {
            products = products.filter((product) => product.status === "In Stock");
        } else if (filter === "Out of Stock") {
            products = products.filter((product) => product.status === "Out of Stock");
        }

        // 🔹 Apply Sorting AFTER filtering
        switch (sort) {
            case "priceAsc":
                products.sort((a, b) => a.price - b.price);
                break;
            case "priceDesc":
                products.sort((a, b) => b.price - a.price);
                break;
            case "stockAsc":
                products.sort((a, b) => a.stock - b.stock);
                break;
            case "stockDesc":
                products.sort((a, b) => b.stock - a.stock);
                break;
            default:
                products.sort((a, b) => a.name.localeCompare(b.name)); // Default: Name Ascending
        }

        // 🔹 Apply Pagination AFTER filtering & sorting
        const totalProducts = products.length;
        const totalPages = Math.ceil(totalProducts / limit);
        products = products.slice(offset, offset + parseInt(limit));

        return { products, totalPages, totalProducts };
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch inventory products.");
    }
};

exports.addInventoryProduct = async (req) => {
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

        // 🔹 Extract Product Data from Request Body
        const { name, price, stock, status, imageUrl, sku } = req.body;

        if (!name || !price || !stock || !status || !sku) {
            throw new Error("Missing required fields");
        }

        // 🔹 Prepare Product Data
        const newProduct = {
            name,
            price: parseFloat(price),
            stock: parseInt(stock),
            status,
            imageUrl: imageUrl || "", // Default empty if no image
            sku,
            availability: stock > 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        // 🔹 Add Product to Firestore
        const productRef = await db.collection("products").add(newProduct);
        newProduct.id = productRef.id; // Assign Firestore ID to response

        return newProduct;
    } catch (error) {
        console.error("Error adding product:", error);
        throw new Error("Failed to add inventory product.");
    }
};

