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
          <Link to="/about">About</Link> | <Link to="/contact">Contact</Link>
          {user && (
            <>
              {" "}|{" "}
              <button onClick={logoutAndRedirect} className="logout-btn">
                Logout
              </button>
            </>
          )}
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/plans" element={<PlanFinder user={user} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/account" element={<Account user={user} setUser={setUser} />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
