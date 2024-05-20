import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if(!username.trim()|| !password.trim()) {
      setError('*Enter username and password')
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/register', { username, password });
      if(response.data.message === 'Registered successfully' ){
          setError("Registration successful!"); 
          navigate("/login");
        } else {
        setError("Username already exists. Please choose a different username."); // Display error alert
      }
    } catch (error) {
      console.error('Error registering', error.response.data.message);
      setError(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value.trim())} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value.trim())} />
        </div>
        <button type="submit">Register</button>
        <Link to="/login">Login here!</Link>
      </form>
    </div>
  );
}

export default Register;