import React from "react";
import AdminNavbar from "./AdminNavbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <AdminNavbar />
      <main className="flex-grow p-6">
        <Outlet /> {/* children yerine Outlet ile alt route'lar gösterilir */}
      </main>
      <footer className="bg-gray-200 text-center py-4 text-sm text-gray-600">
        © 2025 Dokusan Teknik Admin Panel. Tüm hakları saklıdır.
      </footer>
    </div>
  );
};

export default AdminLayout;
