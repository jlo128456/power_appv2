import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import PlanFinder from "./components/PlanFinder";
import ResetPassword from "./components/ResetPassword";
import Account from "./components/Account";
import About from "./components/About";
import Contact from "./components/Contact";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      {user && (
        <nav>
          <Link to="/account">Account</Link> |{" "}
          <Link to="/about">About</Link> |{" "}
          <Link to="/contact">Contact</Link>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/plans" element={<PlanFinder user={user} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/account" element={<Account user={user} setUser={setUser} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
