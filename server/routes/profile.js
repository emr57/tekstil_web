const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "senin_gizli_anahtarın";

// token kontrolü yapar
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token gerekli." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token doğrulama hatası:", err);
    return res.status(401).json({ error: "Geçersiz token." });
  }
};

// kullanıcı profilini günceller
router.put("/:id", authMiddleware, async (req, res) => {
  const updateData = {};
  const allowedFields = ["username", "email", "phoneNumber", "profileImage"];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    const newToken = jwt.sign({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      roles: updatedUser.roles,
      isAdmin: updatedUser.isAdmin
    }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Profil güncellendi.",
      user: updatedUser,
      token: newToken
    });

  } catch (err) {
    console.error("Profil güncelleme hatası:", err);
    res.status(500).json({ error: "Sunucu hatası." });
  }
});

// kullanıcının profilini getirir
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }
    console.log("get porfile");
    console.log(user);
    res.json(user);
  } catch (err) {
    console.error("Profil alma hatası:", err);
    res.status(500).json({ error: "Sunucu hatası." });
  }
});

module.exports = router;
