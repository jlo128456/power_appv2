import React, { useState, useEffect } from "react";

function Account({ user, setUser }) {
  const [formData, setFormData] = useState({
    email: user?.email || "",
    postcode: user?.postcode || ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        postcode: user.postcode
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        alert("Details updated.");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update user.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setUser(null);
        alert("Account deleted.");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete account.");
    }
  };

  if (!user) return <p>Please log in to view account details.</p>;

  return (
    <div>
      <h2>Account Details</h2>
      <form onSubmit={handleUpdate}>
        <label>Email:</label>
        <input name="email" value={formData.email} onChange={handleChange} required />
        <label>Postcode:</label>
        <input name="postcode" value={formData.postcode} onChange={handleChange} required />
        <button type="submit">Update</button>
      </form>
      <hr />
      <button onClick={handleDelete} style={{ color: "red" }}>
        Delete Account
      </button>
    </div>
  );
}

export default Account;
