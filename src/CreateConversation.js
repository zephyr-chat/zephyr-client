import React, { useState } from "react";
import "./CreateConversation.css"; // Import the CSS file
import proxyUrl from "./Config";

const CreateConversation = () => {
  const [conversationName, setConversationName] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState([]);

  const handleMemberAdd = () => {
    if (memberInput.trim() !== "") {
      setMembers([...members, memberInput.trim()]);
      setMemberInput("");
    }
  };

  const handleConversationSubmit = () => {
    // Prepare data to send to the API
    const data = {
      name: conversationName.trim(),
      member_ids: members,
    };

    const accessToken = localStorage.getItem("accessToken");
    fetch(proxyUrl + "/conversation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Conversation created:", data);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error creating conversation:", error);
      });
  };

  return (
    <div style={{ flex: 1, padding: "20px" }} className="chat">
      <div className="Create-conversation">
        <form className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Create Conversation</h3>
            <div className="form-group mt-3">
              <label>Conversation Name:</label>
              <input
                type="text"
                className="form-control mt-1"
                value={conversationName}
                onChange={(e) => setConversationName(e.target.value)}
                required
              />
            </div>
            <div className="form-group mt-3">
              <label>Members:</label>
              <div>
                <input
                  type="text"
                  className="form-control mt-1"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-primary mt-2"
                  onClick={handleMemberAdd}
                >
                  Add Member
                </button>
              </div>
              <div>
                {members.map((member, index) => (
                  <div key={index}>
                    <span>{member}</span>
                    <br />
                  </div>
                ))}
              </div>
            </div>
            <div className="d-grid gap-2 mt-3">
              <button
                type="button"
                className="btn btn-primary mt-2"
                onClick={handleConversationSubmit}
              >
                Create Conversation
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateConversation;
