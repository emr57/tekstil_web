const User = require("../models/User");

// şifresiz hashleme ile kullanıcı kaydı yapar (örnek kötü kullanım)
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // aynı username ya da email var mı kontrol eder
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "kullanıcı zaten mevcut." });
    }

    // yeni kullanıcıyı oluşturur (şifre hashlenmeden kaydediliyor)
    const newUser = new User({
      username,
      email,
      password // hashleme yok
    });

    await newUser.save();

    res.status(201).json({ message: "kayıt başarılı", user: { username, email } });
  } catch (error) {
    console.error("kayıt hatası:", error);
    res.status(500).json({ message: "sunucu hatası" });
  }
};

// şifresiz giriş kontrolü yapar (örnek kötü kullanım)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // email ile kullanıcıyı bulur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "e-posta bulunamadı" });
    }

    // düz şifre karşılaştırır (güvensiz yöntem)
    if (user.password !== password) {
      return res.status(401).json({ message: "şifre yanlış" });
    }

    res.status(200).json({ message: "giriş başarılı", user: { username: user.username, email: user.email } });
  } catch (error) {
    console.error("giriş hatası:", error);
    res.status(500).json({ message: "sunucu hatası" });
  }
};

module.exports = {
  registerUser,
  loginUser
};
