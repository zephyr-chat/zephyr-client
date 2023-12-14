import React, { useState, useEffect } from "react";
import { proxyUrl } from "./Config";
import "./App.css";

const ConversationList = ({ onSelectConversation, showCreateConvoScreen }) => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    fetch(proxyUrl + "/conversation", {
      method: "GET", // or 'POST', 'PUT', etc., depending on your API
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setConversations(data.conversations))
      .catch((error) => console.error("Error fetching conversations:", error));
  }, []);

  const showCreateConversationScreen = () => {
    showCreateConvoScreen(true)
  }

  return (
    <div>
      <div className ="conv-list">
      <h2 style = {{textAlign: 'center'}}>Conversations</h2>
      <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center' }}>
      <li key="create" style={{ marginBottom: '10px' }}>
      <button className="btn btn-primary" onClick={showCreateConversationScreen}>Create New Chat</button>
        </li>
      
      {conversations.map((conversation) => (
        <li key={conversation.id} style={{ marginBottom: '10px' }}>
          <button className="btn btn-dark" onClick={() => onSelectConversation(conversation)}>
            {conversation.name}
          </button>
        </li>
      ))}
    </ul>
    </div>
    </div>
    
  );
};

export default ConversationList;
