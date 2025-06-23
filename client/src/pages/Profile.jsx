import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    address: ""
  });
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || ""
      });
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/orders/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Siparişler alınamadı:", err.response?.data?.error || err.message);
    }
  };

  const toggleOrder = (orderId) => {
    setExpandedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/profile/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.status === 200) {
        setMessage("Profil başarıyla güncellendi.");
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
        updateUser(res.data.user);
      }
    } catch (err) {
      console.error("Güncelleme hatası:", err.response?.data?.error || err.message);
      setMessage("Güncelleme başarısız oldu.");
    }
  };

  return (
    <div className="container mx-auto mt-8 flex flex-col md:flex-row gap-8">

      {/* Siparişler */}
      <div className="md:w-1/3 bg-blue-50 border border-blue-100 p-4 rounded-lg shadow max-h-[600px] overflow-y-auto scrollbar-white">
        <h2 className="text-xl font-bold text-blue-800 mb-4">Siparişler</h2>
        {orders.length === 0 ? (
          <p className="text-blue-600">Hiç siparişiniz yok.</p>
        ) : (
          <ul className="space-y-3">
            {orders.map(order => (
              <li key={order._id} className="bg-white p-2 rounded border shadow-sm">
                <div className="flex justify-between items-center text-sm font-medium text-blue-900">
                  <span>Sipariş ID: {order._id.slice(-6).toUpperCase()}</span>
                  <button
                    onClick={() => toggleOrder(order._id)}
                    className="bg-blue-200 hover:bg-blue-300 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                    title="Detay"
                  >
                    i
                  </button>
                </div>
                <div className="text-xs text-blue-700"><span className="font-bold">Durum:</span> {order.status}</div>
                <div className="text-xs text-blue-700"><span className="font-bold">Toplam:</span> {order.totalPrice} ₺</div>
                <div className="text-xs text-blue-700"><span className="font-bold">Tarih:</span> {new Date(order.createdAt).toLocaleDateString()}</div>
                {/* Adres Bilgisi */}
                {expandedOrders.includes(order._id) && (
                  <div className="mb-2 text-xs text-blue-700">
                    {order.shippingAddress ? (
                      <>
                        <div><span className="font-bold">Adres:</span> {order.shippingAddress.street}</div>
                        <div><span className="font-bold">Şehir:</span> {order.shippingAddress.city}</div>
                        <div><span className="font-bold">Posta Kodu:</span> {order.shippingAddress.postalCode}</div>
                        <div><span className="font-bold">Ülke:</span> {order.shippingAddress.country}</div>
                      </>
                    ) : (
                      <div>Adres bilgisi yok</div>
                    )}
                  </div>
                )}
                {expandedOrders.includes(order._id) && (
                  <div className="mt-2 space-y-1">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-blue-800">
                          <span>{item.name}</span>
                          <span>
                            ({item.price} ₺ x {item.quantity}) = {(item.price * item.quantity).toFixed(2)} ₺
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-blue-600">Ürün bilgisi yok.</div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Profil Formu */}
      <div className="md:w-2/3 bg-white border border-blue-100 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-6 text-center">Profil Bilgileri</h1>

        {message && (
          <div className="mb-4 text-center px-4 py-2 rounded bg-blue-50 text-blue-700 font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-blue-700">Kullanıcı Adı</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-white border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-blue-700">E-posta</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-blue-700">Telefon Numarası</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full bg-white border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-blue-700">Adres</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-white border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold transition"
          >
            Güncelle
          </button>
        </form>

        <button
          onClick={logout}
          className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-bold transition"
        >
          Çıkış Yap
        </button>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-block text-blue-600 hover:underline font-medium"
          >
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;
