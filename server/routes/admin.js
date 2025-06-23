// routes/admin.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const adminController = require('../controllers/adminController');

// tüm kullanıcıları getirir
router.get("/users", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Yetkiniz yok" });
  }

  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Kullanıcı listesi hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// kullanıcıyı günceller
router.put("/users/:id", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Yetkiniz yok" });
  }

  try {
    const { username, email, isAdmin } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, isAdmin },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

    res.json(user);
  } catch (err) {
    console.error("Kullanıcı güncelleme hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// sipariş durumunu günceller
router.put("/orders/:id", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Yetkiniz yok" });
  }

  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Sipariş bulunamadı" });
    }

    res.json({ message: "Sipariş durumu güncellendi", order });
  } catch (err) {
    console.error("Sipariş güncelleme hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// admin istatistiklerini getirir
router.get('/admin/stats', authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: "Yetkiniz yok" });

  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue
    });
  } catch (err) {
    console.error("Admin stats hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// tüm ürünleri getirir
router.get('/products', authMiddleware, adminController.getAllProducts);

// yeni ürün ekler
router.post('/products', authMiddleware, adminController.createProduct);

// ürünü günceller
router.put('/products/:id', authMiddleware, adminController.updateProduct);

// ürünü siler
router.delete('/products/:id', authMiddleware, adminController.deleteProduct);

module.exports = router;
