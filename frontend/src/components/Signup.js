import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email, // backend expects "username"
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        navigate(`/plans?postcode=${data.user.postcode}`);
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Error during signup:", err);
      alert("Something went wrong. Try again later.");
    }

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
