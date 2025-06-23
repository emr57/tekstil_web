import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-700 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-2 pr-4 flex justify-between items-center">
        <Link to="/" className="flex items-center ml-6">
          <img src="/logo.png" alt="Dokusan Logo" className="h-14" />
        </Link>
        <div className="hidden md:flex space-x-5 text-base items-center">
          <Link to="/" className="hover:bg-orange-500 hover:text-white px-4 py-2 rounded transition-colors duration-200 text-white">Ana Sayfa</Link>
          <Link to="/cart" className="flex items-center space-x-2 hover:bg-orange-500 hover:text-white px-4 py-2 rounded transition-colors duration-200 text-white">
            <FaShoppingCart className="w-6 h-6" />
            <span>Sepet</span>
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="flex items-center space-x-2 hover:bg-orange-500 hover:text-white px-4 py-2 rounded transition-colors duration-200 text-white">
                <FaUserCircle className="w-8 h-8 text-white" />
                <span className="hidden sm:inline text-base">{user.username}</span>
              </Link>
              <button
                onClick={logout}
                className="ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:bg-orange-500 hover:text-white px-4 py-2 rounded transition-colors duration-200 text-white">Giriş Yap</Link>
          )}
        </div>

        {/* Mobil menü butonu */}
        <div className="md:hidden flex items-center space-x-1">
          {user && (
            <FaUserCircle className="w-7 h-7 text-white" />
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobil menü içeriği */}
      {menuOpen && (
        <div className="md:hidden bg-blue-600 p-4 space-y-2">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block hover:bg-orange-500 hover:text-white px-4 py-2 rounded transition-colors duration-200">Ana Sayfa</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center space-x-2 hover:bg-orange-500 hover:text-white px-4 py-2 rounded transition-colors duration-200">
            <FaShoppingCart className="w-6 h-6" />
            <span>Sepet</span>
          </Link>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center space-x-2 hover:bg-orange-500 hover:text-white px-4 py-2 rounded transition-colors duration-200">
                <FaUserCircle className="w-8 h-8 text-white" />
                <span className="text-base">{user.username}</span>
              </Link>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block hover:bg-orange-500 hover:text-white px-4 py-2 rounded transition-colors duration-200">Giriş Yap</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
