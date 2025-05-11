import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { calculateYearlyCost, getBaseUrl } from "./helper";

const baseRate = 0.35;

function PlanFinder({ user }) {
  const [plans, setPlans] = useState([]);
  const [usageHistory, setUsageHistory] = useState([]);
  const [monthlyUsage, setMonthlyUsage] = useState("");
  const [solarExport, setSolarExport] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [loading, setLoading] = useState(true);
  const postcode = new URLSearchParams(useLocation().search).get("postcode");
  const navigate = useNavigate();
  const kwh = parseFloat(monthlyUsage) || 0;
  const solar = parseFloat(solarExport) || 0;
  const baseCost = (kwh * 12 * baseRate).toFixed(2);

  useEffect(() => {
    if (postcode)
      fetch(`${getBaseUrl()}/api/energy-plans-by-postcode/${postcode}`)
        .then(res => res.json()).then(setPlans)
        .catch(console.error).finally(() => setLoading(false));
  }, [postcode]);

  useEffect(() => {
    if (user)
      fetch(`${getBaseUrl()}/api/users/${user.id}/usage`)
        .then(res => res.json()).then(setUsageHistory)
        .catch(console.error);
  }, [user]);

  if (loading) return <p>Loading plans...</p>;

  return (
    <div>
      <h2>Energy Plans for Postcode {postcode}</h2>
      <label>Usage: <input type="number" value={monthlyUsage} onChange={e => setMonthlyUsage(e.target.value)} /></label>
      <label>Export: <input type="number" value={solarExport} onChange={e => setSolarExport(e.target.value)} /></label>

      {user && usageHistory.length > 0 && (
        <>
          <h3>Usage History</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={usageHistory} barSize={20}>
              <XAxis dataKey="month" /><YAxis /><Tooltip />
              <Bar dataKey="kwh_used" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      <h3>Plans & Estimates</h3>
      <ul>
        {plans.map(plan => {
          const cost = calculateYearlyCost(plan, kwh, solar);
          const savings = (baseCost - cost).toFixed(2);
          return (
            <li key={plan.id}>
              <input type="radio" name="plan" value={plan.id} checked={selectedPlanId === plan.id} onChange={() => setSelectedPlanId(plan.id)} />
              <strong>{plan.plan_name}</strong> - {plan.provider_name}<br />
              {plan.usage_rate_cents}¢/kWh — {plan.supply_charge_cents}¢/day<br />
              {plan.solar_feed_in_cents > 0 && <>Feed-in: {plan.solar_feed_in_cents}¢/kWh<br /></>}
              Yearly Cost: ${cost}{monthlyUsage && <> — Savings: ${savings}</>}<br />
              <a href={plan.fact_sheet_url} target="_blank" rel="noreferrer">Fact Sheet</a>
              <hr />
            </li>
          );
        })}
      </ul>

      {selectedPlanId && <button onClick={() => navigate("/thank-you")}>Confirm Plan</button>}
    </div>
  );
}

export default PlanFinder;
