import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const tryParse = (str, fallback = null) => {
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  };

  const [user, setUser] = useState(() =>
    tryParse(localStorage.getItem("user")),
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // NEW: trigger to refresh profile data
  const [profileUpdated, setProfileUpdated] = useState(0);
  const markProfileUpdated = () => setProfileUpdated((prev) => prev + 1);

  // LOGOUT
  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  // AUTO LOGOUT WHEN TOKEN EXPIRES
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = token.split(".")[1];
      if (!payload) throw new Error("Invalid token");

      const decoded = JSON.parse(atob(payload));
      const expiry = decoded.exp * 1000;
      const now = Date.now();
      const delay = expiry - now;

      if (delay <= 0) {
        logOut();
        return;
      }

      const timer = setTimeout(() => logOut(), delay);
      return () => clearTimeout(timer);
    } catch (err) {
      logOut();
    }
  }, [user]);

  // LOGIN
  const logIn = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const res = await loginUser(data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);

      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // REGISTER
  const signUp = async (data) => {
    try {
      setLoading(true);
      setError(null);

      await registerUser(data);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setError,
        logIn,
        signUp,
        logOut,
        profileUpdated,
        markProfileUpdated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
