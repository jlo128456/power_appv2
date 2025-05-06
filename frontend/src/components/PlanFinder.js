import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";


function PlanFinder() {
  const [plans, setPlans] = useState([]);
  const [searchParams] = useSearchParams();
  const postcode = searchParams.get("postcode");

  useEffect(() => {
    if (postcode) {
      fetch(`/api/energy-plans-by-postcode/${postcode}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setPlans(data);
          } else {
            setPlans([]);
          }
        });
    }
  }, [postcode]);

  return (
    <div>
      <h2>Energy Plans for Postcode {postcode}</h2>

      {plans.length === 0 ? (
        <p>No plans available.</p>
      ) : (
        <div className="plan-grid">
          {plans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <h3>{plan.plan_name}</h3>
              <p><strong>Provider:</strong> {plan.provider}</p>
              <p><strong>Usage Rate:</strong> {plan.usage_rate_cents}¢/kWh</p>
              <p><strong>Supply Charge:</strong> {plan.supply_charge_cents}¢/day</p>
              <p><strong>Solar Feed-in:</strong> {plan.solar_feed_in_cents}¢</p>
              <p><strong>Contract Length:</strong> {plan.contract_length_months} months</p>
              <p><strong>Green Energy:</strong> {plan.green_energy_percent}%</p>
              <p><strong>State:</strong> {plan.state}</p>
              <a href={plan.fact_sheet_url} target="_blank" rel="noopener noreferrer">
                View Fact Sheet
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlanFinder;
