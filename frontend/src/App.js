// src/App.js
import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";

import Signup from "./components/Signup";
import Login from "./components/Login";
import PlanFinder from "./components/PlanFinder";
import ResetPassword from "./components/ResetPassword";
import Account from "./components/Account";
import About from "./components/About";
import Contact from "./components/Contact";
import ThankYou from "./components/ThankYou";
import { handleLogout } from "./components/helper";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Restore session on first mount
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Persist whenever a child logs in/updates the user
  const setUserAndPersist = (u) => {
    setUser(u);
    if (u) localStorage.setItem("user", JSON.stringify(u));
    else localStorage.removeItem("user");
  };

  const logoutAndRedirect = () => {
    handleLogout(setUserAndPersist); // keeps your existing helper
    localStorage.removeItem("user"); // extra safety
    navigate("/");
  };

  // Hide nav on the login page
  const hideNav = location.pathname === "/";

  return (
    <div className="App">
      {!hideNav && (
        <nav className="app-nav">
          <Link to="/about">About</Link> | <Link to="/contact">Contact</Link>
          {user && (
            <>
              {" "} | <Link to="/account">Account</Link>
              {" "} |{" "}
              <button onClick={logoutAndRedirect} className="logout-btn">
                Logout
              </button>
            </>
          )}
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Login setUser={setUserAndPersist} />} />
        <Route path="/signup" element={<Signup setUser={setUserAndPersist} />} />
        <Route path="/plans" element={<PlanFinder user={user} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/account" element={<Account user={user} setUser={setUserAndPersist} />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;

