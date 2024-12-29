import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import tmsLogo from './assets/tms-logo1.jpg';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (!confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function handleSubmit(event) {
    event.preventDefault();
    if (validate()) {
      axios.post('http://localhost:1430/sign-up', { email, password })
        .then(res => {
          console.log(res);
          if (res.data.success) {
            alert('Sign-up successful! Please log in.');
            navigate('/');
          } else {
            alert('Sign-up failed. Please try again.');
          }
        })
        .catch(err => {
          console.log(err);
          alert('An error occurred. Please try again.');
        });
    }
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
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label"><strong>Confirm Password</strong></label>
              <input
                type="password"
                placeholder="Confirm Password"
                className="form-control"
                id="confirmPassword"
                onChange={e => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword}</p>}
            </div>
            <button type="submit" className="btn btn-primary w-100"><strong>Sign Up</strong></button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
