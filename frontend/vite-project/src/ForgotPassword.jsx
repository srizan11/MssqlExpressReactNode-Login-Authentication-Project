import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import tmsLogo from './assets/tms-logo1.jpg';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    axios.post('http://localhost:1430/forgot-password', { email })
      .then(res => {
        console.log(res);
        setMessage(res.data.message);
      })
      .catch(err => {
        console.log(err);
        setMessage('An error occurred. Please try again.');
      });
  }

  return (
    <div>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit', marginBottom: '20px', display: 'block', textAlign: 'center' }}>
        <button type="button" className="btn btn-link"><strong>Login</strong></button>
      </Link>
      <div className="container-fluid d-flex flex-column justify-content-center align-items-center vh-100 vw-100" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="col-sm-8 col-md-6 col-lg-4 d-flex justify-content-center align-items-center">
          <img src={tmsLogo} alt="TMS" style={{ width: '50%', height: '80%' }} />
        </div>
        <div className="col-sm-8 col-md-6 col-lg-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label"><strong>Email</strong></label>
              <input
                type="email"
                placeholder="Enter Email"
                className="form-control"
                id="email"
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100"><strong>Reset Password</strong></button>
          </form>
          {message && <p className="mt-3">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
