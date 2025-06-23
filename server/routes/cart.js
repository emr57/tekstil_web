const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// kullanıcının sepetini getirir
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart || { userId: req.params.userId, items: [] });
  } catch (err) {
    res.status(500).json({ error: "sunucu hatası", details: err });
  }
});

// sepete ürün ekler
router.post('/:userId', async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      cart = new Cart({ userId: req.params.userId, items: [] });
    }

    // ürünü sepette bulursa miktarını artırır, yoksa ekler
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "sunucu hatası", details: err });
  }
});

// sepetteki ürünün miktarını günceller
router.put('/:userId', async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity == null) {
    return res.status(400).json({ error: "productId ve quantity gereklidir" });
  }

  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ error: "sepet bulunamadı" });

    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) return res.status(404).json({ error: "ürün sepette bulunamadı" });

    if (quantity < 1) {
      // miktar 1'in altındaysa ürünü sepetten çıkarır
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "sunucu hatası", details: err });
  }
});

// sepetteki ürünü siler
router.delete('/:userId/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ error: "sepet bulunamadı" });

    cart.items = cart.items.filter(item => item.productId !== req.params.productId);
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "sunucu hatası", details: err });
  }
});

// kullanıcının sepetini tamamen siler
router.delete("/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "sepet bulunamadı" });
    }

    await Cart.deleteOne({ _id: cart._id });

    res.json({ message: "sepet başarıyla sıfırlandı / silindi" });
  } catch (err) {
    console.error("sepet silme hatası:", err);
    res.status(500).json({ error: "sunucu hatası" });
  }
});

module.exports = router;
