import './App.css';
import React, { useState, useEffect } from 'react';
import LoginPrompt from './Login';
import ConversationList from './ConversationList';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setIsLoggedIn(true)
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <div>
          <p>Hello, User!</p>
          <button onClick={handleLogout}>Logout</button>
          <ConversationList onSelectConversation={handleSelectConversation} />
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
