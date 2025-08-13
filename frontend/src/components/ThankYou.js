import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ThankYou({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      navigate("/plans", { state: { user } }); // Pass user via location state
      window.scrollTo(0, 0);
    }, 5000);

    return () => clearTimeout(t);
  }, [navigate, user]);

  return (
    <div>
      <h2>Thank You!</h2>
      <p>
        A consultant will be in touch shortly about your selected energy plan.
      </p>
      <p>You will be redirected to the plans page in a few seconds...</p>
    </div>
  );
}

export default ThankYou;
