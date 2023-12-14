import React, { useState, useEffect } from "react";
import proxyUrl from "./Config";

const ConversationList = ({ onSelectConversation }) => {
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

  return (
    <div>
      <h2>Conversations</h2>
      <ul>
        {conversations.map((conversation) => (
          <li key={conversation.id}>
            <button onClick={() => onSelectConversation(conversation)}>
              {conversation.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationList;
