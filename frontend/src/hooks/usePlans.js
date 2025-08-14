// src/hooks/usePlans.js
import { useCallback, useMemo, useState } from "react";

function getBaseUrlSafe() {
  try {
    // eslint-disable-next-line no-undef
    if (typeof getBaseUrl === "function") return getBaseUrl();
  } catch {}
  return "";
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
  const [selectedId, setSelectedId] = useState(null);

  const select = useCallback((id) => setSelectedId(String(id)), []);

  const selectedPlan = useMemo(() => {
    if (!plans?.length || selectedId == null) return null;
    return plans.find(p => String(p._id) === String(selectedId)) || null;
  }, [plans, selectedId]);

  const fetchPlans = useCallback(async (pc) => {
    if (!pc) return;
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

      const raw = Array.isArray(data?.plans) ? data.plans : (data || []);
      // Normalize an internal _id for stable selection
      const withIds = raw.map((p, idx) => ({ ...p, _id: String(p.id ?? idx) }));
      setPlans(withIds);

      if (data?.usageHistory) setUsageHistory(data.usageHistory);
    } catch (e) {
      setError(e.message || "Something went wrong fetching plans.");
    } finally {
      setLoading(false);
      window.scrollTo(0, 0);
    }
  }, []);

  return {
    plans,
    usageHistory,
    loading,
    error,
    fetchPlans,
    // selection helpers
    selectedId,
    select,
    selectedPlan,
  };
}
