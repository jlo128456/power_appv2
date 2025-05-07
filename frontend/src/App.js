import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import PlanFinder from "./components/PlanFinder";
import ResetPassword from "./components/ResetPassword";

function App() {
  const [user, setUser] = useState(null); // holds the logged-in user

  return (
    <div className="App">
      {user && (
        <nav>
          <Link to="/plans">Find Plans</Link> |{" "}
          <Link to="/reset-password">Reset Password</Link>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/plans" element={<PlanFinder />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;

