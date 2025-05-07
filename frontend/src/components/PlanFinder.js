// src/components/PlanFinder.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function PlanFinder() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Extract postcode from query string
  const params = new URLSearchParams(location.search);
  const postcode = params.get("postcode");

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch(`/api/energy-plans-by-postcode/${postcode}`);
        const data = await res.json();
        if (res.ok) {
          setPlans(data);
        } else {
          setPlans([]);
          console.warn(data.error);
        }
      } catch (err) {
        console.error("Failed to fetch plans:", err);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    }

    if (postcode) {
      fetchPlans();
    }
  }, [postcode]);

  if (loading) return <p>Loading plans...</p>;

  return (
    <div>
      <h2>Energy Plans for Postcode {postcode}</h2>
      {plans.length === 0 ? (
        <p>No plans available.</p>
      ) : (
        <ul>
          {plans.map((plan) => (
            <li key={plan.id}>
              <strong>{plan.plan_name}</strong> - {plan.provider_name}<br />
              Usage: {plan.usage_rate_cents}¢/kWh<br />
              Supply: {plan.supply_charge_cents}¢/day<br />
              Solar Feed-in: {plan.solar_feed_in_cents}¢<br />
              Green Energy: {plan.green_energy_percent}%<br />
              <a href={plan.fact_sheet_url} target="_blank" rel="noopener noreferrer">Fact Sheet</a>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PlanFinder;

