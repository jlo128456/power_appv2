// components/About.js
import React from "react";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>About This App</h2>
      <p>
        PowerAppV2 helps users find the best energy plans based on their postcode.
        It’s a React + Flask full-stack application built for learning and utility.
      </p>

      <button onClick={() => navigate("/plans")} style={{ marginTop: "1rem" }}>
        Back to Home
      </button>
    </div>
  );
}

export default About;
