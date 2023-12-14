import React, { useState } from 'react';
import proxyUrl from './Config';
import "bootstrap/dist/css/bootstrap.min.css"

const LoginPrompt = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('')

    // Perform HTTP POST request to your authentication endpoint
    try {
      const response = await fetch(proxyUrl + '/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const { access_token: accessToken } = await response.json();
        localStorage.setItem('accessToken', accessToken);
        onLogin();
      } else {
        console.error('Authentication failed');
        setErrorMessage('Authentication failure')
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setErrorMessage('Authentication error')
    }
  };

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleLogin}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Zephyr Chat Sign In</h3>
          <div className="form-group mt-3">
            <label>Username</label>
            <input
              type="text"
              className="form-control mt-1"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
        <p>{errorMessage}</p>
      </form>
    </div>
  );
};

export default LoginPrompt;
