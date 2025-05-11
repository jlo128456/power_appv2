import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBaseUrl } from "./helper";

function Signup({ setUser }) {
  const [formData, setFormData] = useState({ email: "", password: "", postcode: "" });
  const [usage, setUsage] = useState([{ month: "2024-12", kwh_used: "" }]);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const updateUsage = (i, key, val) => {
    const updated = [...usage];
    updated[i][key] = val;
    setUsage(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      usage_history: usage.map(({ month, kwh_used }) => ({
        month, kwh_used: parseFloat(kwh_used)
      }))
    };

    try {
      const res = await fetch(`${getBaseUrl()}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      res.ok ? (setUser(data), navigate(`/plans?postcode=${data.postcode}`)) : alert(data.error || "Signup failed");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      {["email", "password", "postcode"].map((field) => (
        <input
          key={field}
          name={field}
          type={field === "password" ? "password" : "text"}
          placeholder={field[0].toUpperCase() + field.slice(1)}
          value={formData[field]}
          onChange={handleChange}
          required
        />
      ))}

      <h3>Usage History</h3>
      {usage.map((u, i) => (
        <div key={i}>
          <input type="month" value={u.month} onChange={e => updateUsage(i, "month", e.target.value)} required />
          <input type="number" placeholder="kWh" value={u.kwh_used} onChange={e => updateUsage(i, "kwh_used", e.target.value)} required />
          {usage.length > 1 && <button type="button" onClick={() => setUsage(usage.filter((_, idx) => idx !== i))}>Remove</button>}
        </div>
      ))}
      <button type="button" onClick={() => setUsage([...usage, { month: "", kwh_used: "" }])}>+ Add Usage Entry</button>
      <br /><br />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default Signup;
