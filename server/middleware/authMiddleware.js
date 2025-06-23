const jwt = require("jsonwebtoken");

const JWT_SECRET = "senin_gizli_anahtarın"; // Gerçekte bunu .env dosyasından al!

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Yetkilendirme başarısız, token gerekli." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Artık route'larda req.user.id, req.user.email, req.user.username erişilebilir
    next();
  } catch (err) {
    console.error("Token doğrulama hatası:", err.message);
    return res.status(401).json({ error: "Geçersiz veya süresi dolmuş token." });
  }
};

module.exports = authMiddleware;