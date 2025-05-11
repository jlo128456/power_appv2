import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getBaseUrl } from "./helper";

function UsageDashboard({ user, plans }) {
  const [usageHistory, setUsageHistory] = useState([]);
  const [monthlyUsage, setMonthlyUsage] = useState(600);
  const baseRate = 0.35;

  useEffect(() => {
    fetch(`${getBaseUrl()}/api/users/${user.id}/usage`)
      .then(res => res.json())
      .then(setUsageHistory)
      .catch(console.error);
  }, [user]);

  const yearlyCost = (plan) => {
    const usageCost = monthlyUsage * 12 * (plan.usage_rate_cents / 100);
    const supplyCost = 365 * (plan.supply_charge_cents / 100);
    return (usageCost + supplyCost).toFixed(2);
  };

  const baseYear = (monthlyUsage * 12 * baseRate).toFixed(2);

  return (
    <div>
      <h3>Your Monthly Usage</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={usageHistory}>
          <XAxis dataKey="month" /><YAxis /><Tooltip />
          <Bar dataKey="kwh_used" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <label>
        Enter monthly usage (kWh):
        <input
          type="number"
          value={monthlyUsage}
          onChange={(e) => setMonthlyUsage(e.target.value)}
        />
      </label>

      <h3>Yearly Cost Comparison</h3>
      <ul>
        {plans.map(plan => {
          const cost = yearlyCost(plan);
          const savings = (baseYear - cost).toFixed(2);
          return (
            <li key={plan.id}>
              <strong>{plan.plan_name}</strong>: ${cost}/yr — Savings: ${savings}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default UsageDashboard;
