import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Signup from "./components/Signup";
import PlanFinder from "./components/PlanFinder";
import Home from "./components/Home";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      {/* Optional Nav */}
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/signup">Signup</Link> |{" "}
        <Link to="/plans">Find Plans</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/plans" element={<PlanFinder />} />
      </Routes>
    </div>
  );
}

export default App;
