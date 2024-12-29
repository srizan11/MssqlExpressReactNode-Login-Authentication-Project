import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tmsLogo from './assets/tms-logo1.jpg';
import api from './api'; // Import the Axios instance

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Make an authenticated request to a protected endpoint
    api.get('/home')
      .then(res => {
        // Do something with the user data if needed
      })
      .catch(err => {
        console.error('Error fetching protected data:', err);
        navigate('/'); // Redirect to the login page if unauthorized
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // Make a request to the backend logout endpoint
      await api.post('/logout');
      // Clear the JWT token from localStorage
      localStorage.removeItem('token');
      // Redirect to the login page
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('An error occurred during logout. Please try again.');
    }
  };

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center vh-100 vw-100" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="col-sm-8 col-md-6 col-lg-4 d-flex justify-content-center align-items-center" >
        <img src={tmsLogo} alt="TMS" style={{ width: '50%', height: '80%' }} />
      </div>
      <h1>You are logged in!</h1>
      <button type="button" className="btn btn-danger" onClick={handleLogout}>
        <strong>Log Out</strong>
      </button>
    </div>
  );
}

export default Home;
