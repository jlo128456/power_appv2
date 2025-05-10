import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup({ setUser }) {
  const [formData, setFormData] = useState({
    email: "", password: "", postcode: ""
  });

  const [usageEntries, setUsageEntries] = useState([
    { month: "2024-12", kwh_used: "" }
  ]);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUsageChange = (index, field, value) => {
    const updated = [...usageEntries];
    updated[index][field] = value;
    setUsageEntries(updated);
  };

  const addUsageEntry = () =>
    setUsageEntries([...usageEntries, { month: "", kwh_used: "" }]);

  const removeUsageEntry = (index) =>
    setUsageEntries(usageEntries.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      usage_history: usageEntries.map(entry => ({
        month: entry.month,
        kwh_used: parseFloat(entry.kwh_used)
      }))
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
      } else {
        alert(data.error || "Signup failed");
      }
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

      <h3>Usage History</h3>
      {usageEntries.map((entry, index) => (
        <div key={index}>
          <input type="month" value={entry.month}
            onChange={(e) => handleUsageChange(index, "month", e.target.value)} required />
          <input type="number" placeholder="kWh"
            value={entry.kwh_used}
            onChange={(e) => handleUsageChange(index, "kwh_used", e.target.value)} required />
          {usageEntries.length > 1 && (
            <button type="button" onClick={() => removeUsageEntry(index)}>Remove</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addUsageEntry}>+ Add Usage Entry</button>

      <br /><br />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default Signup;
