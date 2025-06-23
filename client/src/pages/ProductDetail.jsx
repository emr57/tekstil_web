import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Ürün detayı alınamadı:", err));
  }, [id]);

  const addToCart = async () => {
    if (!user) {
      alert("Lütfen giriş yapınız.");
      return;
    }

    if (quantity < 1) {
      alert("Miktar en az 1 olmalıdır.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/cart/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: quantity
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Ürün sepete eklendi!");
      } else {
        console.error("Sepete ekleme hatası:", data.error);
        alert(`Sepete eklenemedi: ${data.error}`);
      }
    } catch (err) {
      console.error("Sunucu hatası:", err);
      alert("Sunucu hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-blue-700 text-lg">Ürün bilgileri yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.image || "https://via.placeholder.com/600x400?text=Yedek+Parça"}
            alt={product.name}
            className="w-full h-96 object-cover rounded"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6">{product.description || "Açıklama bulunamadı."}</p>
            <p className="text-blue-700 text-2xl font-bold mb-4">{product.price} ₺</p>

            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                -
              </button>
              <span className="text-lg font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={addToCart}
              disabled={loading}
              className={`flex-1 ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } text-white py-3 rounded transition`}
            >
              {loading ? "Ekleniyor..." : "Sepete Ekle"}
            </button>
            <Link
              to="/"
              className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded transition"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
