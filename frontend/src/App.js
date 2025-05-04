import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import PlanFinder from "./components/PlanFinder";
import Home from "./components/Home";

function App() {
  const [user, setUser] = useState(null); // Holds logged-in user info (used in future features)

  return (
    <div className="App">
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/plans">Find Plans</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home setUser={setUser} />} />
        <Route path="/plans" element={<PlanFinder />} />
      </Routes>
    </div>
  );
}

export default App;

