import './App.css';
import React, { useState } from 'react';
import LoginPrompt from './Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <div>
          <p>Hello, User!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <LoginPrompt onLogin={handleLogin} />
        </div>
      )}
    </div>
  );
}

export default App;
