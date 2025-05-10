import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { calculateYearlyCost } from "./helper";

const baseRate = 0.35;

function PlanFinder({ user }) {
  const [plans, setPlans] = useState([]);
  const [usageHistory, setUsageHistory] = useState([]);
  const [monthlyUsage, setMonthlyUsage] = useState(600);
  const [loading, setLoading] = useState(true);
  const postcode = new URLSearchParams(useLocation().search).get("postcode");

  useEffect(() => {
    if (!postcode) return;
    fetch(`/api/energy-plans-by-postcode/${postcode}`)
      .then(res => res.json())
      .then(data => setPlans(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postcode]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/users/${user.id}/usage`)
      .then(res => res.json())
      .then(setUsageHistory)
      .catch(console.error);
  }, [user]);

  if (loading) return <p>Loading plans...</p>;

  const baseCost = (monthlyUsage * 12 * baseRate).toFixed(2);

  return (
    <div>
      <h2>Energy Plans for Postcode {postcode}</h2>

      <label>
        Enter your monthly kWh usage:
        <input
          type="number"
          value={monthlyUsage}
          onChange={(e) => setMonthlyUsage(Number(e.target.value))}
          style={{ marginLeft: "10px", padding: "4px" }}
        />
      </label>

      {user && usageHistory.length > 0 && (
        <>
          <h3>Your Usage History</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usageHistory}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="kwh_used" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      <h3>Plans and Yearly Estimates</h3>
      <ul>
        {plans.map((plan) => {
          const cost = calculateYearlyCost(plan, monthlyUsage);
          const savings = (baseCost - cost).toFixed(2);
          return (
            <li key={plan.id}>
              <strong>{plan.plan_name}</strong> - {plan.provider_name}<br />
              Usage: {plan.usage_rate_cents}¢/kWh — Supply: {plan.supply_charge_cents}¢/day<br />
              {plan.solar_feed_in_cents > 0 && (
               <>Solar Feed-in Tariff: {plan.solar_feed_in_cents}¢/kWh<br /></>
              )}
              Yearly Cost: ${cost}
              {monthlyUsage > 0 && <> — Savings: ${savings}</>}<br />
              <a href={plan.fact_sheet_url} target="_blank" rel="noopener noreferrer">Fact Sheet</a>
              <hr />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PlanFinder;

