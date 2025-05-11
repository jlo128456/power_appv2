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
        <nav style={{ padding: "10px", backgroundColor: "#f5f5f5", borderBottom: "1px solid #ccc" }}>
          {user ? (
            <>
              <Link to="/account">Account</Link> |{" "}
              <Link to={`/plans?postcode=${user.postcode}`}>Find Plans</Link> |{" "}
              <Link to="/about">About</Link> |{" "}
              <Link to="/contact">Contact</Link> |{" "}
              <button
                onClick={logoutAndRedirect}
                style={{ border: "none", background: "none", cursor: "pointer", color: "blue" }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/">Login</Link> |{" "}
              <Link to="/about">About</Link> |{" "}
              <Link to="/contact">Contact</Link>
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
