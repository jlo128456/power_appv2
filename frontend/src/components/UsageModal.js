import React, { useMemo } from "react";

export default function UsageModal({ open, onClose, usage = [] }) {
  // Prepare data for the chart
  const { max, items } = useMemo(() => {
    const vals = usage.map(u => Number(u.usage) || 0);
    const maxV = Math.max(1, ...vals); // Avoid divide-by-zero
    const mapped = usage.map((u, i) => ({
      key: `${u.month ?? i}-${i}`, // Unique key for React
      month: u.month ?? String(i + 1), // Month label
      value: Number(u.usage) || 0, // Usage value
    }));
    return { max: maxV, items: mapped };
  }, [usage]);

  // Don’t render if closed
  if (!open) return null;

  // Chart dimensions
  const W = 540, H = 260, pad = 30;
  const innerW = W - pad * 2;
  const innerH = H - pad * 2;
  const bw = items.length ? innerW / items.length : innerW;

  return (
    // Click outside to close
    <div className="modal-overlay open" onClick={onClose} role="dialog" aria-modal="true">
      {/* Stop click from closing when inside */}
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <h3>Usage History</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* Bar chart */}
        <div className="chart-wrap">
          <svg className="bar-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
            {/* X and Y axis */}
            <line className="axis" x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} />
            <line className="axis" x1={pad} y1={pad} x2={pad} y2={H - pad} />
            
            {/* Bars */}
            {items.map((d, i) => {
              const h = (d.value / max) * innerH; // Bar height
              const x = pad + i * bw + bw * 0.1; // Bar X position
              const y = H - pad - h; // Bar Y position
              const barW = bw * 0.8; // Bar width
              return (
                <g key={d.key}>
                  <rect className="bar-rect" x={x} y={y} width={barW} height={h} rx="4" />
                  <text className="bar-label" x={x + barW / 2} y={H - pad + 14}>{d.month}</text>
                </g>
              );
            })}

            {/* Max value label */}
            <text className="ymax-label" x={pad - 6} y={pad} textAnchor="end">
              {max} kWh
            </text>
          </svg>
        </div>

        {/* Footer actions */}
        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
