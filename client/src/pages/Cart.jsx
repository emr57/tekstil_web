import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getCart();
      getProducts();
    } else {
      setLoading(false);
    }
  }, [user]);

  const getCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/cart/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Sepet verisi alınamadı:", err);
    } finally {
      setLoading(false);
    }
  };

  const getProducts = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Ürünler alınamadı:", err);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(productId);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/cart/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: newQuantity })
      });
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Miktar güncellenemedi:", err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/cart/${user.id}/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  const getProductInfo = (productId) => {
    return products.find((p) => p._id === productId) || {};
  };

  const totalPrice = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => {
      const product = getProductInfo(item.productId);
      return sum + (product.price || 0) * item.quantity;
    }, 0);
  };

  const createOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const orderData = {
        items: cart.items.map((item) => {
          const product = getProductInfo(item.productId);
          return {
            productId: item.productId,
            name: product.name,
            price: product.price,
            quantity: item.quantity
          };
        }),
        shippingAddress: {
          street: "Deneme Sokak No:1",
          city: "İstanbul",
          postalCode: "34000",
          country: "Türkiye"
        }
      };

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Sipariş oluşturuldu:", data);
        alert("Siparişiniz başarıyla oluşturuldu!");
        await fetch(`http://localhost:5000/api/cart/${user.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCart({ items: [] });
      } else {
        console.error("Sipariş hatası:", data.error);
        alert(`Sipariş oluşturulamadı: ${data.error}`);
      }
    } catch (err) {
      console.error("Sunucu hatası:", err);
      alert("Sunucu hatası oluştu, lütfen tekrar deneyin.");
    }
  };

  return (
    <main className="container mx-auto p-4 flex-grow">
      <h1 className="text-2xl font-bold mb-4">Sepetiniz</h1>

      {loading ? (
        <p className="text-center">Sepet yükleniyor...</p>
      ) : !user ? (
        <p className="text-center text-blue-700">Sepet görüntülemek için giriş yapın.</p>
      ) : !cart || cart.items.length === 0 ? (
        <p className="text-center text-blue-700">Sepetiniz boş.</p>
      ) : (
        <>
          <div className="grid gap-4">
            {cart.items.map((item) => {
              const product = getProductInfo(item.productId);
              return (
                <div
                  key={item.productId}
                  className="flex justify-between items-center border p-3 rounded shadow"
                >
                  <div>
                    <p className="font-semibold">Ürün: {product.name || "Bilinmiyor"}</p>
                    <p>Fiyat: {product.price ? `${product.price} ₺` : "Bilinmiyor"}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="bg-blue-500 text-white px-2 rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="bg-blue-500 text-white px-2 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Sil
                  </button>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-right font-bold text-blue-700">
            Toplam: {totalPrice().toFixed(2)} ₺
          </div>
          <div className="mt-4 text-right">
            <button
              onClick={createOrder}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-2"
            >
              Siparişi Tamamla
            </button>
            <Link
              to="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </>
      )}
    </main>
  );
};

export default Cart;
