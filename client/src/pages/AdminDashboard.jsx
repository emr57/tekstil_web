import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStats(res.data);
      } catch (err) {
        console.error("İstatistikler alınamadı:", err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/orders", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRecentOrders(res.data.slice(0, 5));
      } catch (err) {
        console.error("Son siparişler alınamadı:", err.response?.data?.error || err.message);
      }
    };

    fetchStats();
    if (user?.isAdmin) fetchRecentOrders();
  }, [user]);

  if (loading) {
    return <div className="text-center mt-10 text-blue-600">Yönetici istatistikleri yükleniyor...</div>;
  }

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">Gerçek zamanlı istatistikleri görüntüleyebilirsiniz.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-4 rounded flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-blue-800">Kullanıcılar</h2>
          <p className="text-blue-700">{stats.totalUsers} kullanıcı</p>
        </div>
        <div className="bg-green-100 p-4 rounded flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-green-800">Siparişler</h2>
          <p className="text-green-700">{stats.totalOrders} sipariş</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-yellow-800">Toplam Gelir</h2>
          <p className="text-yellow-700">₺{stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Hızlı Erişim</h2>
        <ul className="space-y-2">
          <li>
            <Link to="/admin/users" className="text-blue-600 hover:underline">
              Kullanıcı Yönetimi
            </Link>
          </li>
          <li>
            <Link to="/admin/orders" className="text-blue-600 hover:underline">
              Sipariş Yönetimi
            </Link>
          </li>
          <li>
            <Link to="/admin/products" className="text-blue-600 hover:underline">
              Ürün Yönetimi
            </Link>
          </li>
        </ul>
      </div>

      {/* Son 5 Sipariş Tablosu */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-700 mb-3">Son 5 Sipariş</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead>
              <tr>
                <th className="px-3 py-2 border-b text-left">Sipariş ID</th>
                <th className="px-3 py-2 border-b text-left">Kullanıcı</th>
                <th className="px-3 py-2 border-b text-left">Toplam</th>
                <th className="px-3 py-2 border-b text-left">Tarih</th>
                <th className="px-3 py-2 border-b text-left">Durum</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-4 text-gray-500">Sipariş yok</td></tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order._id} className="hover:bg-blue-50">
                    <td className="px-3 py-2 border-b">{order._id}</td>
                    <td className="px-3 py-2 border-b">{order.user.username || "Bilinmiyor"}</td>
                    <td className="px-3 py-2 border-b">{order.totalPrice} ₺</td>
                    <td className="px-3 py-2 border-b">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-3 py-2 border-b">{order.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
