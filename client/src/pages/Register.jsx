import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/"); // Başarılıysa ana sayfaya yönlendir
      } else {
        setError(data.error || "Kayıt başarısız.");
      }
    } catch (err) {
      console.error("Kayıt hatası:", err);
      setError("Sunucu hatası. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Kayıt Ol</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Kullanıcı Adı</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded bg-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded bg-white"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Şifre</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded bg-white"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Kayıt Ol
        </button>
      </form>
    </div>
  );
};

export default Register;