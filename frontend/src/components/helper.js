// helper function to reduce line of codes

export async function fetchPlansByPostcode(postcode) {
  try {
    const res = await fetch(`/api/energy-plans-by-postcode/${postcode}`);
    const data = await res.json();
    return res.ok ? data : [];
  } catch (err) {
    console.error("Failed to fetch plans:", err);
    return [];
  }
}

export function calculateEstimate(plan, usage) {
  const kwh = parseFloat(usage);
  if (!kwh || isNaN(kwh)) return null;

  const usageCost = (kwh * plan.usage_rate_cents) / 100;
  const supplyCost = (30 * plan.supply_charge_cents) / 100;
  return (usageCost + supplyCost).toFixed(2);
}

export function renderPlanDetails(plan, usage) {
  const estimate = calculateEstimate(plan, usage);

  return (
    <li key={plan.id}>
      <strong>{plan.plan_name}</strong> - {plan.provider_name}<br />
      Usage: {plan.usage_rate_cents}¢/kWh<br />
      Supply: {plan.supply_charge_cents}¢/day<br />
      Solar Feed-in: {plan.solar_feed_in_cents}¢<br />
      Green Energy: {plan.green_energy_percent}%<br />
      <a
        href={plan.fact_sheet_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Fact Sheet
      </a>
      <br />
      {usage && estimate && (
        <p><strong>Estimated Monthly Cost: ${estimate}</strong></p>
      )}
      <hr />
    </li>
  );
}
export function calculateYearlyCost(plan, monthlyUsage, monthlyExport = 0) {
  const usageCost = monthlyUsage * 12 * (plan.usage_rate_cents / 100);
  const supplyCost = 365 * (plan.supply_charge_cents / 100);
  const feedInCredit = monthlyExport * 12 * (plan.solar_feed_in_cents / 100);
  return (usageCost + supplyCost - feedInCredit).toFixed(2);
}

//handle logout
export function handleLogout(setUser) {
  setUser(null);
}
