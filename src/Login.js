import React, { useState } from 'react';
import proxyUrl from './Config';

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
    <div>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Login</button>
        <br/>
        <p>{errorMessage}</p>
      </form>
    </div>
  );
};

export default LoginPrompt;
