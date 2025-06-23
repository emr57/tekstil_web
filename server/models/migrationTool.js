const mongoose = require("mongoose");

const MONGODB_URI = "mongodb://127.0.0.1:27017/tekstil_db";

// Order modelini tanımla
const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  totalPrice: Number,
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending"
  },
  shippingAddress: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  status: {
    type: String,
    enum: ["processing", "shipped", "delivered", "cancelled"],
    default: "processing"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

const Order = mongoose.model("Order", OrderSchema);

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB bağlantısı başarılı");

    // Koleksiyonu tetiklemek için bir işlem yapmadan bağlantıyı kapatıyoruz
    console.log("✅ Order modeli tanımlandı, koleksiyon ilk veri ile otomatik oluşacak");

  } catch (err) {
    console.error("❌ Migration hatası:", err);
  } finally {
    await mongoose.disconnect();
  }
}

migrate();
