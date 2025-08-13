import { useEffect, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import usePlans from "../hooks/usePlans";

function derivePostcode(searchParams, location, user) {
  return (
    searchParams.get("postcode") ||
    location.state?.postcode ||
    user?.postcode ||
    ""
  );
}

export default function PlanFinder({ user: userProp }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Prefer user from location.state, then prop
  const user = useMemo(
    () => location.state?.user ?? userProp ?? null,
    [location.state, userProp]
  );

  const postcode = useMemo(
    () => derivePostcode(searchParams, location, user),
    [searchParams, location, user]
  );

  const initialUsage = location.state?.usageHistory || null;

  const { plans, usageHistory, loading, error, fetchPlans, canRetry } =
    usePlans(initialUsage);

  useEffect(() => {
    if (postcode) fetchPlans(postcode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postcode]);

  const handleRetry = () => {
    if (postcode && canRetry(postcode)) fetchPlans(postcode);
  };

  return (
    <div>
      <h2>Energy Plans for Postcode {postcode || "—"}</h2>

      {error && (
        <div role="alert" style={{ marginBottom: 12 }}>{error}</div>
      )}
      {loading && <div>Loading plans…</div>}

      {!loading && !error && !postcode && <div>Enter a postcode to begin.</div>}
      {!loading && !error && postcode && plans.length === 0 && (
        <div>No plans found for {postcode}.</div>
      )}

      <div style={{ margin: "8px 0" }}>
        <button onClick={handleRetry} disabled={!postcode || loading}>
          Find Plans
        </button>
      </div>

      {/* Replace below with your charts/cards */}
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify({ user, postcode, usageHistory, plans }, null, 2)}
      </pre>
    </div>
  );
}
