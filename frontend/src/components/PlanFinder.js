import { useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import usePlans from "../hooks/usePlans";
import UsageModal from "./UsageModal";
import { getBaseUrl, normalizeUsage } from "./helper";

const derivePc = (sp, loc, u) => sp.get("postcode") || loc.state?.postcode || u?.postcode || "";

export default function PlanFinder({ user: userProp }) {
  const loc = useLocation(), nav = useNavigate(), [sp] = useSearchParams();
  const [showUsage, setShowUsage] = useState(false), [mu, setMu] = useState(600), [se, setSe] = useState(0);
  const user = useMemo(() => loc.state?.user ?? userProp ?? null, [loc.state, userProp]);
  const postcode = useMemo(() => derivePc(sp, loc, user), [sp, loc, user]);
  const initUsage = loc.state?.usageHistory || [];
  const congrats = loc.state?.congrats;

  const { plans, usageHistory, loading, error, fetchPlans, selectedId, select, selectedPlan } = usePlans(initUsage);
  const [dbUsage, setDbUsage] = useState([]);

  useEffect(() => { if (!congrats && postcode) fetchPlans(postcode); }, [postcode, fetchPlans, congrats]);
  useEffect(() => {
    if (congrats || !user?.id) return; let off = false;
    (async () => {
      try {
        const r = await fetch(`${getBaseUrl()}/api/users/${user.id}/usage`);
        if (!off) setDbUsage(normalizeUsage(r.ok ? await r.json() : []));
      } catch { if (!off) setDbUsage([]); }
    })();
    return () => { off = true; };
  }, [user?.id, congrats]);

  const usageData = useMemo(() => {
    const a = dbUsage.length ? dbUsage : normalizeUsage(usageHistory || []);
    return a.length ? a : normalizeUsage(initUsage || []);
  }, [dbUsage, usageHistory, initUsage]);

  const canShowUsage = usageData.length > 0;
  const baseYear = useMemo(() => mu * 12 * 0.35, [mu]);
  const estYear = (p) => {
    const u = (p.usage_rate_cents ?? p.usage_cents ?? 0) / 100;
    const s = (p.supply_charge_cents ?? p.supply_cents ?? 0) / 100;
    const fit = (p.solar_feed_in_cents ?? 0) / 100;
    return mu * 12 * u + 365 * s - se * 12 * fit;
  };
  const onConfirm = () => selectedPlan && nav("/thank-you", { state: { user, postcode, usageHistory, plan: selectedPlan } });

  return (
    <div className="plan-finder">
      {congrats ? (
        <div style={{textAlign:"center",padding:"2rem"}}>
          <h2>Congratulations for choosing {congrats}! </h2>
          <p>Let the saving begin.</p>
        </div>
      ) : (
        <>
          <h2>Energy Plans for Postcode {postcode || "—"}</h2>
          {error && <div className="error">{error}</div>}
          {loading && <div className="loading">Loading plans…</div>}

          <div className="controls">
            <label>Monthly (kWh):<input type="number" min={0} value={mu} onChange={e=>setMu(+e.target.value||0)} /></label>
            <label>Solar export (kWh/mo):<input type="number" min={0} value={se} onChange={e=>setSe(+e.target.value||0)} /></label>
            <button onClick={()=>setShowUsage(true)} disabled={!canShowUsage}>View Usage Graph</button>
          </div>

          {!loading && !error && plans?.length > 0 && (
            <div className="plan-grid">
              {plans.map(p => {
                const cost = estYear(p), savings = baseYear - cost;
                return (
                  <div key={p._id} className={`plan-card ${selectedId === p._id ? "selected" : ""}`} onClick={()=>select(p._id)}>
                    <label className="plan-label">
                      <input type="radio" name="selectedPlan" checked={selectedId === p._id} onChange={()=>select(p._id)} />
                      <h3>{p.plan_name || p.name || "Plan"} — {p.provider_name || p.provider || ""}</h3>
                    </label>
                    <p className="plan-details">
                      Supply: {p.supply_charge_cents ?? p.supply_cents ?? "—"}¢/day •
                      Usage: {p.usage_rate_cents ?? p.usage_cents ?? "—"}¢/kWh •
                      FiT: {p.solar_feed_in_cents ?? "—"}¢/kWh<br/>
                      Est: ${cost.toFixed(2)}/yr — Savings: ${savings.toFixed(2)}/yr<br/>
                      Contract: {p.contract_length_months ?? "—"} mo • Green: {p.green_energy_percent ?? "—"}%
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && !error && !postcode && <div className="no-postcode">Enter a postcode to begin.</div>}
          {!loading && !error && postcode && plans?.length === 0 && <div className="no-plans">No plans found for {postcode}.</div>}

          <div className="plan-actions"><button onClick={onConfirm} disabled={!selectedPlan}>Confirm</button></div>
          {showUsage && <UsageModal open onClose={()=>setShowUsage(false)} usage={usageData} />}
        </>
      )}
    </div>
  );
}
