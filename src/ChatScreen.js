import React, { useEffect, useState } from "react";
import proxyUrl from "./Config";
import "./App.css";

const ChatScreen = ({ selectedConversation, newEvent }) => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [title, setTitle] = useState("Chat");

  useEffect(() => {
    setChatMessages([]);
    if (selectedConversation == null) {
      setTitle("Chat");
    } else {
      setTitle(selectedConversation.name);
      const accessToken = localStorage.getItem("accessToken");
      fetch(proxyUrl + "/conversation/" + selectedConversation.id + "/event", {
        method: "GET",
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
        .then((data) => {
          setChatMessages(data.events ? data.events : []);
        })
        .catch((error) => console.error("Error fetching events:", error));
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (newEvent) {
      setChatMessages((prevMessages) => [...prevMessages, newEvent]);
    }
  }, [newEvent]);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const accessToken = localStorage.getItem("accessToken");
      fetch(proxyUrl + "/conversation/" + selectedConversation.id + "/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
        body: JSON.stringify({ content: message }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          //setChatMessages((prevMessages) => [...prevMessages, data]);
          setMessage("");
        })
        .catch((error) => console.error("Error fetching events:", error));
    }
  };

  return (
    <div style={{ flex: 1, padding: "20px" }} className = "chat">
      <h2>{title}</h2>
      {selectedConversation ? (
        <>
          <div
            style={{
              border: "1px solid #ccc",
              height: "80%",
              overflowY: "auto",
              marginBottom: "10px",
            }}
          >
            {chatMessages.map((msg, index) => (
              <div key={index} style={{ backgroundColor: '#e6f7ff', padding: '8px', borderRadius: '8px', marginBottom: '8px'}}>
                <strong>{msg.userDisplayName}:</strong> {msg.content}
              </div>
            ))}
          </div>
          <div style={{ display: "flex" }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ flex: 1, marginRight: "10px", borderRadius: "15px", padding: "8px" }}
              placeholder="Type your message..."
            />
            <button className="btn btn-primary" onClick={handleSendMessage}>Send</button>
          </div>
        </>
      ) : (
        <p>Select a conversation to start chatting</p>
      )}
    </div>
  );
};

export default ChatScreen;
