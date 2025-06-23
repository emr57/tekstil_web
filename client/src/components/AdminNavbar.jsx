import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaTachometerAlt, FaUsers, FaShoppingCart, FaUserCircle, FaBoxOpen } from "react-icons/fa";

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center ml-6">
          <img src="/logo.png" alt="Dokusan Logo" className="h-14" />
        </Link>
        <div className="hidden md:flex space-x-6 items-center text-base">
          <Link to="/admin" className="flex items-center space-x-2 px-4 py-2 rounded transition-colors duration-200 bg-blue-700 text-white hover:bg-orange-500 hover:text-white">
            <FaTachometerAlt className="w-6 h-6" />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/users" className="flex items-center space-x-2 px-4 py-2 rounded transition-colors duration-200 bg-blue-700 text-white hover:bg-orange-500 hover:text-white">
            <FaUsers className="w-6 h-6" />
            <span>Kullanıcılar</span>
          </Link>
          <Link to="/admin/orders" className="flex items-center space-x-2 px-4 py-2 rounded transition-colors duration-200 bg-blue-700 text-white hover:bg-orange-500 hover:text-white">
            <FaShoppingCart className="w-6 h-6" />
            <span>Siparişler</span>
          </Link>
          <Link to="/admin/products" className="flex items-center space-x-2 px-4 py-2 rounded transition-colors duration-200 bg-blue-700 text-white hover:bg-orange-500 hover:text-white">
            <FaBoxOpen className="w-6 h-6" />
            <span>Ürünler</span>
          </Link>
          <div className="flex items-center space-x-2 px-4 py-2 rounded text-white text-base">
            <FaUserCircle className="w-8 h-8 text-white" />
            <span className="hidden sm:inline text-base">{user?.username || "Admin"}</span>
          </div>
          <button
            onClick={handleLogout}
            className="ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-base"
          >
            Çıkış Yap
          </button>
        </div>

        {/* Mobil menü butonu */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-blue-700 p-4 space-y-2 text-base">
          <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center space-x-2 px-4 py-2 rounded transition-colors duration-200 bg-blue-700 text-white hover:bg-orange-500 hover:text-white">
            <FaTachometerAlt className="w-6 h-6" />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/users" onClick={() => setMenuOpen(false)} className="flex items-center space-x-2 px-4 py-2 rounded transition-colors duration-200 bg-blue-700 text-white hover:bg-orange-500 hover:text-white">
            <FaUsers className="w-6 h-6" />
            <span>Kullanıcılar</span>
          </Link>
          <Link to="/admin/orders" onClick={() => setMenuOpen(false)} className="flex items-center space-x-2 px-4 py-2 rounded transition-colors duration-200 bg-blue-700 text-white hover:bg-orange-500 hover:text-white">
            <FaShoppingCart className="w-6 h-6" />
            <span>Siparişler</span>
          </Link>
          <Link to="/admin/products" onClick={() => setMenuOpen(false)} className="flex items-center space-x-2 px-4 py-2 rounded transition-colors duration-200 bg-blue-700 text-white hover:bg-orange-500 hover:text-white">
            <FaBoxOpen className="w-6 h-6" />
            <span>Ürünler</span>
          </Link>
          <div className="flex items-center space-x-2 px-4 py-2 rounded text-white text-base">
            <FaUserCircle className="w-8 h-8 text-white" />
            <span className="text-base">{user?.username || "Admin"}</span>
          </div>
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full text-base"
          >
            Çıkış Yap
          </button>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
