import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      navigate("/home");
    }
  }, [setToken, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      const token = response.data.token;

      const verifyResponse = await axios.get('http://localhost:5000/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (verifyResponse.data.valid) {
        setToken(token);
        localStorage.setItem("token", token);
        navigate("/home");
      } else {
        setError('Token Invalid');
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data.message : error.message);
      if (error.response && error.response.data && error.response.data.message === 'Invalid username') {
        setError('*Invalid username and password');
      } else {
        setError('*Invalid password');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
        <Link to="/register">Register here!</Link>
      </form>
    </div>
  );
};

export default Login;
