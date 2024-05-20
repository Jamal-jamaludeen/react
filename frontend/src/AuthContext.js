import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const verifyToken = async (token) => {
      try {
        const verifyResponse = await axios.get('http://localhost:5000/verify', {
          headers: {Authorization: `Bearer ${token}`}
        });
        return verifyResponse.data.valid;
      } catch (error) {
        console.error('Token verification error:', error);
        return false;
      }
    };

    if (storedToken) {
      verifyToken(storedToken)
        .then(valid => {
          if (valid) {
            setToken(storedToken);
          } else {
            localStorage.removeItem("token");
            setLoading(false);
          }
        })
        .catch(error => {
          console.error('Token verification error:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
