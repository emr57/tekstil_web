const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      name: {
        type: String,
        required: true
      },   
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true
  },
    paymentStatus: {
    type: String,
    enum: ["beklemede", "ödendi", "başarısız", "iade edildi"],
    default: "beklemede"
    },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
    status: {
    type: String,
    enum: ["hazırlanıyor", "kargolandı", "teslim edildi", "iptal edildi"],
    default: "hazırlanıyor"
    },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

OrderSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Order", OrderSchema);
