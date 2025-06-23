import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded); // 🔍 Gözlem için ekleyebilirsin
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setUser(null);
        } else {
          setUser({
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
            isAdmin: decoded.isAdmin || false
          });
        }
      } catch (err) {
        console.error("Geçersiz token:", err);
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      setUser(false);  // Token yoksa "false" atayarak yüklendiğini belirt
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password
      });

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.id,
          username: decoded.username,
          email: decoded.email,
          isAdmin: decoded.isAdmin || false
        });
        return { success: true };
      }
    } catch (error) {
      console.error("Giriş hatası:", error.response?.data?.error || error.message);
      return { success: false, message: error.response?.data?.error || "Giriş başarısız." };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateUser = (newData) => {
    setUser((prev) => ({
      ...prev,
      ...newData
    }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
