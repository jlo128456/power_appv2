import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ThankYou() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000); // 5sec = 5000

    return () => clearTimeout(timer); // cleanup if unmounted early
  }, [navigate]);

  return (
    <div>
      <h2>Thank You!</h2>
      <p>A consultant will be in touch shortly about your selected energy plan.</p>
      <p>You will be redirected to the login page in 1 minute...</p>
    </div>
  );
}

export default ThankYou;
