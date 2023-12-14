import "./App.css";
import React, { useState, useEffect } from "react";
import LoginPrompt from "./Login";
import ConversationList from "./ConversationList";
import ChatScreen from "./ChatScreen";
import socketIOClient from "socket.io-client";
import proxyUrl from "./Config";
import CreateConversation from "./CreateConversation";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [webSocket, setWebSocket] = useState(null);

  const [newEvent, setNewEvent] = useState(null);
  const [showCreateConvo, setShowCreateConvo] = useState(false);
  

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    if (webSocket) {
      webSocket.disconnect();
    }
    setIsLoggedIn(false);
  };

  const handleSelectConversation = (conversation) => {
    toggleCreateConvoScreen(false)
    setSelectedConversation(conversation);

    if (webSocket) {
      webSocket.disconnect();
    }

    if (conversation) {
      const accessToken = localStorage.getItem("accessToken");
      const newSocket = socketIOClient(proxyUrl, {
        extraHeaders: { Authorization: accessToken },
      });
      newSocket.on("connect", () => {
        console.log("Socket connected");
      });
      newSocket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
      newSocket.on("message", (event) => {
        setNewEvent(JSON.parse(event));
      });

      setWebSocket(newSocket);
    }
  };

  const toggleCreateConvoScreen = (value) => {
    setShowCreateConvo(value)
  }

  return (
    <div className="App">
      {isLoggedIn ? (
        <div>
          <button className="Logout-button btn btn-danger" onClick={handleLogout}>Logout</button>
          <div style={{ display: "flex" }}>
            <ConversationList onSelectConversation={handleSelectConversation} showCreateConvoScreen={toggleCreateConvoScreen} />
            {showCreateConvo ? (<CreateConversation />) : (<ChatScreen
              selectedConversation={selectedConversation}
              newEvent={newEvent}
            />)}
            
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
