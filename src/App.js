import "./App.css";
import React, { useState, useEffect } from "react";
import LoginPrompt from "./Login";
import ConversationList from "./ConversationList";
import ChatScreen from "./ChatScreen";
import socketIOClient from "socket.io-client";
import proxyUrl from "./Config";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [webSocket, setWebSocket] = useState(null);

  const [newEvent, setNewEvent] = useState(null);

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

  return (
    <div className="App">
      {isLoggedIn ? (
        <div>
          <p>Hello</p>
          <button onClick={handleLogout}>Logout</button>
          <div style={{ display: "flex" }}>
            <ConversationList onSelectConversation={handleSelectConversation} />
            <ChatScreen
              selectedConversation={selectedConversation}
              newEvent={newEvent}
            />
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
