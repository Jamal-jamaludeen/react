import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { token, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) {
    return (<div>
      <h1>Hello world</h1>
      <button type="button" >Logout</button>
    </div>)
  }

  if (!token) {
    navigate('/login');
    return null; 
  }


  return (
    <div>
      <h1>Hello world</h1>
      <button type="button" >Logout</button>
    </div>
  );
}

export default Home;