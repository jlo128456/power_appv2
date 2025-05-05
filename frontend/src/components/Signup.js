// src/components/Signup.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Signup({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setUser({ email });
    setEmail("");
    setPassword("");
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Sign Up</button>

        <p style={{ marginTop: "10px" }}>
          <Link to="/reset-password" style={{ color: "#0077cc", textDecoration: "none" }}>
            Forgot Password?
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;

