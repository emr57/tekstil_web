const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();



const app = express();
const PORT = process.env.PORT || 5000;



// Middleware
app.use(cors()); //front dan gelen istekleri kabul eder
app.use(express.json()); // json formatındaki istekleri çözümler

app.use("/api/auth", authRoutes);

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB bağlantısı başarılı"))
  .catch((err) => console.error("MongoDB bağlantı hatası:", err
));
const userRoutes = require("./routes/users");
app.use("/api", userRoutes);

app.use("/api/admin", require("./routes/admin"));

const registerRoutes = require("./routes/register")
app.use("/api/register", registerRoutes);

const orderRoutes = require("./routes/orders");
app.use("/api/orders", orderRoutes);

const productRoutes = require("./routes/products");
app.use("/api/products", productRoutes);

const profileRoutes = require("./routes/profile");
app.use("/api/profile", profileRoutes);

const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);

// React frontend (vite -> dist klasörü)
app.use(express.static(path.join(__dirname, "../client/dist")));

//  UYUMLU wildcard route (Express 5 için GÜNCEL)
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: ${PORT}`);
});
