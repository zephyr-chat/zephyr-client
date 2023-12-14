import React, { useState } from 'react';
import './CreateConversation.css'; // Import the CSS file

const CreateConversation = () => {
  const [conversationName, setConversationName] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState([]);

  const handleMemberAdd = () => {
    if (memberInput.trim() !== '') {
      setMembers([...members, memberInput.trim()]);
      setMemberInput('');
    }
  };

  const handleConversationSubmit = () => {
    // Prepare data to send to the API
    const data = {
      name: conversationName.trim(),
      member_ids: members,
    };

    // Send the data to the API endpoint
    fetch('http://localhost:5001/create_conversation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Conversation created:', data); // Log the response from the API
        // Handle response as needed (e.g., update state or show a success message)
      })
      .catch((error) => {
        console.error('Error creating conversation:', error);
        // Handle error scenario
      });
  };

  return (
    <div className="Create-conversation">
      <h2>Create Conversation</h2>
      <form onSubmit={handleConversationSubmit}>
        <div>
          <label>Conversation Name:</label>
          <input
            type="text"
            value={conversationName}
            onChange={(e) => setConversationName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Members:</label>
          <div>
            <input
              type="text"
              value={memberInput}
              onChange={(e) => setMemberInput(e.target.value)}
            />
            <button type="button" onClick={handleMemberAdd}>
              Add Member
            </button>
          </div>
          <div>
            {members.map((member, index) => (
              <span key={index}>{member}</span>
            ))}
          </div>
        </div>
        <button type="submit">Create Conversation</button>
      </form>
    </div>
  );
};

export default CreateConversation;
