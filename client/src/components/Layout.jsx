import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-blue-900">
      <Navbar />
      <main className="container mx-auto p-4 flex-grow">
        <Outlet />
      </main>
      <footer className="bg-blue-50 border-t mt-12 py-6 text-center text-sm text-blue-700">
        © 2025 Dokusan Teknik. Tüm hakları saklıdır.
      </footer>
    </div>
  );
};

export default Layout;
