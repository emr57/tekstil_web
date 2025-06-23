const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "senin_gizli_anahtarın";

// kullanıcı giriş yapar
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("login middleware");

  try {
    // email ile kullanıcıyı bulur
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "kullanıcı bulunamadı" });
    }

    // şifreyi kontrol eder
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "hatalı şifre" });
    }

    // token üretir
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "giriş başarılı",
      token
    });

  } catch (err) {
    console.error("login hatası:", err);
    res.status(500).json({ error: "sunucu hatası" });
  }
});

// yeni kullanıcı kaydeder
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("register api çağrıldı");
  try {
    // aynı email var mı bakar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "bu e-posta zaten kullanılıyor." });
    }

    // şifreyi hash'ler
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // yeni kullanıcı oluşturur
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // token üretir
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "kayıt başarılı",
      token
    });

  } catch (err) {
    console.error("kayıt hatası:", err);
    res.status(500).json({ error: "sunucu hatası" });
  }
});

// admin istatistiklerini getirir
router.get('/admin/stats', authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: "yetkiniz yok" });

  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (err) {
    console.error("admin stats hatası:", err);
    res.status(500).json({ error: "sunucu hatası" });
  }
});

// admin siparişleri listeler
router.get("/admin/orders", authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "yetkiniz yok" });
    }

    const orders = await Order.find()
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("sipariş listeleme hatası:", err);
    res.status(500).json({ error: "sunucu hatası" });
  }
});

// kullanıcı profilini günceller
router.put("/:id", authMiddleware, async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: "kullanıcı bulunamadı" });
    res.json({ message: "profil güncellendi", user });
  } catch (err) {
    console.error("profil güncelleme hatası:", err);
    res.status(500).json({ error: "sunucu hatası" });
  }
});

module.exports = router;
