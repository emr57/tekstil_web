const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// tüm ürünleri getirir
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "sunucu hatası" });
  }
});

// tek bir ürünü getirir
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "ürün bulunamadı" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "sunucu hatası" });
  }
});

// yeni ürün oluşturur
router.post("/", async (req, res) => {
  const { name, description, price, category, image } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "ad ve fiyat zorunludur" });
  }

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: "sunucu hatası" });
  }
});

// ürünü günceller
router.put("/:id", async (req, res) => {
  const { name, description, price, category, image } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, image },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "ürün bulunamadı" });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: "sunucu hatası" });
  }
});

// ürün araması yapar
router.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "arama terimi gerekli" });
  }

  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ]
    });
    console.log("arama sonucu:", products);
    res.json(products);
  } catch (err) {
    console.error("arama hatası:", err);
    res.status(500).json({ error: "sunucu hatası" });
  }
});

// ürünü siler
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "ürün bulunamadı" });
    }

    res.json({ message: "ürün silindi" });
  } catch (err) {
    res.status(500).json({ error: "sunucu hatası" });
  }
});

module.exports = router;
