const mongoose = require("mongoose");
const Order = require("./Order");

mongoose.connect("mongodb://127.0.0.1:27017/tekstil_db")
  .then(async () => {
    console.log("✅ MongoDB bağlantısı başarılı");

    const newOrder = new Order({
      user: new mongoose.Types.ObjectId("6856a787a5575b7de61b296a"),  // Kullanıcı ID buraya
      items: [
        {
          productId: new mongoose.Types.ObjectId("683907b8ff0f5fb7cb1a23df"),  // Ürün ID buraya
          name: "Örnek Ürün",
          price: 150,
          quantity: 2
        }
      ],
      totalPrice: 300,
      shippingAddress: {
        street: "Örnek Sokak 123",
        city: "İstanbul",
        postalCode: "34000",
        country: "Türkiye"
      }
    });

    await newOrder.save();
    console.log("✅ Sipariş başarıyla kaydedildi");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Hata:", err);
    process.exit(1);
  });
