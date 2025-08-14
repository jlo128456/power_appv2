import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ThankYou({ user }) {
  const navigate = useNavigate();
  const { state } = useLocation(); // contains { plan, ... }

  useEffect(() => {
    const planName = state?.plan?.plan_name || state?.plan?.name || "your plan";
    const t = setTimeout(() => {
      navigate("/plans", { replace: true, state: { user, congrats: planName } });
      window.scrollTo(0, 0);
    }, 5000);
    return () => clearTimeout(t);
  }, [navigate, state, user]);

  return (
    <div>
      <h2>Thank You!</h2>
      <p>A consultant will be in touch shortly about your selected energy plan.</p>
      <p>You will be redirected to the plans page in a few seconds...</p>
    </div>
  );
}
