import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const { token } = useParams();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

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
      axios.post('http://localhost:1430/reset-password', { token, password })
        .then(res => {
          console.log(res);
          setMessage(res.data.message);
          navigate('/');
        })
        .catch(err => {
          console.log(err);
          setMessage('An error occurred. Please try again.');
        });
    }
  }

  return (
    <div>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit', marginBottom: '20px', display: 'block', textAlign: 'center' }}>
        <button type="button" className="btn btn-link"><strong>Login</strong></button>
      </Link>
      <div className="container-fluid d-flex flex-column justify-content-center align-items-center vh-100 vw-100" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="col-sm-8 col-md-6 col-lg-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="password" className="form-label"><strong>New Password</strong></label>
              <input
                type="password"
                placeholder="Enter New Password"
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
            <button type="submit" className="btn btn-primary w-100"><strong>Reset Password</strong></button>
          </form>
          {message && <p className="mt-3">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
