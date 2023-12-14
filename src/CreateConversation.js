import React, { useState } from 'react';
import './CreateConversation.css'; // Import the CSS file
import proxyUrl from './Config';

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

    const accessToken = localStorage.getItem("accessToken");
    fetch(proxyUrl + '/conversation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Conversation created:', data);
        window.location.reload()
      })
      .catch((error) => {
        console.error('Error creating conversation:', error);
      });
  };

  return (
    <div className="Create-conversation">
      <h2>Create Conversation</h2>
      <form>
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
              <div key={index}>
                <span>{member}</span>
                <br/>
                </div>
            ))}
          </div>
        </div>
        <button type="button" onClick={handleConversationSubmit}>Create Conversation</button>
      </form>
    </div>
  );
};

export default CreateConversation;
