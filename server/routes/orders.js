const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware"); // token kontrolü yapar

// yeni sipariş oluşturur
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "sipariş ürünleri boş olamaz." });
    }

    // toplam fiyatı hesaplar
    const totalPrice = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    // siparişi kaydeder
    const order = new Order({
      user: req.user.id,
      items,
      shippingAddress,
      totalPrice
    });

    await order.save();

    res.status(201).json({
      message: "sipariş oluşturuldu.",
      order
    });
  } catch (err) {
    console.error("sipariş oluşturma hatası:", err);
    res.status(500).json({ error: "sunucu hatası" });
  }
});

// kullanıcının kendi siparişlerini getirir
router.get("/user/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: "yetkisiz erişim." });
    }

    const orders = await Order.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json(orders);
  } catch (err) {
    console.error("siparişleri getirme hatası:", err);
    res.status(500).json({ error: "sunucu hatası." });
  }
});

module.exports = router;
