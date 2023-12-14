import React, { useState } from "react";
import "./Register.css";
import proxyUrl from "./Config";

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call to register the user
    fetch(proxyUrl + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        displayname: displayName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Registration response:", data);
        setMessage("Registration successful. Go back to login!")
      })
      .catch((error) => {
        console.error("Error registering user:", error);
        setMessage("Error registering user!")
      });
  };

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleSubmit}>
        <div className="Auth-form-content">
          <h2 className="Auth-form-title">Register</h2>

          <div className="form-group mt-3">
            <label>Username:</label>
            <input
              type="text"
              className="form-control mt-1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label>Password:</label>
            <input
              type="password"
              className="form-control mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label>Display Name:</label>
            <input
              type="text"
              className="form-control mt-1"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
          <p>{message}</p>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <button type="button" className="btn btn-secondary mt-2" onClick={onRegister}>
              Go Back
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
