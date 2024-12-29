import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import tmsLogo from './assets/tms-logo1.jpg';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(email)) newErrors.email = 'Invalid email format';

    if (!password) newErrors.password = 'Password is required';
    else if (!passwordRegex.test(password)) newErrors.password = 'Password must be at least 8 characters long and include letters and numbers';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function handleSubmit(event) {
    event.preventDefault();
    if (validate()) {
      axios.post('http://localhost:1430/login', { email, password })
        .then(res => {
          console.log(res);
          if (res.data.Login) {
            localStorage.setItem('token', res.data.token);
            navigate('/home');
          } else {
            alert('Invalid credentials');
          }
        })
        .catch(err => {
          console.log(err);
          alert('An error occurred. Please try again.');
        });
    }
  }

  return (
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
            {errors.email && <p className="text-danger">{errors.email}</p>}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label"><strong>Password</strong></label>
            <input
              type="password"
              placeholder="Enter Password"
              className="form-control"
              id="password"
              onChange={e => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-danger">{errors.password}</p>}
          </div>
          <button type="submit" className="btn btn-success w-100"><strong>Login</strong></button>
          <p className="d-flex flex-column justify-content-center align-items-center"></p>
          <Link to="/forgot-password" style={{ textDecoration: 'underline', color: 'blue' }}>
            <p className="d-flex flex-column justify-content-center align-items-center">Forgot Password?</p>
          </Link>
          <p className="d-flex flex-column justify-content-center align-items-center">OR</p>
          <p className="d-flex flex-column justify-content-center align-items-center">Don't have an account?</p>
          <Link to="/sign-up" style={{ textDecoration: 'none', color: 'inherit' }}>
            <button type="button" className="btn btn-primary w-100"><strong>Sign Up</strong></button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
