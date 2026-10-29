const express = require("express");
const app = express();

// Secret key that callers must send. Comes from an environment variable.
const API_KEY = process.env.API_KEY;

// Blocking the requests that don't have the right key.
app.use((req, res, next) => {
  // If no key is configured, or it's the health check, let it through
  if (!API_KEY || req.path === "/health") return next();

  if (req.get("x-api-key") !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

const products = [
  { id: 1, name: "Laptop", price: 850 },
  { id: 2, name: "Phone", price: 500 },
  { id: 3, name: "Headphones", price: 80 },
];

// Health check: 
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// List all products
app.get("/products", (req, res) => {
  res.json(products);
});

// Get one product by id
app.get("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id)); 
  // check me
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

module.exports = app;