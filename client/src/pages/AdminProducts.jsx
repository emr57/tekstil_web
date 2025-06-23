import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const initialForm = { name: "", price: "", image: "", category: "" };

const AdminProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('API ürünler yanıtı:', res.data);
      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      setError("Ürünler alınamadı.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) fetchProducts();
  }, [user]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (editId) {
        await axios.put(`http://localhost:5000/api/admin/products/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post("http://localhost:5000/api/admin/products", form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowForm(false);
      setForm(initialForm);
      setEditId(null);
      fetchProducts();
    } catch (err) {
      setError("Ürün kaydedilemedi.");
    }
  };

  const handleEdit = product => {
    setForm({
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
    setEditId(product._id);
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (!window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      setError("Ürün silinemedi.");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Admin: Ürünler</h1>
      <button
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        onClick={() => { setShowForm(true); setForm(initialForm); setEditId(null); }}
      >
        Ürün Ekle
      </button>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-blue-50 p-4 rounded">
          <div className="mb-2">
            <label className="block font-semibold">Ürün Adı</label>
            <input name="name" value={form.name} onChange={handleChange} required className="border rounded px-2 py-1 w-full bg-white text-black" />
          </div>
          <div className="mb-2">
            <label className="block font-semibold">Fiyat</label>
            <input name="price" value={form.price} onChange={handleChange} required type="number" step="0.01" className="border rounded px-2 py-1 w-full bg-white text-black" />
          </div>
          <div className="mb-2">
            <label className="block font-semibold">Görsel (URL)</label>
            <input name="image" value={form.image} onChange={handleChange} className="border rounded px-2 py-1 w-full bg-white text-black" />
          </div>
          <div className="mb-2">
            <label className="block font-semibold">Kategori</label>
            <input name="category" value={form.category} onChange={handleChange} required className="border rounded px-2 py-1 w-full bg-white text-black" />
          </div>
          <div className="flex space-x-2 mt-2">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Kaydet</button>
            <button type="button" className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded" onClick={() => { setShowForm(false); setEditId(null); }}>İptal</button>
          </div>
        </form>
      )}
      {loading ? (
        <div>Ürünler yükleniyor...</div>
      ) : (
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr>
              <th className="px-3 py-2 border-b text-left">Adı</th>
              <th className="px-3 py-2 border-b text-left">Fiyat</th>
              <th className="px-3 py-2 border-b text-left">Kategori</th>
              <th className="px-3 py-2 border-b text-left">Görsel</th>
              <th className="px-3 py-2 border-b text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(products) ? products : []).map(product => (
              <tr key={product._id} className="hover:bg-blue-50">
                <td className="px-3 py-2 border-b">{product.name}</td>
                <td className="px-3 py-2 border-b">{product.price} ₺</td>
                <td className="px-3 py-2 border-b">{product.category}</td>
                <td className="px-3 py-2 border-b">
                  {product.image ? <img src={product.image} alt={product.name} className="h-12 w-12 object-cover rounded" /> : "-"}
                </td>
                <td className="px-3 py-2 border-b">
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2" onClick={() => handleEdit(product)}>Düzenle</button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleDelete(product._id)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminProducts; 