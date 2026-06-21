import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("meshabek_user"));
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("meshabek_token")));

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("meshabek_token");
      if (!token) return setLoading(false);

      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
        localStorage.setItem("meshabek_user", JSON.stringify(data));
      } catch {
        localStorage.removeItem("meshabek_token");
        localStorage.removeItem("meshabek_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("meshabek_token", data.token);
    localStorage.setItem("meshabek_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("meshabek_token");
    localStorage.removeItem("meshabek_user");
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, logout, isAdmin: Boolean(user) }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
