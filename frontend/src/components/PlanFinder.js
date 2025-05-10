// src/components/PlanFinder.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchPlansByPostcode, renderPlanDetails } from "./helper";

function PlanFinder() {
  const [plans, setPlans] = useState([]);
  const [usage, setUsage] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const postcode = new URLSearchParams(location.search).get("postcode");

  useEffect(() => {
    if (!postcode) return;

    (async () => {
      const data = await fetchPlansByPostcode(postcode);
      setPlans(data);
      setLoading(false);
    })();
  }, [postcode]);

  if (loading) return <p>Loading plans...</p>;

  return (
    <div>
      <h2>Energy Plans for Postcode {postcode}</h2>

      <label>
        Enter your monthly kWh usage:
        <input
          type="number"
          value={usage}
          placeholder="e.g. 600"
          onChange={(e) => setUsage(e.target.value)}
          style={{ marginLeft: "10px", padding: "4px" }}
        />
      </label>

      {plans.length === 0 ? (
        <p>No plans available.</p>
      ) : (
        <ul>{plans.map((plan) => renderPlanDetails(plan, usage))}</ul>
      )}
    </div>
  );
}

export default PlanFinder;
