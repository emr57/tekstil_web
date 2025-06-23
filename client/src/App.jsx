import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import ProtectedRoute from "./context/ProtectedRoute";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import AdminProducts from "./pages/AdminProducts";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* ADMIN ROUTES - AdminLayout + Outlet ile */}
      {user?.isAdmin && (
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      )}
      {/* USER ROUTES - Layout + Outlet ile */}
      <Route path="/" element={<Layout />}>
        <Route index element={user?.isAdmin ? <Navigate to="/admin" replace /> : <Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <div className="min-h-screen w-screen bg-white text-blue-900 overflow-x-hidden">
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
