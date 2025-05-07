import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup({ setUser }) {
  const [formData, setFormData] = useState({ email: "", password: "", postcode: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setUser(data.user);
      navigate(`/plans?postcode=${data.user.postcode}`);
    } else {
      alert(data.error || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <input
        name="postcode"
        type="text"
        placeholder="Postcode"
        onChange={handleChange}
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default Signup;
