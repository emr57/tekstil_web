import { jwtDecode } from "jwt-decode";

export const getDecodedToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (err) {
    console.error("Token çözümleme hatası:", err);
    return null;
  }
};

export const getUserId = () => {
  const decoded = getDecodedToken();
  return decoded ? decoded.id : null;
};

export const isAuthenticated = () => {
  return !!getDecodedToken();
};
