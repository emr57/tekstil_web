import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Veri alınamadı:", err));
  }, []);

  const categories = [...new Set(products.map((p) => p.category))];

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const addToCart = async (productId) => {
    if (!user) {
      alert("Lütfen önce giriş yapın.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/cart/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: 1 })
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Sepet güncellendi:", data);
        alert("Ürün sepete eklendi.");
      } else {
        console.error("Sepete eklenemedi:", await res.text());
        alert("Sepete eklenemedi.");
      }
    } catch (err) {
      console.error("Sunucu hatası:", err);
      alert("Sunucu hatası. Daha sonra tekrar deneyin.");
    }
  };

  return (
    <main className="container flex-grow mx-auto px-4 py-8 grid md:grid-cols-4 md:items-start gap-6">
      <aside className="md:col-span-1 bg-blue-50 border border-blue-200 p-4 rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Kategoriler</h2>
        <ul className="space-y-3 text-blue-800">
          <li>
            <button
              onClick={() => setSelectedCategory("")}
              className={`w-full text-left px-2 py-1 rounded bg-white text-black hover:bg-blue-100 transition ${
                selectedCategory === "" ? "font-bold" : ""
              }`}
            >
              TÜM ÜRÜNLER
            </button>
          </li>
          {categories.map((cat, idx) => (
            <li key={idx}>
              <button
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-2 py-1 rounded bg-white text-black hover:bg-blue-100 transition ${
                  selectedCategory === cat ? "font-bold underline" : ""
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="md:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300 group"
            >
              <Link to={`/product/${product._id}`} className="block overflow-hidden">
                <img
                  src={product.image || "https://via.placeholder.com/400x250?text=Yedek+Parça"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 h-12 overflow-hidden">
                    {product.description?.slice(0, 80) || "Bu ürün için açıklama mevcut değil."}...
                  </p>
                  <span className="text-blue-600 font-bold text-xl">
                    {product.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </span>
                </div>
              </Link>
              <div className="p-4 pt-0">
                <button
                  onClick={() => addToCart(product._id)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-300"
                >
                  Sepete Ekle
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">Bu kategoride ürün bulunamadı.</p>
        )}
      </section>
    </main>
  );
};

export default Home;
