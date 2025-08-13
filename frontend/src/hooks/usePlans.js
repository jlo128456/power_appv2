import { useCallback, useRef, useState } from "react";

function getBaseUrlSafe() {
  try {
    // If you have a global getBaseUrl(), use it
    // eslint-disable-next-line no-undef
    if (typeof getBaseUrl === "function") return getBaseUrl();
  } catch {}
  return ""; // same-origin fallback
}

function buildPlanUrls(postcode) {
  const base = getBaseUrlSafe();
  const pc = encodeURIComponent(postcode);
  return [
    `${base}/api/energy-plans-by-postcode/${pc}`,
    `${base}/api/energy-plans-by-postcode?postcode=${pc}`,
  ];
}

export default function usePlans(initialUsage = null) {
  const [plans, setPlans] = useState([]);
  const [usageHistory, setUsageHistory] = useState(initialUsage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const lastFetchedFor = useRef(null);

  const canRetry = useCallback(
    (pc) => lastFetchedFor.current !== pc || !!error,
    [error]
  );

  const fetchPlans = useCallback(async (pc) => {
    if (!pc) return;
    if (lastFetchedFor.current === pc) return; // avoid duplicates
    lastFetchedFor.current = pc;

    setLoading(true);
    setError("");

    try {
      const urls = buildPlanUrls(pc);
      let data = null;

      for (const url of urls) {
        const res = await fetch(url);
        if (res.ok) {
          data = await res.json();
          break;
        }
      }
      if (!data) throw new Error(`Failed to load plans for ${pc}`);

      setPlans(Array.isArray(data?.plans) ? data.plans : data || []);
      if (data?.usageHistory) setUsageHistory(data.usageHistory);
    } catch (e) {
      setError(e.message || "Something went wrong fetching plans.");
      lastFetchedFor.current = null; // allow retry
    } finally {
      setLoading(false);
      window.scrollTo(0, 0);
    }
  }, []);

  return { plans, usageHistory, loading, error, fetchPlans, canRetry };
}
