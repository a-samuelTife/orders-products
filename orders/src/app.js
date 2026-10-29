const express = require("express");
const app = express();
app.use(express.json()); // lets us read JSON request bodies

// Where is the Products service? Read it from an environment variable.
const PRODUCTS_URL = process.env.PRODUCTS_URL || "http://localhost:3000";

const orders = []; // in-memory storage

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/orders", (req, res) => {
  res.json(orders);
});

app.post("/orders", async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ error: "productId and quantity are required" });
  }

  try {
    // Orders calls Products over HTTP. This is service-to-service communication.
    const response = await fetch(`${PRODUCTS_URL}/products/${productId}`, {
      headers: { "x-api-key": process.env.PRODUCTS_API_KEY || "" },
    });

    if (response.status === 404) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (!response.ok) {
      throw new Error(`Products returned ${response.status}`);
    }

    const product = await response.json();
    const order = {
      id: orders.length + 1,
      productId,
      quantity,
      total: product.price * quantity,
      createdAt: new Date().toISOString(),
    };
    orders.push(order);
    res.status(201).json(order);
  } catch (err) {
    console.error("Failed to reach Products service:", err.message);
    res.status(502).json({ error: "Products service unavailable" });
  }
});

module.exports = app;