import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Kullanıcılar alınamadı:", err.response?.data?.error || err.message);
      }
    };

    if (user?.isAdmin) {
      fetchUsers();
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`http://localhost:5000/api/admin/users/${editUser._id}`, editUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(prev => prev.map(u => (u._id === res.data._id ? res.data : u)));
      setEditUser(null);
      alert("Kullanıcı güncellendi");
    } catch (err) {
      console.error("Güncelleme hatası:", err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Admin: Kullanıcı Yönetimi</h1>

      {users.map(u => (
        <div key={u._id} className="border p-3 mb-2 rounded">
          <div className="flex justify-between items-center">
            <div>
              <p><strong>{u.username}</strong> - {u.email}</p>
              <p>Admin: {u.isAdmin ? "Evet" : "Hayır"}</p>
            </div>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={() => setEditUser(u)}
            >
              Düzenle
            </button>
          </div>
        </div>
      ))}

      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Kullanıcı Düzenle</h2>
            <input
              type="text"
              value={editUser.username}
              onChange={e => setEditUser({ ...editUser, username: e.target.value })}
              className="bg-white border p-2 mb-2 w-full"
              placeholder="Kullanıcı Adı"
            />
            <input
              type="email"
              value={editUser.email}
              onChange={e => setEditUser({ ...editUser, email: e.target.value })}
              className="bg-white border p-2 mb-2 w-full"
              placeholder="E-posta"
            />
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={editUser.isAdmin}
                onChange={e => setEditUser({ ...editUser, isAdmin: e.target.checked })}
              />
              <span className="ml-2">Admin</span>
            </label>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditUser(null)} className="px-3 py-1 rounded bg-gray-300">İptal</button>
              <button onClick={handleUpdate} className="px-3 py-1 rounded bg-green-500 text-white">Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
