import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup({ setUser }) {
  const [formData, setFormData] = useState({
    email: "", password: "", postcode: "",
    usage_month: "2024-12", kwh_used: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email: formData.email,
      password: formData.password,
      postcode: formData.postcode,
      usage_history: {
        month: formData.usage_month,
        kwh_used: parseFloat(formData.kwh_used)
      }
    };
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        navigate(`/plans?postcode=${data.postcode}`);
      } else alert(data.error || "Signup failed");
    } catch (err) {
      console.error("Signup error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input name="email" type="email" placeholder="Email"
        value={formData.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password"
        value={formData.password} onChange={handleChange} required />
      <input name="postcode" type="text" placeholder="Postcode"
        value={formData.postcode} onChange={handleChange} required />
      <input name="usage_month" type="month"
        value={formData.usage_month} onChange={handleChange} required />
      <input name="kwh_used" type="number" placeholder="kWh used"
        value={formData.kwh_used} onChange={handleChange} required />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default Signup;
