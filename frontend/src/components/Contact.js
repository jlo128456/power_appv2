// components/Contact.js
import React from "react";
import { useNavigate } from "react-router-dom";

function Contact() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Contact Us</h2>
      <p>Email: support@powerappv2.com</p>
      <p>Phone: +61 400 123 456</p>

      <button onClick={() => navigate("/plans")} style={{ marginTop: "1rem" }}>
        Back to Home
      </button>
    </div>
  );
}

export default Contact;

