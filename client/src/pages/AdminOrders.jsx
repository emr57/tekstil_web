import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AdminOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/orders", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Siparişler alınamadı:", err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.isAdmin) {
      fetchOrders();
    }
  }, [user]);

  const handleStatusChange = (orderId, newStatus) => {
    setStatusUpdates(prev => ({
      ...prev,
      [orderId]: newStatus
    }));
  };

  const updateStatus = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = statusUpdates[orderId];
      if (!newStatus) {
        alert("Lütfen bir durum seçiniz.");
        return;
      }

      // ✅ URL düzeltildi -> /status kısmı kaldırıldı
      await axios.put(`http://localhost:5000/api/admin/orders/${orderId}`, 
        { status: newStatus }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Güncel listeyi tekrar çek
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(res.data);
      setLoading(false);

    } catch (err) {
      console.error("Durum güncelleme hatası:", err.response?.data?.error || err.message);
      alert("Durum güncellenemedi.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-blue-600">Siparişler yükleniyor...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin: Siparişler</h1>
      {orders.length === 0 ? (
        <p className="text-blue-700">Henüz sipariş yok.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map(order => (
            <li key={order._id} className="bg-white border rounded p-4 shadow">
              <div className="text-base font-normal text-black"><span className="font-bold">Sipariş ID:</span> {order._id}</div>
              <div className="text-base font-normal text-black"><span className="font-bold">Kullanıcı:</span> {order.user.username || "Bilinmiyor"}</div>
              <div className="text-base font-normal text-black"><span className="font-bold">Toplam:</span> {order.totalPrice} ₺</div>
              <div className="text-base font-normal text-black"><span className="font-bold">Durum:</span> {order.status}</div>
              <div className="text-base font-normal text-black"><span className="font-bold">Tarih:</span> {new Date(order.createdAt).toLocaleDateString()}</div>

              {/* Adres Bilgisi */}
              <div className="mt-2 text-base font-normal text-black">
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

              <div className="mt-2">
                <select
                  value={statusUpdates[order._id] || order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="bg-white border rounded px-2 py-1 mr-2 text-base font-normal text-black"
                >
                  <option value="hazırlanıyor">Hazırlanıyor</option>
                  <option value="kargolandı">Kargolandı</option>
                  <option value="teslim edildi">Teslim Edildi</option>
                  <option value="iptal edildi">İptal Edildi</option>
                </select>
                <button
                  onClick={() => updateStatus(order._id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-base font-normal"
                >
                  Güncelle
                </button>
              </div>

              <div className="mt-2 bg-blue-50 p-2 rounded">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-base font-normal text-black">
                    <span>{item.name}</span>
                    <span>({item.price} ₺ x {item.quantity}) = {(item.price * item.quantity).toFixed(2)} ₺</span>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminOrders;
