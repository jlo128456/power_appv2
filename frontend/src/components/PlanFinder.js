import { useEffect, useMemo } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import usePlans from "../hooks/usePlans";

const derivePostcode = (sp, loc, user) =>
  sp.get("postcode") || loc.state?.postcode || user?.postcode || "";

export default function PlanFinder({ user: userProp }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const user = useMemo(
    () => location.state?.user ?? userProp ?? null,
    [location.state, userProp]
  );
  const postcode = useMemo(
    () => derivePostcode(searchParams, location, user),
    [searchParams, location, user]
  );
  const initialUsage = location.state?.usageHistory || null;

  const {
    plans, usageHistory, loading, error, fetchPlans,
    selectedId, select, selectedPlan,
  } = usePlans(initialUsage);

  useEffect(() => { if (postcode) fetchPlans(postcode); }, [postcode, fetchPlans]);

  const onConfirm = () =>
    selectedPlan &&
    navigate("/thank-you", { state: { user, postcode, usageHistory, plan: selectedPlan } });

  return (
    <div className="plan-finder">
      <h2>Energy Plans for Postcode {postcode || "—"}</h2>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading plans…</div>}

      {usageHistory?.length > 0 && (
        <div className="usage-history">
          <h3>Usage History</h3>
          <ul>
            {usageHistory.map((e, i) => (
              <li key={i}>{e.month} – {e.usage} kWh</li>
            ))}
          </ul>
        </div>
      )}

      {!loading && !error && plans?.length > 0 && (
        <div className="plan-grid">
          {plans.map((p) => (
            <div
              key={p._id}
              className={`plan-card ${selectedId === p._id ? "selected" : ""}`}
              onClick={() => select(p._id)}
            >
              <label className="plan-label">
                <input
                  type="radio"
                  name="selectedPlan"
                  checked={selectedId === p._id}
                  onChange={() => select(p._id)}
                />
                <h3>{p.plan_name || p.name || "Plan"} — {p.provider_name || p.provider || ""}</h3>
              </label>
              <p className="plan-details">
                Supply: {p.supply_charge_cents ?? p.supply_cents ?? "—"}¢/day<br/>
                Usage: {p.usage_rate_cents ?? p.usage_cents ?? "—"}¢/kWh<br/>
                Solar FiT: {p.solar_feed_in_cents ?? "—"}¢/kWh<br/>
                Contract: {p.contract_length_months ?? "—"} months<br/>
                Green: {p.green_energy_percent ?? "—"}%
              </p>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && !postcode && <div className="no-postcode">Enter a postcode to begin.</div>}
      {!loading && !error && postcode && plans?.length === 0 && (
        <div className="no-plans">No plans found for {postcode}.</div>
      )}

      <div className="plan-actions">
        <button onClick={onConfirm} disabled={!selectedPlan}>Confirm</button>
      </div>
    </div>
  );
}
