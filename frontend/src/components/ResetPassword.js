// src/components/ResetPassword.js
import React, { useState } from "react";

function ResetPassword() {
  const [email, setEmail] = useState(""); //resetpassword function

  const handleReset = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    alert(`Reset link sent to ${email}`);
    setEmail("");
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <div className="form-group">
          <label htmlFor="resetEmail">Email:</label>
          <input
            id="resetEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
}

export default ResetPassword;
