// Login.jsx
import React, { useState } from 'react';
import { auth } from '../components/Firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Sign in with Firebase Auth
      await signInWithEmailAndPassword(auth, username, password);
      onLogin(); // Call onLogin to update the parent component's state
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Login failed: ' + error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Email:</label>
          <input
            type="email"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button">Login</button>
      </form>
      <p className="auth-link">Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
};

export default Login;
