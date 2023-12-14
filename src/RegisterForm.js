import React, { useState } from 'react';
import './Register.css'; // Import the CSS file

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call to register the user
    fetch('http://localhost:5001/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
        displayname: displayName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Registration response:', data); // Log the response from the API
        // Handle response as needed (e.g., update state or show a success message)
      })
      .catch((error) => {
        console.error('Error registering user:', error);
        // Handle error scenario
      });
  };

  return (
    <div className="App">
      <div className="Auth-form-container">
        <div className="Auth-form">
          <div className="Auth-form-content">
            <h2 className="Auth-form-title">Register</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Display Name:</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
