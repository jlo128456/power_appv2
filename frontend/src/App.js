import { useState } from "react";
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

function PlansWrapper({ fallbackUser }) {
  const location = useLocation();
  const mergedUser = location.state?.user ?? fallbackUser ?? null;
  return <PlanFinder user={mergedUser} />;
}

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const hideNav = ["/", "/thank-you"].includes(location.pathname);

  const logoutAndRedirect = () => {
    handleLogout(setUser);
    navigate("/");
  };

  return (
    <div className="App">
      {!hideNav && (
        <nav className="app-nav">
          {user ? (
            <>
              <Link to="/account">Account</Link> |{" "}
              <Link to={`/plans${user.postcode ? `?postcode=${encodeURIComponent(user.postcode)}` : ""}`}>
                Find Plans
              </Link>{" "}
              | <Link to="/about">About</Link> | <Link to="/contact">Contact</Link> |{" "}
              <button onClick={logoutAndRedirect} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/">Login</Link> | <Link to="/about">About</Link> | <Link to="/contact">Contact</Link>
            </>
          )}
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        {/* Wrapper lets /thank-you → /plans carry user via location.state OR fallback to context */}
        <Route path="/plans" element={<PlansWrapper fallbackUser={user} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/account" element={<Account user={user} setUser={setUser} />} />
        {/* Pass user so ThankYou can forward it during redirect */}
        <Route path="/thank-you" element={<ThankYou user={user} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
