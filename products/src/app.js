const express = require("express");
const app = express();


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