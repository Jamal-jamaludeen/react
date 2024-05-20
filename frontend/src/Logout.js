import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout(); 
        navigate('/login');
      } catch (error) {
        console.error('Logout failed:', error.message); 
      }
    };

    handleLogout();

    return () => {
    };
  }, [logout, navigate]);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;


// import React, { useContext, useEffect } from 'react';
// import { AuthContext } from './AuthContext';
// import { useNavigate } from 'react-router-dom';

// const Logout = () => {
//   const { setToken } = useContext(AuthContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setToken(null); 
//     localStorage.removeItem('token'); 
//     navigate('/login');
//   }, []);

//   return <div>Logging out...</div>;
// };

// export default Logout;