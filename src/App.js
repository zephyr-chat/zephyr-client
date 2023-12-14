import "./App.css";
import React, { useState, useEffect } from "react";
import LoginPrompt from "./Login";
import ConversationList from "./ConversationList";
import ChatScreen from "./ChatScreen";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (selectedConversation != null) {
      console.log("Selected conversation changed:", selectedConversation);
    }
  }, [selectedConversation]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
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
          <div style={{ display: "flex" }}>
            <ConversationList onSelectConversation={handleSelectConversation} />
            <ChatScreen selectedConversation={selectedConversation} />
          </div>
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
