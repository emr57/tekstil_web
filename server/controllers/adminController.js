const Product = require('../models/Product');

// tüm ürünleri getirir
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'ürünler alınamadı.' });
  }
};

// yeni ürün ekler
exports.createProduct = async (req, res) => {
  try {
    const { name, price, image, category } = req.body;
    const product = new Product({ name, price, image, category });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: 'ürün eklenemedi.' });
  }
};

// ürünü günceller
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, image, category } = req.body;
    const updated = await Product.findByIdAndUpdate(
      id,
      { name, price, image, category },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'ürün bulunamadı.' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'ürün güncellenemedi.' });
  }
};

// ürünü siler
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'ürün bulunamadı.' });
    res.json({ message: 'ürün silindi.' });
  } catch (err) {
    res.status(400).json({ error: 'ürün silinemedi.' });
  }
};
