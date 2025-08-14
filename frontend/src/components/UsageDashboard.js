import React, { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getBaseUrl } from "./helper";
import UsageModal from "./UsageModal";

function normalizeUsage(raw = []) {
  return (raw || []).map((u, i) => {
    const month =
      u.month ?? u.label ?? u.period ?? u.date ?? u.reading_date ?? String(i + 1);
    const kwh = Number(u.kwh_used ?? u.usage ?? u.kwh ?? u.value ?? 0);
    return { month, kwh_used: isNaN(kwh) ? 0 : kwh };
  });
}

export default function UsageDashboard({ user, plans = [] }) {
  const [usageRows, setUsageRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [monthlyUsage, setMonthlyUsage] = useState(600);
  const [showUsage, setShowUsage] = useState(false);

  const baseRate = 0.35;

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(`${getBaseUrl()}/api/users/${user.id}/usage`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setUsageRows(normalizeUsage(data));
      } catch (e) {
        if (!cancelled) setErr("Failed to load usage.");
        console.error("usage fetch error:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  // Data for the modal (expects {month, usage})
  const modalUsage = useMemo(
    () => usageRows.map(r => ({ month: r.month, usage: r.kwh_used })),
    [usageRows]
  );

  const yearlyCost = (plan) => {
    const usageRate = Number(plan.usage_rate_cents ?? plan.usage_cents ?? 0) / 100;
    const supplyRate = Number(plan.supply_charge_cents ?? plan.supply_cents ?? 0) / 100;
    const mu = Number(monthlyUsage) || 0;
    const usageCost = mu * 12 * usageRate;
    const supplyCost = 365 * supplyRate;
    return (usageCost + supplyCost).toFixed(2);
  };

  const baseYear = useMemo(() => {
    const mu = Number(monthlyUsage) || 0;
    return (mu * 12 * baseRate).toFixed(2);
  }, [monthlyUsage]);

  return (
    <div>
      <h3>Your Monthly Usage</h3>

      {loading && <div>Loading usage…</div>}
      {err && <div className="error">{err}</div>}

      {usageRows.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={usageRows}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="kwh_used" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        !loading && <div>No usage data yet.</div>
      )}

      <div style={{ margin: "12px 0" }}>
        <button
          onClick={() => setShowUsage(true)}
          disabled={usageRows.length === 0}
          title={usageRows.length ? "View usage graph in modal" : "No usage data to show"}
        >
          View Usage Graph (Modal)
        </button>
      </div>

      <label>
        Enter monthly usage (kWh):{" "}
        <input
          type="number"
          value={monthlyUsage}
          onChange={(e) => setMonthlyUsage(Number(e.target.value) || 0)}
          min={0}
          step={1}
        />
      </label>

      <h3>Yearly Cost Comparison</h3>
      <ul>
        {plans.map((plan) => {
          const cost = yearlyCost(plan);
          const savings = (Number(baseYear) - Number(cost)).toFixed(2);
          return (
            <li key={plan._id || plan.id}>
              <strong>{plan.plan_name || plan.name}</strong>: ${cost}/yr — Savings: ${savings}
            </li>
          );
        })}
      </ul>

      {showUsage && (
        <UsageModal
          open
          onClose={() => setShowUsage(false)}
          usage={modalUsage}
        />
      )}
    </div>
  );
}
