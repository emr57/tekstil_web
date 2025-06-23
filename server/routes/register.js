const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "senin_gizli_anahtarın";

// yeni kullanıcı kaydı yapar
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("register api çağrıldı");
  try {
    // aynı email var mı kontrol eder
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "bu e-posta zaten kullanılıyor." });
    }

    // şifreyi hashler
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // yeni kullanıcı oluşturur
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // token oluşturur
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

module.exports = router;
